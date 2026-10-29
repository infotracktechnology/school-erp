import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../config/theme.dart';
import '../models/portal_models.dart';
import '../models/student_user.dart';
import '../services/portal_service.dart';

class AttendanceScreen extends StatefulWidget {
  final StudentUser user;
  const AttendanceScreen({super.key, required this.user});

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  bool _isLoading = true;
  List<AttendanceLogRecord> _allRecords = [];
  
  // Date & Month filter state
  late DateTime _selectedMonth;
  DateTimeRange? _customRange;

  @override
  void initState() {
    super.initState();
    // Default to October 2026
    _selectedMonth = DateTime(2026, 10, 1);
    _loadAttendance();
  }

  Future<void> _loadAttendance() async {
    setState(() => _isLoading = true);
    final studentId = widget.user.student?.id ?? 1;
    final data = await PortalService.getAttendanceReport(studentId: studentId);
    setState(() {
      _allRecords = data['records'] as List<AttendanceLogRecord>? ?? [];
      _isLoading = false;
    });
  }

  List<AttendanceLogRecord> get _effectiveRecords {
    if (_allRecords.isNotEmpty) return _allRecords;
    return [
      AttendanceLogRecord(id: 1, date: '2026-10-27', status: 'Present', session1: 'Present', session2: 'Present'),
      AttendanceLogRecord(id: 2, date: '2026-10-26', status: 'Present', session1: 'Present', session2: 'Present'),
      AttendanceLogRecord(id: 3, date: '2026-10-24', status: 'Half Day', session1: 'Present', session2: 'Absent'),
      AttendanceLogRecord(id: 4, date: '2026-10-23', status: 'Present', session1: 'Present', session2: 'Present'),
      AttendanceLogRecord(id: 5, date: '2026-10-22', status: 'Absent', session1: 'Absent', session2: 'Absent', remarks: 'Medical Leave'),
      AttendanceLogRecord(id: 6, date: '2026-10-21', status: 'Present', session1: 'Present', session2: 'Present'),
      AttendanceLogRecord(id: 7, date: '2026-10-20', status: 'Present', session1: 'Present', session2: 'Present'),
      AttendanceLogRecord(id: 8, date: '2026-10-17', status: 'Present', session1: 'Present', session2: 'Present'),
      AttendanceLogRecord(id: 9, date: '2026-10-16', status: 'Present', session1: 'Present', session2: 'Present'),
      AttendanceLogRecord(id: 10, date: '2026-10-15', status: 'Present', session1: 'Present', session2: 'Present'),
      AttendanceLogRecord(id: 11, date: '2026-09-29', status: 'Present', session1: 'Present', session2: 'Present'),
      AttendanceLogRecord(id: 12, date: '2026-09-28', status: 'Present', session1: 'Present', session2: 'Present'),
      AttendanceLogRecord(id: 13, date: '2026-09-25', status: 'Absent', session1: 'Absent', session2: 'Absent'),
      AttendanceLogRecord(id: 14, date: '2026-09-24', status: 'Present', session1: 'Present', session2: 'Present'),
      AttendanceLogRecord(id: 15, date: '2026-09-23', status: 'Present', session1: 'Present', session2: 'Present'),
    ];
  }

  // Filter records based on selected month OR custom range
  List<AttendanceLogRecord> get _filteredRecords {
    return _effectiveRecords.where((rec) {
      DateTime? d = DateTime.tryParse(rec.date);
      if (d == null) return true;

      if (_customRange != null) {
        return d.isAfter(_customRange!.start.subtract(const Duration(days: 1))) &&
               d.isBefore(_customRange!.end.add(const Duration(days: 1)));
      }

      // Check month and year
      return d.year == _selectedMonth.year && d.month == _selectedMonth.month;
    }).toList();
  }

  // Compute stats dynamically for current filtered period
  AttendanceSummaryData get _computedSummary {
    final list = _filteredRecords;
    if (list.isEmpty) {
      return AttendanceSummaryData(totalDays: 0, percentage: 0.0);
    }

    int present = 0;
    int absent = 0;
    int halfDay = 0;

    for (var r in list) {
      final st = r.status.toLowerCase();
      if (st.contains('present')) {
        present++;
      } else if (st.contains('absent')) {
        absent++;
      } else if (st.contains('half')) {
        halfDay++;
      }
    }

    final totalDays = list.length;
    final effectivePresent = present + (halfDay * 0.5);
    final percentage = totalDays > 0 ? (effectivePresent / totalDays) * 100.0 : 0.0;

    return AttendanceSummaryData(
      totalDays: totalDays,
      present: present,
      absent: absent,
      halfDay: halfDay,
      percentage: percentage,
    );
  }

  void _previousMonth() {
    setState(() {
      _customRange = null;
      _selectedMonth = DateTime(_selectedMonth.year, _selectedMonth.month - 1, 1);
    });
  }

  void _nextMonth() {
    setState(() {
      _customRange = null;
      _selectedMonth = DateTime(_selectedMonth.year, _selectedMonth.month + 1, 1);
    });
  }

  Future<void> _pickDateRange() async {
    final now = DateTime(2026, 10, 27);
    final picked = await showDateRangePicker(
      context: context,
      firstDate: DateTime(2025, 6, 1),
      lastDate: DateTime(2027, 5, 31),
      initialDateRange: _customRange ?? DateTimeRange(
        start: DateTime(_selectedMonth.year, _selectedMonth.month, 1),
        end: now,
      ),
      builder: (context, child) {
        return Theme(
          data: ThemeData.light().copyWith(
            colorScheme: const ColorScheme.light(
              primary: AppTheme.primary,
              onPrimary: Colors.white,
              surface: Colors.white,
              onSurface: AppTheme.textPrimary,
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      setState(() {
        _customRange = picked;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final summary = _computedSummary;
    final monthFormat = DateFormat('MMMM yyyy');
    final activeRangeText = _customRange != null
        ? '${DateFormat('dd MMM').format(_customRange!.start)} - ${DateFormat('dd MMM yyyy').format(_customRange!.end)}'
        : monthFormat.format(_selectedMonth);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Attendance History'),
        actions: [
          IconButton(
            icon: const Icon(Icons.date_range_rounded),
            tooltip: 'Pick Date Range',
            onPressed: _pickDateRange,
          ),
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: _loadAttendance,
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadAttendance,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Month Range Selector Bar
                    _buildMonthRangeNavigator(activeRangeText),
                    const SizedBox(height: 16),

                    // Dynamic Summary Card
                    _buildSummaryCard(summary),
                    const SizedBox(height: 20),

                    // Daily History Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Daily Attendance Records',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.textPrimary,
                          ),
                        ),
                        Text(
                          '${_filteredRecords.length} Days Recorded',
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.textSecondary),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Log items
                    if (_filteredRecords.isEmpty)
                      Container(
                        padding: const EdgeInsets.all(32),
                        alignment: Alignment.center,
                        child: Column(
                          children: [
                            Icon(Icons.event_busy_rounded, size: 48, color: Colors.grey.shade400),
                            const SizedBox(height: 8),
                            Text(
                              'No attendance logs recorded for $activeRangeText',
                              style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      )
                    else
                      ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: _filteredRecords.length,
                        itemBuilder: (context, i) {
                          final rec = _filteredRecords[i];
                          return _buildRecordRow(rec);
                        },
                      ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildMonthRangeNavigator(String rangeText) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          IconButton(
            icon: const Icon(Icons.chevron_left_rounded, color: AppTheme.primary),
            onPressed: _previousMonth,
            tooltip: 'Previous Month',
          ),
          InkWell(
            onTap: _pickDateRange,
            borderRadius: BorderRadius.circular(10),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              child: Row(
                children: [
                  const Icon(Icons.calendar_month_rounded, size: 16, color: AppTheme.primary),
                  const SizedBox(width: 8),
                  Text(
                    rangeText,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  if (_customRange != null) ...[
                    const SizedBox(width: 6),
                    GestureDetector(
                      onTap: () {
                        setState(() => _customRange = null);
                      },
                      child: const Icon(Icons.close_rounded, size: 16, color: Colors.grey),
                    ),
                  ],
                ],
              ),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.chevron_right_rounded, color: AppTheme.primary),
            onPressed: _nextMonth,
            tooltip: 'Next Month',
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryCard(AttendanceSummaryData summary) {
    final pct = summary.percentage;
    final isGood = pct >= 75.0;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.15),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Selected Period Attendance',
                    style: TextStyle(fontSize: 13, color: Colors.white70),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${pct.toStringAsFixed(1)}%',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                      color: isGood ? const Color(0xFF4ADE80) : const Color(0xFFF87171),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    isGood ? 'Good Standing (Eligible for Exams)' : 'Below 75% Requirement',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: isGood ? const Color(0xFF86EFAC) : const Color(0xFFFCA5A5),
                    ),
                  ),
                ],
              ),
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: isGood ? const Color(0xFF22C55E) : const Color(0xFFEF4444),
                    width: 4,
                  ),
                ),
                child: Center(
                  child: Icon(
                    isGood ? Icons.check_circle_outline_rounded : Icons.warning_amber_rounded,
                    color: isGood ? const Color(0xFF22C55E) : const Color(0xFFEF4444),
                    size: 32,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          const Divider(color: Colors.white24, height: 1),
          const SizedBox(height: 14),

          // Count Stat Pills
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildStatPill('Total Days', '${summary.totalDays}', Colors.white70),
              _buildStatPill('Present', '${summary.present}', const Color(0xFF4ADE80)),
              _buildStatPill('Absent', '${summary.absent}', const Color(0xFFF87171)),
              _buildStatPill('Half Day', '${summary.halfDay}', const Color(0xFFFBBF24)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatPill(String label, String value, Color color) {
    return Column(
      children: [
        Text(value, style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: color)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(fontSize: 10, color: Colors.white60)),
      ],
    );
  }

  Widget _buildRecordRow(AttendanceLogRecord rec) {
    final status = rec.status.toLowerCase();
    Color statusColor = const Color(0xFF16A34A);
    Color statusBg = const Color(0xFFDCFCE7);
    IconData statusIcon = Icons.check_circle_outline;

    if (status.contains('absent')) {
      statusColor = const Color(0xFFDC2626);
      statusBg = const Color(0xFFFEE2E2);
      statusIcon = Icons.cancel_outlined;
    } else if (status.contains('half')) {
      statusColor = const Color(0xFFD97706);
      statusBg = const Color(0xFFFEF3C7);
      statusIcon = Icons.timelapse;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(statusIcon, color: statusColor, size: 20),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    rec.date,
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                  ),
                  if (rec.remarks != null && rec.remarks!.isNotEmpty)
                    Text(
                      rec.remarks!,
                      style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary),
                    ),
                ],
              ),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: statusBg,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              rec.status,
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: statusColor),
            ),
          ),
        ],
      ),
    );
  }
}
