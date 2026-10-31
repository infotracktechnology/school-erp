import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../models/portal_models.dart';
import '../models/student_user.dart';
import '../services/portal_service.dart';

class TimetableScreen extends StatefulWidget {
  final StudentUser user;
  const TimetableScreen({super.key, required this.user});

  @override
  State<TimetableScreen> createState() => _TimetableScreenState();
}

class _TimetableScreenState extends State<TimetableScreen> {
  final List<String> _days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  late String _selectedDay;
  bool _isLoading = true;
  List<TimetablePeriodItem> _periods = [];

  @override
  void initState() {
    super.initState();
    // Default to today if Monday-Saturday, else Monday
    final weekday = DateTime.now().weekday;
    if (weekday >= 1 && weekday <= 6) {
      _selectedDay = _days[weekday - 1];
    } else {
      _selectedDay = 'Monday';
    }
    _loadTimetable();
  }

  Future<void> _loadTimetable() async {
    setState(() => _isLoading = true);
    final classId = widget.user.student?.classId ?? 1;
    final sectionId = widget.user.student?.sectionId ?? 1;
    final periods = await PortalService.getTimetableForDay(
      classId: classId,
      sectionId: sectionId,
      dayOfWeek: _selectedDay,
    );
    setState(() {
      _periods = periods;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final student = widget.user.student;
    final className = student != null ? student.classSection : 'Class 5 - A';

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Class Timetable', style: TextStyle(fontSize: 16)),
            Text(className, style: const TextStyle(fontSize: 11, color: Colors.white70)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: _loadTimetable,
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: Column(
        children: [
          // Day Selector Tabs
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: _days.map((day) {
                  final isSelected = _selectedDay == day;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8.0),
                    child: ChoiceChip(
                      label: Text(day.substring(0, 3)),
                      selected: isSelected,
                      selectedColor: AppTheme.primary,
                      labelStyle: TextStyle(
                        color: isSelected ? Colors.white : AppTheme.textPrimary,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                        fontSize: 12,
                      ),
                      onSelected: (_) {
                        setState(() => _selectedDay = day);
                        _loadTimetable();
                      },
                    ),
                  );
                }).toList(),
              ),
            ),
          ),

          // Period Cards List
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : RefreshIndicator(
                    onRefresh: _loadTimetable,
                    child: ListView.builder(
                      padding: const EdgeInsets.all(16.0),
                      itemCount: _periods.length,
                      itemBuilder: (context, i) {
                        final period = _periods[i];
                        return _buildPeriodCard(period);
                      },
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildPeriodCard(TimetablePeriodItem item) {
    if (item.isBreak) {
      return Container(
        margin: const EdgeInsets.symmetric(vertical: 8),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: const Color(0xFFFEF3C7),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFFDE68A)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.free_breakfast_outlined, size: 16, color: Color(0xFFB45309)),
            const SizedBox(width: 8),
            Text(
              '${item.periodName} (${item.startTime} - ${item.endTime})',
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFFB45309)),
            ),
          ],
        ),
      );
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 1,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            // Period Number Badge
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: AppTheme.primaryLight,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Center(
                child: Text(
                  'P${item.periodNumber}',
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.primary,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 14),

            // Subject & Teacher details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.subjectName,
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                  ),
                  const SizedBox(height: 4),
                  if (item.teacherName != null)
                    Row(
                      children: [
                        const Icon(Icons.person_outline, size: 14, color: AppTheme.textSecondary),
                        const SizedBox(width: 4),
                        Text(
                          item.teacherName!,
                          style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                        ),
                      ],
                    ),
                ],
              ),
            ),

            // Time badge
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  item.startTime,
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.primary),
                ),
                Text(
                  item.endTime,
                  style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
