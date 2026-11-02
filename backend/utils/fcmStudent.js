import Student from '../models/Student.js';
import admin from '../config/firebase.js';

export async function sendToStudent(targetId, payload = {}) {
  try {
    const tokens = new Set();
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
        const parsed =
          typeof student.fcm_tokens === 'string'
            ? JSON.parse(student.fcm_tokens)
            : student.fcm_tokens;

        if (Array.isArray(parsed)) {
          parsed.forEach((t) => {
            if (typeof t === 'string' && t.trim().length > 0) {
              tokens.add(t.trim());
            }
          });
        }
      } catch (e) {
        console.warn(`[FCM] Error parsing fcm_tokens for ${targetId}:`, e.message);
      }
    }

    const tokenList = Array.from(tokens);
    if (tokenList.length === 0) {
      console.log(`ℹ️ [FCM] No registered devices/tokens for target: ${targetId}`);
      return { success: false, reason: 'No token' };
    }

    
    const sanitizedData = Object.entries(payload.data || {}).reduce((acc, [k, v]) => {
      if (v !== undefined && v !== null) {
        acc[k] = typeof v === 'object' ? JSON.stringify(v) : String(v);
      }
      return acc;
    }, {});

    const message = {
      notification: {
        title: payload.title || 'CampusEye Notification',
        body: payload.body || '',
      },
      data: sanitizedData,
      android: {
        priority: 'high',
        notification: {
          channelId: 'campuseye_channel',
          defaultSound: true,
          defaultVibrateTimings: true,
        },
      },
      tokens: tokenList,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(
      `✅ [FCM] Sent to target ${targetId} (${tokenList.length} devices): Success: ${response.successCount}, Failure: ${response.failureCount}`
    );

    if (response.failureCount > 0) {
      const invalidTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errorCode = resp.error?.code;
          if (
            errorCode === 'messaging/invalid-registration-token' ||
            errorCode === 'messaging/registration-token-not-registered'
          ) {
            invalidTokens.push(tokenList[idx]);
          }
        }
      });

      if (invalidTokens.length > 0) {
        const validTokens = tokenList.filter((t) => !invalidTokens.includes(t));
        try {
          await Student.query()
            .where('id', student.id)
            .patch({
              fcm_tokens:
                typeof student.fcm_tokens === 'string'
                  ? JSON.stringify(validTokens)
                  : validTokens,
            });
          console.log(`🧹 [FCM] Removed ${invalidTokens.length} stale tokens for target ${targetId}`);
        } catch (cleanupErr) {
          console.warn('[FCM] Failed to clean up invalid tokens:', cleanupErr.message);
        }
      }
    }

    return { success: true, response };
  } catch (err) {
    console.error(`❌ [FCM] Send error for target ${targetId}:`, err?.message || err);
    return { success: false, error: err };
  }
}

export const sendToUser = sendToStudent;