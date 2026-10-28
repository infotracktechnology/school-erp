import express from 'express';
import { timetableController } from '../controllers/timetableController.js';

const router = express.Router();

// ── 1. Structures Master ──
router.get('/structures', timetableController.getStructures);
router.post('/structures', timetableController.createStructure);
router.delete('/structures/:id', timetableController.deleteStructure);

// ── 2. Class & Section Mappings ──
router.post('/mappings', timetableController.saveClassMappings);
router.post('/mappings/unassign', timetableController.unassignClass);
router.get('/subject-mappings', timetableController.getClassSubjectMappings);
router.post('/subject-mappings', timetableController.saveClassSubjectMappings);

// ── 3. Weekly Grid & Slots Allocation ──
router.get('/weekly', timetableController.getWeeklyTimetable);
router.post('/slot', timetableController.saveSlot);
router.post('/slot/clear', timetableController.clearSlot);

export default router;
