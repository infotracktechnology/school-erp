import express from 'express';
import {
  getMasterRoles,
  createRole,
  updateRole,
  deleteRole,
  getSystemMenus,
  getRoleMenuPermissions,
  updateRoleMenuPermissions,
  getStaffMenuPermissions,
  updateStaffMenuPermissions
} from '../controllers/permissionController.js';

const router = express.Router();

// Master Roles (CRUD)
router.get('/roles', getMasterRoles);
router.post('/roles', createRole);
router.put('/roles/:id', updateRole);
router.delete('/roles/:id', deleteRole);

// System Menus Catalog
router.get('/menus', getSystemMenus);

// Role / Category Defaults (Teaching vs Non-Teaching)
router.get('/role-defaults', getRoleMenuPermissions);
router.post('/role-defaults', updateRoleMenuPermissions);

// Staff Specific Overrides
router.get('/staff/:staffId', getStaffMenuPermissions);
router.post('/staff/:staffId', updateStaffMenuPermissions);

export default router;
