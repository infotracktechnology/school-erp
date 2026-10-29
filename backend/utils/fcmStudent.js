import UserFCMToken from '../models/UserFCMToken.js';
import admin from '../config/firebase.js';

export async function sendToUser(userId, payload) {
  try {
    const tokenRecord = await UserFCMToken.query().where('user_id', userId).first();
    if (!tokenRecord || !tokenRecord.token) {
      console.log(`ℹ️ [FCM] No token found for user_id: ${userId}`);
      return { success: false, reason: 'No token' };
    }

    const message = {
      token: tokenRecord.token,
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
    };

    const response = await admin.messaging().send(message);
    console.log(`✅ [FCM] Successfully sent notification to user_id ${userId}:`, response);
    return { success: true, response };
  } catch (err) {
    console.error(`❌ [FCM] Send error for user_id ${userId}:`, err?.message || err);
    return { success: false, error: err };
  }
}

