import { Router } from 'express';
import { userManagementController } from '../controllers/userManagementController.js';

export const userManagementRouter = Router();

userManagementRouter.get('/', userManagementController.getUsers);
userManagementRouter.post('/', userManagementController.createUser);
userManagementRouter.put('/:id', userManagementController.updateUser);
userManagementRouter.patch('/:id/password', userManagementController.resetPassword);
userManagementRouter.delete('/:id', userManagementController.deleteUser);
