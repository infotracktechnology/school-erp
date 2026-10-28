import express from 'express';
import {
  getStaffList,
  createStaff,
  updateStaff,
  deleteStaff,
  getAllocations,
  createOrUpdateAllocation,
  deleteAllocation,
  getWorkloadSummary,
  updateStaffCredentials,
  bulkUpdateStaffCredentials
} from '../controllers/staffController.js';

const router = express.Router();

router.get('/', getStaffList);
router.post('/', createStaff);
router.post('/bulk-credentials', bulkUpdateStaffCredentials);
router.put('/:id', updateStaff);
router.put('/:id/credentials', updateStaffCredentials);
router.delete('/:id', deleteStaff);

// Academic Allocations
router.get('/allocations', getAllocations);
router.post('/allocations', createOrUpdateAllocation);
router.delete('/allocations/:id', deleteAllocation);

// Workload Summary
router.get('/workload', getWorkloadSummary);

export default router;
