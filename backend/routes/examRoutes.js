import express from 'express';
import { examTermController } from '../controllers/examTermController.js';

const router = express.Router();

// ── Term Structures (Step 1) ──
router.get('/term-structures', examTermController.list);
router.post('/term-structures', examTermController.create);
router.put('/term-structures/:id', examTermController.update);
router.delete('/term-structures/:id', examTermController.delete);

export default router;
