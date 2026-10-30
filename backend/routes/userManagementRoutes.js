import { Router } from 'express';
import { userManagementController } from '../controllers/userManagementController.js';

export const userManagementRouter = Router();

// Register FCM token for a user (student)
userManagementRouter.post('/:id/fcm-token', async (req, res) => {
  const userId = req.params.id;
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, msg: 'FCM token required' });
  }
  try {
    const UserFCMToken = (await import('../models/UserFCMToken.js')).default;
    const existing = await UserFCMToken.query().where('user_id', userId).first();
    if (existing) {
      await UserFCMToken.query().where('user_id', userId).update({
        token,
        updated_at: new Date()
      });
    } else {
      await UserFCMToken.query().insert({
        user_id: userId,
        token,
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    console.log(`✅ [FCM Endpoint] Successfully saved token for user_id: ${userId}`);
    return res.json({ success: true, msg: 'FCM token saved' });
  } catch (err) {
    console.error('FCM token save error:', err);
    return res.status(500).json({ success: false, msg: 'Error saving token' });
  }
});

userManagementRouter.get('/', userManagementController.getUsers);
userManagementRouter.post('/', userManagementController.createUser);
userManagementRouter.put('/:id', userManagementController.updateUser);
userManagementRouter.patch('/:id/password', userManagementController.resetPassword);
userManagementRouter.delete('/:id', userManagementController.deleteUser);
