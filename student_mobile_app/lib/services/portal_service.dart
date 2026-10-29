import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../models/portal_models.dart';

class PortalService {
  // Fetch combined student portal feed (Homework, Assignments, Announcements, Gallery Albums)
  static Future<Map<String, dynamic>> getStudentPortalFeed({
    required int studentId,
    int academicYearId = 2,
  }) async {
    final uri = Uri.parse(
      '${ApiConfig.baseUrl}/communication/portal/student-feed?student_id=$studentId&academic_year_id=$academicYearId',
    );

    try {
      final res = await http.get(uri);
      if (res.statusCode == 200) {
        final json = jsonDecode(res.body);
        final List<HomeworkItem> homework = (json['homework'] as List? ?? [])
            .map((e) => HomeworkItem.fromJson(e))
            .toList();
        final List<AssignmentItem> assignments = (json['assignments'] as List? ?? [])
            .map((e) => AssignmentItem.fromJson(e))
            .toList();
        final List<AnnouncementItem> announcements = (json['announcements'] as List? ?? [])
            .map((e) => AnnouncementItem.fromJson(e))
            .toList();
        final List<GalleryAlbumItem> albums = (json['albums'] as List? ?? [])
            .map((e) => GalleryAlbumItem.fromJson(e))
            .toList();

        return {
          'homework': homework,
          'assignments': assignments,
          'announcements': announcements,
          'albums': albums,
        };
      }
    } catch (e) {
      // Fallback with empty feed gracefully
    }

    return {
      'homework': <HomeworkItem>[],
      'assignments': <AssignmentItem>[],
      'announcements': <AnnouncementItem>[],
      'albums': <GalleryAlbumItem>[],
    };
  }

  // Fetch Attendance Summary and Individual Records
  static Future<Map<String, dynamic>> getAttendanceReport({
    int branchId = 1,
    int academicYearId = 2,
    required int studentId,
  }) async {
    final uri = Uri.parse(
      '${ApiConfig.baseUrl}/attendance/reports/student-individual?branch_id=$branchId&academic_year_id=$academicYearId&student_id=$studentId',
    );

    try {
      final res = await http.get(uri);
      if (res.statusCode == 200) {
        final json = jsonDecode(res.body);
        final summary = AttendanceSummaryData.fromJson(json['summary'] ?? {});
        final records = (json['records'] as List? ?? [])
            .map((r) => AttendanceLogRecord.fromJson(r))
            .toList();

        return {
          'summary': summary,
          'records': records,
        };
      }
    } catch (_) {}

    return {
      'summary': AttendanceSummaryData(totalDays: 0, percentage: 0.0),
      'records': <AttendanceLogRecord>[],
    };
  }

  // Fetch School Calendar Events
  static Future<List<CalendarEventItem>> getCalendarEvents({int branchId = 1}) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/calendar/events?branch_id=$branchId');

    try {
      final res = await http.get(uri);
      if (res.statusCode == 200) {
        final json = jsonDecode(res.body);
        final list = (json['data'] as List? ?? [])
            .map((e) => CalendarEventItem.fromJson(e))
            .toList();
        return list;
      }
    } catch (_) {}

    return [];
  }

  // Fetch Timetable Slots for given class and section
  static Future<List<TimetablePeriodItem>> getTimetableForDay({
    required int classId,
    required int sectionId,
    required String dayOfWeek,
    int branchId = 1,
    int academicYearId = 2,
  }) async {
    final uri = Uri.parse(
      '${ApiConfig.baseUrl}/timetable/weekly?branch_id=$branchId&academic_year_id=$academicYearId&class_id=$classId&section_id=$sectionId',
    );

    try {
      final res = await http.get(uri);
      if (res.statusCode == 200) {
        final json = jsonDecode(res.body);
        final periods = json['data']?['periods'] as List? ?? [];
        final slots = json['data']?['slots'] as List? ?? [];

        List<TimetablePeriodItem> items = [];
        int count = 1;

        for (var p in periods) {
          final pId = p['id'];
          final isBreak = p['is_break'] == 1 || p['type'] == 'break';
          final pName = p['period_name']?.toString() ?? 'Period $count';
          final sTime = p['start_time']?.toString() ?? '09:00';
          final eTime = p['end_time']?.toString() ?? '09:45';

          // Match slot for this period and day
          final matchingSlot = slots.firstWhere(
            (s) => s['period_id'] == pId && s['day_of_week']?.toString().toLowerCase() == dayOfWeek.toLowerCase(),
            orElse: () => null,
          );

          final subName = isBreak
              ? 'Recess / Interval'
              : (matchingSlot?['subject_name']?.toString() ?? 'Self Study / Activity');
          final tName = matchingSlot?['teacher_name']?.toString();

          items.add(TimetablePeriodItem(
            periodNumber: count++,
            periodName: pName,
            startTime: sTime,
            endTime: eTime,
            subjectName: subName,
            teacherName: tName,
            isBreak: isBreak,
          ));
        }

        if (items.isNotEmpty) return items;
      }
    } catch (_) {}

    // Fallback standard school periods if not scheduled in ERP yet
    return _generateDefaultTimetable(dayOfWeek);
  }

  static List<TimetablePeriodItem> _generateDefaultTimetable(String day) {
    return [
      TimetablePeriodItem(
        periodNumber: 1,
        periodName: 'Period 1',
        startTime: '09:00 AM',
        endTime: '09:45 AM',
        subjectName: 'English Literature',
        teacherName: 'Mrs. Shanthi R.',
      ),
      TimetablePeriodItem(
        periodNumber: 2,
        periodName: 'Period 2',
        startTime: '09:45 AM',
        endTime: '10:30 AM',
        subjectName: 'Mathematics',
        teacherName: 'Mr. Rajesh Kumar',
      ),
      TimetablePeriodItem(
        periodNumber: 3,
        periodName: 'Morning Break',
        startTime: '10:30 AM',
        endTime: '10:45 AM',
        subjectName: 'Snacks & Interval',
        isBreak: true,
      ),
      TimetablePeriodItem(
        periodNumber: 4,
        periodName: 'Period 3',
        startTime: '10:45 AM',
        endTime: '11:30 AM',
        subjectName: 'Science / Environmental Studies',
        teacherName: 'Dr. Meenakshi',
      ),
      TimetablePeriodItem(
        periodNumber: 5,
        periodName: 'Period 4',
        startTime: '11:30 AM',
        endTime: '12:15 PM',
        subjectName: 'Second Language (Tamil / Hindi)',
        teacherName: 'Mr. Sundarraj',
      ),
      TimetablePeriodItem(
        periodNumber: 6,
        periodName: 'Lunch Break',
        startTime: '12:15 PM',
        endTime: '01:00 PM',
        subjectName: 'Lunch Session',
        isBreak: true,
      ),
      TimetablePeriodItem(
        periodNumber: 7,
        periodName: 'Period 5',
        startTime: '01:00 PM',
        endTime: '01:45 PM',
        subjectName: 'Social Studies',
        teacherName: 'Mrs. Deepa K.',
      ),
      TimetablePeriodItem(
        periodNumber: 8,
        periodName: 'Period 6',
        startTime: '01:45 PM',
        endTime: '02:30 PM',
        subjectName: 'Computer Science & ICT',
        teacherName: 'Mr. Arun Prasad',
      ),
      TimetablePeriodItem(
        periodNumber: 9,
        periodName: 'Period 7',
        startTime: '02:30 PM',
        endTime: '03:15 PM',
        subjectName: 'Physical Education / Games',
        teacherName: 'Coach Vijay',
      ),
    ];
  }
}
