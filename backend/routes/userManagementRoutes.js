import { Router } from 'express';
import { userManagementController } from '../controllers/userManagementController.js';

export const userManagementRouter = Router();

// Register FCM token for a user (student)
userManagementRouter.post('/:id/fcm-token', async (req, res) => {
  const userId = req.params.id;
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ msg: 'FCM token required' });
  }
  try {
    const UserFCMToken = (await import('../models/UserFCMToken.js')).default;
    await UserFCMToken.query()
      .insert({ user_id: userId, token })
      .onConflict(['user_id'])
      .merge({ token, updated_at: new Date() });
    return res.json({ msg: 'FCM token saved' });
  } catch (err) {
    console.error('FCM token save error:', err);
    return res.status(500).json({ msg: 'Error saving token' });
  }
});

userManagementRouter.get('/', userManagementController.getUsers);
userManagementRouter.post('/', userManagementController.createUser);
userManagementRouter.put('/:id', userManagementController.updateUser);
userManagementRouter.patch('/:id/password', userManagementController.resetPassword);
userManagementRouter.delete('/:id', userManagementController.deleteUser);
