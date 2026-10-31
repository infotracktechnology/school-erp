import Student from '../models/Student.js';
import admin from '../config/firebase.js';

/**
 * Send notification to a student across all registered devices (fcm_tokens)
 * @param {number} studentId - Student primary key ID
 * @param {object} payload - Notification payload { title, body, data }
 */
export async function sendToStudent(studentId, payload) {
  try {
    const student = await Student.query().where('id', studentId).first();
    if (!student) {
      console.log(`ℹ️ [FCM] Student not found: ${studentId}`);
      return { success: false, reason: 'Student not found' };
    }

    let tokens = [];
    if (student.fcm_tokens) {
      try {
        tokens = typeof student.fcm_tokens === 'string' ? JSON.parse(student.fcm_tokens) : student.fcm_tokens;
        if (!Array.isArray(tokens)) tokens = [];
      } catch (e) {
        tokens = [];
      }
    }

    // Filter valid non-empty string tokens
    tokens = tokens.filter(t => typeof t === 'string' && t.trim().length > 0);

    if (tokens.length === 0) {
      console.log(`ℹ️ [FCM] No registered devices/tokens for student_id: ${studentId}`);
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
      tokens: tokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`✅ [FCM] Sent to student ${studentId} (${tokens.length} devices): Success: ${response.successCount}, Failure: ${response.failureCount}`);

    // If any tokens failed due to unregistration / invalid registration, prune them
    if (response.failureCount > 0) {
      const tokensToRemove = new Set();
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errCode = resp.error?.code;
          if (
            errCode === 'messaging/invalid-registration-token' ||
            errCode === 'messaging/registration-token-not-registered'
          ) {
            tokensToRemove.add(tokens[idx]);
          }
        }
      });

      if (tokensToRemove.size > 0) {
        const remainingTokens = tokens.filter(t => !tokensToRemove.has(t));
        await Student.query().where('id', studentId).update({
          fcm_tokens: JSON.stringify(remainingTokens),
          updated_at: new Date()
        });
        console.log(`🧹 [FCM] Pruned ${tokensToRemove.size} expired tokens for student ${studentId}`);
      }
    }

    return { success: true, response };
  } catch (err) {
    console.error(`❌ [FCM] Send error for student_id ${studentId}:`, err?.message || err);
    return { success: false, error: err };
  }
}

// Backward compatibility alias
export const sendToUser = sendToStudent;
