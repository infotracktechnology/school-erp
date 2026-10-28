import React from 'react';
import { AcademicCalendarView } from '../components/calendar/AcademicCalendarView';

export const CalendarPage = ({ showToast }) => {
  return <AcademicCalendarView showToast={showToast} />;
};

export default CalendarPage;
