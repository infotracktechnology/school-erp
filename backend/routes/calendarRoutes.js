import express from 'express';
import { calendarController } from '../controllers/calendarController.js';

const router = express.Router();

router.get('/events', calendarController.getEvents);
router.post('/events', calendarController.createEvent);
router.put('/events/:id', calendarController.updateEvent);
router.delete('/events/:id', calendarController.deleteEvent);
router.get('/upcoming', calendarController.getUpcoming);

export default router;
