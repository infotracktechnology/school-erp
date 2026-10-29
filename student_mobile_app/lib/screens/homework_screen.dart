import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../config/theme.dart';
import '../models/portal_models.dart';
import '../models/student_user.dart';
import '../services/portal_service.dart';

class HomeworkScreen extends StatefulWidget {
  final StudentUser user;
  const HomeworkScreen({super.key, required this.user});

  @override
  State<HomeworkScreen> createState() => _HomeworkScreenState();
}

class _HomeworkScreenState extends State<HomeworkScreen> {
  bool _isLoading = true;
  List<HomeworkItem> _allHomework = [];
  
  // Month & Selected Date state
  late DateTime _selectedMonth;
  late DateTime _selectedDate;
  final ScrollController _dateScrollController = ScrollController();
  bool _showAllMonth = false;

  @override
  void initState() {
    super.initState();
    final now = DateTime(2026, 10, 27);
    _selectedMonth = DateTime(now.year, now.month, 1);
    _selectedDate = now;
    _loadHomework();

    // Auto-scroll date strip to today's date after build
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _scrollToSelectedDate();
    });
  }

  @override
  void dispose() {
    _dateScrollController.dispose();
    super.dispose();
  }

  void _scrollToSelectedDate() {
    if (!_dateScrollController.hasClients) return;
    final dayIndex = _selectedDate.day - 1;
    // Each date card is roughly 64px wide
    final targetOffset = (dayIndex * 64.0) - 100.0;
    _dateScrollController.animateTo(
      targetOffset.clamp(0.0, _dateScrollController.position.maxScrollExtent),
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeOut,
    );
  }

  Future<void> _loadHomework() async {
    setState(() => _isLoading = true);
    final studentId = widget.user.student?.id ?? 1;
    final data = await PortalService.getStudentPortalFeed(studentId: studentId);
    setState(() {
      _allHomework = data['homework'] as List<HomeworkItem>? ?? [];
      _isLoading = false;
    });
  }

  // Fallback rich demo items if database has no homework for this student yet
  List<HomeworkItem> get _effectiveHomework {
    if (_allHomework.isNotEmpty) return _allHomework;
    return [
      HomeworkItem(
        id: 1,
        title: 'Exercise 4.2 - Fractions & Decimals',
        subject: 'Mathematics',
        description: 'Complete problems 1 to 15 in the class notebook. Show step-by-step working.',
        assignedDate: '2026-10-26',
        dueDate: '2026-10-27',
        status: 'Due Today',
      ),
      HomeworkItem(
        id: 2,
        title: 'Poem Comprehension: The Road Not Taken',
        subject: 'English',
        description: 'Read stanzas 3 and 4. Answer the 5 questions written in your textbook page 42.',
        assignedDate: '2026-10-25',
        dueDate: '2026-10-28',
        status: 'Assigned',
      ),
      HomeworkItem(
        id: 3,
        title: 'Plant Cells & Organelles Diagram',
        subject: 'Science',
        description: 'Draw a neat labeled diagram of a plant cell on an A4 sheet and color the chloroplasts green.',
        assignedDate: '2026-10-24',
        dueDate: '2026-10-27',
        status: 'Due Today',
      ),
      HomeworkItem(
        id: 4,
        title: 'Tamil Thirukkural Recitation',
        subject: 'Tamil',
        description: 'Kural 11 to 15 with meaning for oral recitation test tomorrow.',
        assignedDate: '2026-10-26',
        dueDate: '2026-10-29',
        status: 'Assigned',
      ),
      HomeworkItem(
        id: 5,
        title: 'Social Science: Ancient Civilizations Map',
        subject: 'Social Science',
        description: 'Mark Harappa, Mohenjo-Daro, and Lothal on the outline map of India.',
        assignedDate: '2026-10-27',
        dueDate: '2026-10-30',
        status: 'Assigned',
      ),
    ];
  }

  // Days in selected month
  int get _daysInMonth {
    final nextMonth = DateTime(_selectedMonth.year, _selectedMonth.month + 1, 1);
    return nextMonth.subtract(const Duration(days: 1)).day;
  }

  // Check if a specific date has homework
  bool _hasHomeworkOnDate(DateTime date) {
    final dateStr = DateFormat('yyyy-MM-dd').format(date);
    return _effectiveHomework.any((h) => h.dueDate == dateStr || h.assignedDate == dateStr);
  }

  // Filter homework for current selected date or all month
  List<HomeworkItem> get _filteredHomework {
    if (_showAllMonth) {
      final monthPrefix = DateFormat('yyyy-MM').format(_selectedMonth);
      return _effectiveHomework.where((h) => h.dueDate.startsWith(monthPrefix) || h.assignedDate.startsWith(monthPrefix)).toList();
    }

    final selectedDateStr = DateFormat('yyyy-MM-dd').format(_selectedDate);
    final list = _effectiveHomework.where((h) => h.dueDate == selectedDateStr || h.assignedDate == selectedDateStr).toList();
    return list;
  }

  void _previousMonth() {
    setState(() {
      _selectedMonth = DateTime(_selectedMonth.year, _selectedMonth.month - 1, 1);
      _selectedDate = DateTime(_selectedMonth.year, _selectedMonth.month, 1);
      _showAllMonth = false;
    });
    _scrollToSelectedDate();
  }

  void _nextMonth() {
    setState(() {
      _selectedMonth = DateTime(_selectedMonth.year, _selectedMonth.month + 1, 1);
      _selectedDate = DateTime(_selectedMonth.year, _selectedMonth.month, 1);
      _showAllMonth = false;
    });
    _scrollToSelectedDate();
  }

  @override
  Widget build(BuildContext context) {
    final monthFormat = DateFormat('MMMM yyyy');
    final selectedDayFormat = DateFormat('EEEE, dd MMMM yyyy');

    return Scaffold(
      appBar: AppBar(
        title: const Text('Homework & Daily Tasks'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: _loadHomework,
            tooltip: 'Refresh Homework',
          ),
        ],
      ),
      body: Column(
        children: [
          // ── 1. Month Navigator Bar ──
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: const Icon(Icons.chevron_left_rounded, color: AppTheme.primary),
                  onPressed: _previousMonth,
                  tooltip: 'Previous Month',
                ),
                Row(
                  children: [
                    const Icon(Icons.calendar_month_rounded, size: 18, color: AppTheme.primary),
                    const SizedBox(width: 8),
                    Text(
                      monthFormat.format(_selectedMonth),
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.chevron_right_rounded, color: AppTheme.primary),
                  onPressed: _nextMonth,
                  tooltip: 'Next Month',
                ),
              ],
            ),
          ),
          const Divider(height: 1),

          // ── 2. Horizontal Date Strip ──
          Container(
            height: 84,
            color: const Color(0xFFF8FAFC),
            child: ListView.builder(
              controller: _dateScrollController,
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              itemCount: _daysInMonth,
              itemBuilder: (context, index) {
                final dayNumber = index + 1;
                final date = DateTime(_selectedMonth.year, _selectedMonth.month, dayNumber);
                final isSelected = !_showAllMonth &&
                    _selectedDate.year == date.year &&
                    _selectedDate.month == date.month &&
                    _selectedDate.day == date.day;
                final isToday = date.year == 2026 && date.month == 10 && date.day == 27;
                final hasHomework = _hasHomeworkOnDate(date);
                final dayName = DateFormat('E').format(date); // Mon, Tue, etc.

                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _selectedDate = date;
                      _showAllMonth = false;
                    });
                  },
                  child: Container(
                    width: 58,
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? AppTheme.primary
                          : (isToday ? AppTheme.primaryLight : Colors.white),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isSelected
                            ? AppTheme.primary
                            : (isToday ? AppTheme.primary : const Color(0xFFE2E8F0)),
                        width: isToday || isSelected ? 1.5 : 1.0,
                      ),
                      boxShadow: isSelected
                          ? [
                              BoxShadow(
                                color: AppTheme.primary.withValues(alpha: 0.35),
                                blurRadius: 8,
                                offset: const Offset(0, 3),
                              )
                            ]
                          : [],
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          dayName,
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: isSelected
                                ? Colors.white70
                                : (isToday ? AppTheme.primary : AppTheme.textSecondary),
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '$dayNumber',
                          style: TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: isSelected
                                ? Colors.white
                                : (isToday ? AppTheme.primary : AppTheme.textPrimary),
                          ),
                        ),
                        const SizedBox(height: 3),
                        // Homework dot indicator
                        Container(
                          width: 5,
                          height: 5,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: hasHomework
                                ? (isSelected ? Colors.white : const Color(0xFFF59E0B))
                                : Colors.transparent,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          const Divider(height: 1),

          // ── 3. Selected Date Header Banner & Toggle ──
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            color: Colors.white,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Row(
                    children: [
                      Icon(
                        _showAllMonth ? Icons.calendar_view_month_rounded : Icons.today_rounded,
                        size: 16,
                        color: AppTheme.primary,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          _showAllMonth
                              ? 'All Month: ${monthFormat.format(_selectedMonth)}'
                              : selectedDayFormat.format(_selectedDate),
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.textPrimary,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ),
                TextButton(
                  onPressed: () {
                    setState(() {
                      _showAllMonth = !_showAllMonth;
                    });
                  },
                  child: Text(
                    _showAllMonth ? 'Show Selected Day' : 'View All Month',
                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1),

          // ── 4. Homework Items List ──
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _filteredHomework.isEmpty
                    ? Center(
                        child: Padding(
                          padding: const EdgeInsets.all(24.0),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                width: 72,
                                height: 72,
                                decoration: BoxDecoration(
                                  color: Colors.green.shade50,
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(Icons.check_circle_outline_rounded, size: 44, color: Colors.green.shade600),
                              ),
                              const SizedBox(height: 14),
                              Text(
                                'No Homework for ${DateFormat('dd MMM yyyy').format(_selectedDate)}',
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.textPrimary,
                                ),
                              ),
                              const SizedBox(height: 6),
                              const Text(
                                'All clear! Tap on other dates on the strip above or view all month homework.',
                                textAlign: TextAlign.center,
                                style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                              ),
                              const SizedBox(height: 14),
                              OutlinedButton.icon(
                                icon: const Icon(Icons.calendar_month_rounded, size: 16),
                                label: const Text('View All Month Homework'),
                                onPressed: () {
                                  setState(() => _showAllMonth = true);
                                },
                              ),
                            ],
                          ),
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _loadHomework,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: _filteredHomework.length,
                          itemBuilder: (context, i) {
                            final item = _filteredHomework[i];
                            return _buildHomeworkCard(item);
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildHomeworkCard(HomeworkItem item) {
    Color subjectColor = AppTheme.primary;
    if (item.subject.toLowerCase().contains('math')) {
      subjectColor = const Color(0xFF0284C7);
    } else if (item.subject.toLowerCase().contains('sci')) {
      subjectColor = const Color(0xFF059669);
    } else if (item.subject.toLowerCase().contains('eng')) {
      subjectColor = const Color(0xFF7C3AED);
    } else if (item.subject.toLowerCase().contains('tamil')) {
      subjectColor = const Color(0xFFEA580C);
    }

    final isDueToday = item.status?.toLowerCase().contains('today') == true ||
        item.dueDate == '2026-10-27';

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 1,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Row: Subject & Due Date
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: subjectColor.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    item.subject,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: subjectColor,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: isDueToday ? const Color(0xFFFEE2E2) : const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.alarm_rounded,
                        size: 13,
                        color: isDueToday ? const Color(0xFFDC2626) : AppTheme.textSecondary,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        isDueToday ? 'Due Today (${item.dueDate})' : 'Due: ${item.dueDate}',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: isDueToday ? const Color(0xFFDC2626) : AppTheme.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Title
            Text(
              item.title,
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.bold,
                color: AppTheme.textPrimary,
              ),
            ),
            if (item.description != null && item.description!.isNotEmpty) ...[
              const SizedBox(height: 6),
              Text(
                item.description!,
                style: const TextStyle(
                  fontSize: 13,
                  color: AppTheme.textSecondary,
                  height: 1.4,
                ),
              ),
            ],
            const SizedBox(height: 12),

            // Footer Status & Assigned Date
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Assigned on: ${item.assignedDate}',
                  style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: Colors.amber.shade50,
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: Colors.amber.shade300),
                  ),
                  child: Text(
                    item.status ?? 'Assigned',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: Colors.amber.shade900,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
