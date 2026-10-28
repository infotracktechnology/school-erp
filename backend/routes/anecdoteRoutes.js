import express from 'express';
import { anecdoteController } from '../controllers/anecdoteController.js';

const router = express.Router();

router.get('/', anecdoteController.getAnecdotes);
router.post('/', anecdoteController.createAnecdote);
router.put('/:id', anecdoteController.updateAnecdote);
router.delete('/:id', anecdoteController.deleteAnecdote);
router.get('/reports/summary', anecdoteController.getReportsSummary);
router.get('/reports/class-matrix', anecdoteController.getClassMatrixReport);
router.get('/reports/student-dossier/:student_id', anecdoteController.getStudentDossier);
router.get('/student/:student_id', anecdoteController.getStudentTimeline);

export default router;
