class HomeworkItem {
  final int id;
  final String title;
  final String subject;
  final String? description;
  final String assignedDate;
  final String dueDate;
  final String? status;
  final List<String> attachments;

  HomeworkItem({
    required this.id,
    required this.title,
    required this.subject,
    this.description,
    required this.assignedDate,
    required this.dueDate,
    this.status,
    this.attachments = const [],
  });

  factory HomeworkItem.fromJson(Map<String, dynamic> json) {
    List<String> parsedAttachments = [];
    if (json['attachments'] != null) {
      if (json['attachments'] is List) {
        parsedAttachments = (json['attachments'] as List).map((e) => e.toString()).toList();
      } else if (json['attachments'] is String && (json['attachments'] as String).isNotEmpty) {
        parsedAttachments = [json['attachments'].toString()];
      }
    }

    return HomeworkItem(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      title: json['title']?.toString() ?? json['description']?.toString() ?? 'Homework Task',
      subject: json['subject']?.toString() ?? json['subject_name']?.toString() ?? 'General',
      description: json['description']?.toString() ?? json['content']?.toString(),
      assignedDate: json['assigned_date']?.toString() ?? json['created_at']?.toString() ?? '',
      dueDate: json['due_date']?.toString() ?? '',
      status: json['status']?.toString() ?? 'Assigned',
      attachments: parsedAttachments,
    );
  }
}

class AssignmentItem {
  final int id;
  final String title;
  final String subject;
  final String? description;
  final String dueDate;
  final int maxMarks;
  final int? obtainedMarks;
  final String? grade;
  final String? teacherFeedback;
  final String? submittedAt;
  final String status;
  final List<String> attachments;

  AssignmentItem({
    required this.id,
    required this.title,
    required this.subject,
    this.description,
    required this.dueDate,
    this.maxMarks = 100,
    this.obtainedMarks,
    this.grade,
    this.teacherFeedback,
    this.submittedAt,
    this.status = 'Pending',
    this.attachments = const [],
  });

  factory AssignmentItem.fromJson(Map<String, dynamic> json) {
    List<String> parsedAttachments = [];
    if (json['attachments'] != null && json['attachments'] is List) {
      parsedAttachments = (json['attachments'] as List).map((e) => e.toString()).toList();
    }

    return AssignmentItem(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      title: json['title']?.toString() ?? 'Assignment',
      subject: json['subject']?.toString() ?? json['subject_name']?.toString() ?? 'General',
      description: json['description']?.toString(),
      dueDate: json['due_date']?.toString() ?? json['submission_date']?.toString() ?? '',
      maxMarks: json['max_marks'] is int ? json['max_marks'] : int.tryParse(json['max_marks']?.toString() ?? '100') ?? 100,
      obtainedMarks: json['obtained_marks'] != null ? int.tryParse(json['obtained_marks'].toString()) : null,
      grade: json['grade']?.toString(),
      teacherFeedback: json['teacher_feedback']?.toString() ?? json['remarks']?.toString(),
      submittedAt: json['submitted_at']?.toString(),
      status: json['status']?.toString() ?? 'Pending',
      attachments: parsedAttachments,
    );
  }
}

class AnnouncementItem {
  final int id;
  final String title;
  final String message;
  final String category;
  final String publishedDate;
  final String priority;
  final String? issuedBy;
  final String? targetAudience;
  final String? attachmentUrl;

  AnnouncementItem({
    required this.id,
    required this.title,
    required this.message,
    required this.category,
    required this.publishedDate,
    this.priority = 'Normal',
    this.issuedBy,
    this.targetAudience,
    this.attachmentUrl,
  });

  factory AnnouncementItem.fromJson(Map<String, dynamic> json) {
    return AnnouncementItem(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      title: json['title']?.toString() ?? json['announcement_title']?.toString() ?? 'Notice',
      message: json['message']?.toString() ?? json['content']?.toString() ?? json['description']?.toString() ?? '',
      category: json['category']?.toString() ?? json['announcement_type']?.toString() ?? 'General Notice',
      publishedDate: json['created_at']?.toString() ?? json['published_at']?.toString() ?? '',
      priority: json['priority']?.toString() ?? (json['is_urgent'] == 1 ? 'High' : 'Normal'),
      issuedBy: json['issued_by']?.toString() ?? json['sender_name']?.toString(),
      targetAudience: json['target_audience']?.toString() ?? json['audience']?.toString(),
      attachmentUrl: json['attachment_url']?.toString() ?? json['file_url']?.toString(),
    );
  }
}

class CalendarEventItem {
  final int id;
  final String title;
  final String? description;
  final String eventType;
  final String startDate;
  final String? endDate;
  final String? startTime;
  final String? endTime;
  final String? venue;

  CalendarEventItem({
    required this.id,
    required this.title,
    this.description,
    required this.eventType,
    required this.startDate,
    this.endDate,
    this.startTime,
    this.endTime,
    this.venue,
  });

  factory CalendarEventItem.fromJson(Map<String, dynamic> json) {
    return CalendarEventItem(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      title: json['title']?.toString() ?? 'School Event',
      description: json['description']?.toString(),
      eventType: json['event_type']?.toString() ?? 'Event',
      startDate: json['start_date']?.toString() ?? '',
      endDate: json['end_date']?.toString(),
      startTime: json['start_time']?.toString(),
      endTime: json['end_time']?.toString(),
      venue: json['venue']?.toString() ?? json['location']?.toString(),
    );
  }
}

class GalleryAlbumItem {
  final int id;
  final String title;
  final String? description;
  final String eventDate;
  final String? coverImageUrl;
  final String category;
  final List<String> photos;

  GalleryAlbumItem({
    required this.id,
    required this.title,
    this.description,
    required this.eventDate,
    this.coverImageUrl,
    this.category = 'General',
    this.photos = const [],
  });

  factory GalleryAlbumItem.fromJson(Map<String, dynamic> json) {
    List<String> photoUrls = [];
    if (json['cover_image_url'] != null) {
      photoUrls.add(json['cover_image_url'].toString());
    }
    if (json['photos'] != null && json['photos'] is List) {
      photoUrls.addAll((json['photos'] as List).map((p) => p.toString()));
    }

    return GalleryAlbumItem(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      title: json['album_name']?.toString() ?? json['event_name']?.toString() ?? 'School Event Album',
      description: json['description']?.toString(),
      eventDate: json['event_date']?.toString() ?? '',
      coverImageUrl: json['cover_image_url']?.toString(),
      category: json['category']?.toString() ?? 'General',
      photos: photoUrls,
    );
  }
}

class AttendanceSummaryData {
  final int totalDays;
  final int present;
  final int absent;
  final int halfDay;
  final int leave;
  final double percentage;

  AttendanceSummaryData({
    this.totalDays = 0,
    this.present = 0,
    this.absent = 0,
    this.halfDay = 0,
    this.leave = 0,
    this.percentage = 0.0,
  });

  factory AttendanceSummaryData.fromJson(Map<String, dynamic> json) {
    return AttendanceSummaryData(
      totalDays: json['total_days'] is int ? json['total_days'] : int.tryParse(json['total_days']?.toString() ?? '0') ?? 0,
      present: json['present'] is int ? json['present'] : int.tryParse(json['present']?.toString() ?? '0') ?? 0,
      absent: json['absent'] is int ? json['absent'] : int.tryParse(json['absent']?.toString() ?? '0') ?? 0,
      halfDay: json['half_day'] is int ? json['half_day'] : int.tryParse(json['half_day']?.toString() ?? '0') ?? 0,
      leave: json['leave'] is int ? json['leave'] : int.tryParse(json['leave']?.toString() ?? '0') ?? 0,
      percentage: (json['attendance_percentage'] != null)
          ? double.tryParse(json['attendance_percentage'].toString()) ?? 0.0
          : 0.0,
    );
  }
}

class AttendanceLogRecord {
  final int id;
  final String date;
  final String status;
  final String? session1;
  final String? session2;
  final String? remarks;

  AttendanceLogRecord({
    required this.id,
    required this.date,
    required this.status,
    this.session1,
    this.session2,
    this.remarks,
  });

  factory AttendanceLogRecord.fromJson(Map<String, dynamic> json) {
    return AttendanceLogRecord(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      date: json['attendance_date']?.toString() ?? '',
      status: json['status']?.toString() ?? 'Present',
      session1: json['morning_status']?.toString() ?? json['session_1_name']?.toString(),
      session2: json['afternoon_status']?.toString() ?? json['session_2_name']?.toString(),
      remarks: json['remarks']?.toString() ?? json['custom_remark']?.toString(),
    );
  }
}

class TimetablePeriodItem {
  final int periodNumber;
  final String periodName;
  final String startTime;
  final String endTime;
  final String subjectName;
  final String? teacherName;
  final String? room;
  final bool isBreak;

  TimetablePeriodItem({
    required this.periodNumber,
    required this.periodName,
    required this.startTime,
    required this.endTime,
    required this.subjectName,
    this.teacherName,
    this.room,
    this.isBreak = false,
  });
}
