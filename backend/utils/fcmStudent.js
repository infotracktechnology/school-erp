import Student from '../models/Student.js';
import admin from '../config/firebase.js';
import { sutando } from '../config/database.js';

const knex = (table) => sutando.connection().table(table);

/**
 * Send notification to a student across all registered devices
 * Checks both student.fcm_tokens and user_fcm_tokens table
 * @param {number} targetId - Student ID or User ID
 * @param {object} payload - Notification payload { title, body, data }
 */
export async function sendToStudent(targetId, payload) {
  try {
    const tokens = new Set();

    // 1. Find student by id OR user_id
    let student = null;
    try {
      student = await Student.query()
        .where('id', targetId)
        .orWhere('user_id', targetId)
        .first();
    } catch (e) {
      console.warn('[FCM] Error querying student:', e.message);
    }

    if (student && student.fcm_tokens) {
      try {
        const parsed = typeof student.fcm_tokens === 'string' ? JSON.parse(student.fcm_tokens) : student.fcm_tokens;
        if (Array.isArray(parsed)) {
          parsed.forEach(t => {
            if (typeof t === 'string' && t.trim().length > 0) tokens.add(t.trim());
          });
        }
      } catch (e) {}
    }

    // 2. Also check user_fcm_tokens table
    try {
      const hasUserFcm = await knex.schema.hasTable('user_fcm_tokens');
      if (hasUserFcm) {
        const uids = [targetId];
        if (student && student.user_id) uids.push(student.user_id);
        const rows = await knex('user_fcm_tokens').whereIn('user_id', uids).select('token');
        rows.forEach(r => {
          if (r.token && typeof r.token === 'string' && r.token.trim().length > 0) {
            tokens.add(r.token.trim());
          }
        });
      }
    } catch (e) {
      console.warn('[FCM] Error checking user_fcm_tokens:', e.message);
    }

    const tokenList = Array.from(tokens);
    if (tokenList.length === 0) {
      console.log(`ℹ️ [FCM] No registered devices/tokens for target: ${targetId}`);
      return { success: false, reason: 'No token' };
    }

    const message = {
      notification: {
        title: payload.title || 'CampusEye Notification',
        body: payload.body || '',
      },
      data: Object.fromEntries(
        Object.entries(payload.data || {}).map(([k, v]) => [k, String(v)])
      ),
      android: {
        priority: 'high',
        notification: {
          channelId: 'campuseye_channel',
          priority: 'high',
          defaultSound: true,
          defaultVibrateTimings: true,
        },
      },
      tokens: tokenList,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`✅ [FCM] Sent to target ${targetId} (${tokenList.length} devices): Success: ${response.successCount}, Failure: ${response.failureCount}`);

    // Prune invalid tokens from student if needed
    if (response.failureCount > 0 && student) {
      const tokensToRemove = new Set();
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errCode = resp.error?.code;
          if (
            errCode === 'messaging/invalid-registration-token' ||
            errCode === 'messaging/registration-token-not-registered'
          ) {
            tokensToRemove.add(tokenList[idx]);
          }
        }
      });

      if (tokensToRemove.size > 0) {
        let currentTokens = [];
        try {
          currentTokens = typeof student.fcm_tokens === 'string' ? JSON.parse(student.fcm_tokens) : student.fcm_tokens;
        } catch (_) {}
        if (Array.isArray(currentTokens)) {
          const remainingTokens = currentTokens.filter(t => !tokensToRemove.has(t));
          await Student.query().where('id', student.id).update({
            fcm_tokens: JSON.stringify(remainingTokens),
            updated_at: new Date()
          });
        }
      }
    }

    return { success: true, response };
  } catch (err) {
    console.error(`❌ [FCM] Send error for target ${targetId}:`, err?.message || err);
    return { success: false, error: err };
  }
}

// Backward compatibility alias
export const sendToUser = sendToStudent;
