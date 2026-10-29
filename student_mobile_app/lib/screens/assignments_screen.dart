import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../config/theme.dart';
import '../models/portal_models.dart';
import '../models/student_user.dart';
import '../services/portal_service.dart';

class AssignmentsScreen extends StatefulWidget {
  final StudentUser user;
  const AssignmentsScreen({super.key, required this.user});

  @override
  State<AssignmentsScreen> createState() => _AssignmentsScreenState();
}

class _AssignmentsScreenState extends State<AssignmentsScreen> {
  bool _isLoading = true;
  List<AssignmentItem> _assignments = [];

  late DateTime _selectedMonth;
  late DateTime _selectedDate;
  final ScrollController _dateStripController = ScrollController();

  String _statusFilter = 'All'; // 'All', 'Pending', 'Submitted', 'Graded'
  bool _showAllMonth = false;

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _selectedMonth = DateTime(now.year, now.month, 1);
    _selectedDate = DateTime(now.year, now.month, now.day);
    _loadAssignments();
  }

  @override
  void dispose() {
    _dateStripController.dispose();
    super.dispose();
  }

  Future<void> _loadAssignments() async {
    setState(() => _isLoading = true);
    final studentId = widget.user.student?.id ?? 1;
    final data = await PortalService.getStudentPortalFeed(studentId: studentId);
    setState(() {
      _assignments = data['assignments'] as List<AssignmentItem>? ?? [];
      _isLoading = false;
    });

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _scrollToSelectedDate();
    });
  }

  List<AssignmentItem> get _effectiveList {
    if (_assignments.isNotEmpty) return _assignments;
    // Rich fallback demo list
    return [
      AssignmentItem(
        id: 1,
        title: 'Mid-Term Science Research: Solar vs Wind Energy',
        subject: 'Natural Sciences',
        description: 'Prepare a 3-page comparative study on Solar vs Wind power plants in Tamil Nadu, including efficiency charts and government subsidies.',
        dueDate: '2026-10-28',
        maxMarks: 50,
        status: 'Pending Submission',
      ),
      AssignmentItem(
        id: 2,
        title: 'Mathematics Trigonometry Real-Life Problem Set',
        subject: 'Mathematics',
        description: 'Solve the 10 real-world heights and distances problems assigned on Google Classroom and attach your handwritten step-by-step working.',
        dueDate: '2026-10-27',
        maxMarks: 25,
        status: 'Pending Submission',
      ),
      AssignmentItem(
        id: 3,
        title: 'English Book Review: Swami and Friends',
        subject: 'English Literature',
        description: 'Write a critical character sketch of Swami, Mani, and Rajam with key themes of innocence and friendship.',
        dueDate: '2026-10-25',
        maxMarks: 20,
        obtainedMarks: 19,
        grade: 'A+',
        teacherFeedback: 'Outstanding analytical depth and vivid character reflections. Keep it up!',
        submittedAt: '2026-10-24 04:30 PM',
        status: 'Graded',
      ),
      AssignmentItem(
        id: 4,
        title: 'Computer Science: Database Schema for Library System',
        subject: 'Computer Science',
        description: 'Design an Entity-Relationship (ER) diagram and SQL schema for books, authors, issue records, and student memberships.',
        dueDate: '2026-10-31',
        maxMarks: 40,
        submittedAt: '2026-10-26 11:15 AM',
        status: 'Submitted',
      ),
      AssignmentItem(
        id: 5,
        title: 'Social Science: Indian Independence Movement Map Work',
        subject: 'Social Science',
        description: 'Mark and label the major historic centers of the Indian National Movement (Champaran, Dandi, Jallianwala Bagh, Chauri Chaura).',
        dueDate: '2026-11-05',
        maxMarks: 20,
        status: 'Pending Submission',
      ),
    ];
  }

  void _previousMonth() {
    setState(() {
      _selectedMonth = DateTime(_selectedMonth.year, _selectedMonth.month - 1, 1);
      _selectedDate = DateTime(_selectedMonth.year, _selectedMonth.month, 1);
    });
    _scrollToSelectedDate();
  }

  void _nextMonth() {
    setState(() {
      _selectedMonth = DateTime(_selectedMonth.year, _selectedMonth.month + 1, 1);
      _selectedDate = DateTime(_selectedMonth.year, _selectedMonth.month, 1);
    });
    _scrollToSelectedDate();
  }

  void _scrollToSelectedDate() {
    if (!_dateStripController.hasClients) return;
    final dayIndex = _selectedDate.day - 1;
    const itemWidth = 64.0;
    final targetOffset = (dayIndex * itemWidth) - 100.0;
    _dateStripController.animateTo(
      targetOffset.clamp(0.0, _dateStripController.position.maxScrollExtent),
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  int get _daysInMonth {
    final nextMonth = DateTime(_selectedMonth.year, _selectedMonth.month + 1, 1);
    return nextMonth.subtract(const Duration(days: 1)).day;
  }

  // Get deadlines mapped by date (YYYY-MM-DD)
  Map<String, List<AssignmentItem>> get _assignmentsByDate {
    final map = <String, List<AssignmentItem>>{};
    for (final item in _effectiveList) {
      if (item.dueDate.isNotEmpty) {
        final dStr = item.dueDate.split('T').first.trim();
        map.putIfAbsent(dStr, () => []).add(item);
      }
    }
    return map;
  }

  List<AssignmentItem> get _filteredAssignments {
    List<AssignmentItem> list = _effectiveList;

    // Apply Status Filter
    if (_statusFilter == 'Pending') {
      list = list.where((a) => a.status.toLowerCase().contains('pending') || a.status.toLowerCase().contains('progress')).toList();
    } else if (_statusFilter == 'Submitted') {
      list = list.where((a) => a.status.toLowerCase() == 'submitted').toList();
    } else if (_statusFilter == 'Graded') {
      list = list.where((a) => a.status.toLowerCase() == 'graded' || a.obtainedMarks != null).toList();
    }

    // Apply Date/Month Filter if not viewing all month
    if (!_showAllMonth) {
      final selectedDateStr = DateFormat('yyyy-MM-dd').format(_selectedDate);
      list = list.where((a) {
        if (a.dueDate.isEmpty) return false;
        final dStr = a.dueDate.split('T').first.trim();
        return dStr == selectedDateStr;
      }).toList();
    } else {
      final monthPrefix = DateFormat('yyyy-MM').format(_selectedMonth);
      list = list.where((a) {
        if (a.dueDate.isEmpty) return true;
        return a.dueDate.startsWith(monthPrefix);
      }).toList();
    }

    return list;
  }

  void _showSubmitModal(AssignmentItem item) {
    final noteController = TextEditingController();
    String mockAttachedFile = 'Handwritten_Solution_${item.subject.replaceAll(' ', '_')}.pdf';
    bool fileAttached = true;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom + 20,
                left: 20,
                right: 20,
                top: 20,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: AppTheme.primary.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Icon(Icons.upload_file_rounded, color: AppTheme.primary, size: 22),
                          ),
                          const SizedBox(width: 10),
                          const Text(
                            'Submit Assignment',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      IconButton(
                        icon: const Icon(Icons.close_rounded),
                        onPressed: () => Navigator.pop(ctx),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    item.title,
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppTheme.textPrimary),
                  ),
                  Text(
                    'Subject: ${item.subject} • Max Marks: ${item.maxMarks}',
                    style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                  ),
                  const SizedBox(height: 16),
                  const Text('Student Notes / Comments (Optional):', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  TextField(
                    controller: noteController,
                    maxLines: 2,
                    decoration: InputDecoration(
                      hintText: 'e.g. Please find attached my completed lab worksheet...',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    ),
                  ),
                  const SizedBox(height: 14),
                  const Text('Attachments:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  if (fileAttached)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEFF6FF),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: const Color(0xFFBFDBFE)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.picture_as_pdf_rounded, color: Colors.red, size: 24),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  mockAttachedFile,
                                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const Text('1.8 MB • Ready to submit', style: TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete_outline_rounded, color: Colors.red, size: 20),
                            onPressed: () {
                              setModalState(() => fileAttached = false);
                            },
                          ),
                        ],
                      ),
                    )
                  else
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            icon: const Icon(Icons.camera_alt_outlined, size: 18),
                            label: const Text('Take Photo', style: TextStyle(fontSize: 12)),
                            onPressed: () {
                              setModalState(() {
                                mockAttachedFile = 'Captured_Page_1.jpg';
                                fileAttached = true;
                              });
                            },
                            style: OutlinedButton.styleFrom(
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: OutlinedButton.icon(
                            icon: const Icon(Icons.attach_file_rounded, size: 18),
                            label: const Text('Attach PDF', style: TextStyle(fontSize: 12)),
                            onPressed: () {
                              setModalState(() {
                                mockAttachedFile = 'My_Assignment_Solution.pdf';
                                fileAttached = true;
                              });
                            },
                            style: OutlinedButton.styleFrom(
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                            ),
                          ),
                        ),
                      ],
                    ),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.send_rounded, size: 18),
                      label: const Text('Confirm & Turn In Work', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primary,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: () {
                        Navigator.pop(ctx);
                        setState(() {
                          // Update assignment state locally
                          final idx = _effectiveList.indexWhere((a) => a.id == item.id);
                          if (idx != -1) {
                            _effectiveList[idx] = AssignmentItem(
                              id: item.id,
                              title: item.title,
                              subject: item.subject,
                              description: item.description,
                              dueDate: item.dueDate,
                              maxMarks: item.maxMarks,
                              status: 'Submitted',
                              submittedAt: DateFormat('yyyy-MM-dd hh:mm a').format(DateTime.now()),
                              attachments: [mockAttachedFile],
                            );
                          }
                        });
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('🎉 "${item.title}" successfully turned in!'),
                            backgroundColor: const Color(0xFF16A34A),
                            behavior: SnackBarBehavior.floating,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text('Assignments & Projects'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: _loadAssignments,
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // 1. Month Navigator
                _buildMonthNavigator(),

                // 2. Horizontal Due Date Strip
                _buildDueDateStrip(),

                // 3. Status Filter Tabs
                _buildStatusTabs(),

                // 4. Assignments List
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: _loadAssignments,
                    child: _buildAssignmentsView(),
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildMonthNavigator() {
    final monthStr = DateFormat('MMMM yyyy').format(_selectedMonth);

    return Container(
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
              const Icon(Icons.assignment_turned_in_outlined, size: 20, color: AppTheme.primary),
              const SizedBox(width: 8),
              Text(
                monthStr,
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
    );
  }

  Widget _buildDueDateStrip() {
    final now = DateTime.now();
    final todayStr = DateFormat('yyyy-MM-dd').format(now);
    final daysCount = _daysInMonth;

    return Container(
      height: 78,
      color: Colors.white,
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: ListView.builder(
        controller: _dateStripController,
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        itemCount: daysCount,
        itemBuilder: (context, index) {
          final day = index + 1;
          final date = DateTime(_selectedMonth.year, _selectedMonth.month, day);
          final dateStr = DateFormat('yyyy-MM-dd').format(date);
          final isSelected = date.year == _selectedDate.year &&
              date.month == _selectedDate.month &&
              date.day == _selectedDate.day;
          final isToday = dateStr == todayStr;
          final weekdayStr = DateFormat('EEE').format(date);

          // Check if this date has assignments
          final dayAssignments = _assignmentsByDate[dateStr] ?? [];
          final hasAssignments = dayAssignments.isNotEmpty;

          // Determine dot color
          Color dotColor = Colors.transparent;
          if (hasAssignments) {
            final hasGraded = dayAssignments.any((a) => a.status.toLowerCase() == 'graded' || a.obtainedMarks != null);
            final hasSubmitted = dayAssignments.any((a) => a.status.toLowerCase() == 'submitted');
            final isPast = date.isBefore(DateTime(now.year, now.month, now.day));

            if (hasGraded) {
              dotColor = const Color(0xFF10B981); // Emerald Green
            } else if (hasSubmitted) {
              dotColor = const Color(0xFF3B82F6); // Blue
            } else if (isPast) {
              dotColor = const Color(0xFFEF4444); // Red Overdue
            } else {
              dotColor = const Color(0xFFF59E0B); // Amber Due Soon
            }
          }

          return GestureDetector(
            onTap: () {
              setState(() {
                _selectedDate = date;
                _showAllMonth = false;
              });
              _scrollToSelectedDate();
            },
            child: Container(
              width: 54,
              margin: const EdgeInsets.symmetric(horizontal: 3, vertical: 2),
              decoration: BoxDecoration(
                color: isSelected
                    ? AppTheme.primary
                    : (isToday ? const Color(0xFFEFF6FF) : Colors.transparent),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: isSelected
                      ? AppTheme.primary
                      : (isToday ? AppTheme.primary : const Color(0xFFE2E8F0)),
                  width: isToday ? 1.5 : 1,
                ),
                boxShadow: isSelected
                    ? [
                        BoxShadow(
                          color: AppTheme.primary.withValues(alpha: 0.3),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        )
                      ]
                    : null,
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    weekdayStr,
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      color: isSelected
                          ? Colors.white.withValues(alpha: 0.85)
                          : (isToday ? AppTheme.primary : AppTheme.textSecondary),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '$day',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: isSelected
                          ? Colors.white
                          : (isToday ? AppTheme.primary : AppTheme.textPrimary),
                    ),
                  ),
                  const SizedBox(height: 3),
                  Container(
                    width: 5,
                    height: 5,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isSelected ? Colors.white : dotColor,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildStatusTabs() {
    final total = _effectiveList.length;
    final pending = _effectiveList.where((a) => a.status.toLowerCase().contains('pending') || a.status.toLowerCase().contains('progress')).length;
    final submitted = _effectiveList.where((a) => a.status.toLowerCase() == 'submitted').length;
    final graded = _effectiveList.where((a) => a.status.toLowerCase() == 'graded' || a.obtainedMarks != null).length;

    final tabs = [
      {'key': 'All', 'label': 'All ($total)'},
      {'key': 'Pending', 'label': '⏳ Pending ($pending)'},
      {'key': 'Submitted', 'label': '📤 Submitted ($submitted)'},
      {'key': 'Graded', 'label': '⭐ Graded ($graded)'},
    ];

    return Container(
      color: Colors.white,
      padding: const EdgeInsets.only(left: 12, right: 12, bottom: 8),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: tabs.map((tab) {
            final isSelected = _statusFilter == tab['key'];
            return Padding(
              padding: const EdgeInsets.only(right: 8),
              child: FilterChip(
                label: Text(
                  tab['label']!,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                    color: isSelected ? AppTheme.primary : AppTheme.textSecondary,
                  ),
                ),
                selected: isSelected,
                selectedColor: AppTheme.primary.withValues(alpha: 0.12),
                backgroundColor: const Color(0xFFF8FAFC),
                side: BorderSide(
                  color: isSelected ? AppTheme.primary : const Color(0xFFE2E8F0),
                ),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                onSelected: (_) {
                  setState(() => _statusFilter = tab['key']!);
                },
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildAssignmentsView() {
    final list = _filteredAssignments;
    final selectedDateStr = DateFormat('EEEE, d MMMM yyyy').format(_selectedDate);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Sub-header displaying selected filter mode
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Row(
                children: [
                  Icon(
                    _showAllMonth ? Icons.calendar_view_month_rounded : Icons.event_note_rounded,
                    size: 16,
                    color: AppTheme.primary,
                  ),
                  const SizedBox(width: 6),
                  Flexible(
                    child: Text(
                      _showAllMonth
                          ? 'Showing All Month (${DateFormat('MMMM yyyy').format(_selectedMonth)})'
                          : selectedDateStr,
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
            TextButton.icon(
              icon: Icon(
                _showAllMonth ? Icons.filter_alt_outlined : Icons.list_alt_rounded,
                size: 14,
                color: AppTheme.primary,
              ),
              label: Text(
                _showAllMonth ? 'By Date' : 'View All',
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
              ),
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                minimumSize: Size.zero,
                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              ),
              onPressed: () {
                setState(() => _showAllMonth = !_showAllMonth);
              },
            ),
          ],
        ),
        const SizedBox(height: 12),

        if (list.isEmpty)
          _buildEmptyState()
        else
          ...list.map((item) => _buildAssignmentCard(item)),
      ],
    );
  }

  Widget _buildEmptyState() {
    return Container(
      margin: const EdgeInsets.only(top: 30),
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: const BoxDecoration(
              color: Color(0xFFDCFCE7),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.task_alt_rounded, color: Color(0xFF16A34A), size: 32),
          ),
          const SizedBox(height: 16),
          Text(
            _showAllMonth
                ? 'No ${_statusFilter == 'All' ? '' : '$_statusFilter '}Assignments this month'
                : 'No assignments due on this date',
            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 6),
          Text(
            _showAllMonth
                ? 'All caught up! Excellent work keeping your projects on schedule.'
                : 'Tap another date on the strip above or click "View All" to explore the full month.',
            style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
            textAlign: TextAlign.center,
          ),
          if (!_showAllMonth) ...[
            const SizedBox(height: 16),
            ElevatedButton.icon(
              icon: const Icon(Icons.list_alt_rounded, size: 16),
              label: const Text('View All Month Assignments', style: TextStyle(fontSize: 13)),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primary,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: () {
                setState(() => _showAllMonth = true);
              },
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildAssignmentCard(AssignmentItem item) {
    final statusLower = item.status.toLowerCase();
    final isSubmitted = statusLower == 'submitted';
    final isGraded = statusLower == 'graded' || item.obtainedMarks != null;

    // Due countdown calculation
    String countdownText = '';
    Color countdownColor = AppTheme.textSecondary;
    IconData countdownIcon = Icons.timer_outlined;

    if (item.dueDate.isNotEmpty) {
      try {
        final due = DateTime.parse(item.dueDate.split('T').first);
        final now = DateTime.now();
        final diffDays = due.difference(DateTime(now.year, now.month, now.day)).inDays;

        if (isGraded) {
          countdownText = 'Graded';
          countdownColor = const Color(0xFF16A34A);
          countdownIcon = Icons.check_circle_rounded;
        } else if (isSubmitted) {
          countdownText = item.submittedAt != null ? 'Turned in on ${item.submittedAt}' : 'Turned In';
          countdownColor = const Color(0xFF2563EB);
          countdownIcon = Icons.task_alt_rounded;
        } else if (diffDays < 0) {
          countdownText = '⚠️ Overdue by ${-diffDays} day${-diffDays > 1 ? 's' : ''}';
          countdownColor = const Color(0xFFDC2626);
          countdownIcon = Icons.warning_amber_rounded;
        } else if (diffDays == 0) {
          countdownText = '🔥 Due Today!';
          countdownColor = const Color(0xFFD97706);
          countdownIcon = Icons.alarm_rounded;
        } else {
          countdownText = '⏳ $diffDays day${diffDays > 1 ? 's' : ''} left';
          countdownColor = const Color(0xFF4B5563);
          countdownIcon = Icons.hourglass_top_rounded;
        }
      } catch (_) {}
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 14),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      elevation: 1,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Row: Subject badge & Status badge
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFF8B5CF6).withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    item.subject,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF7C3AED),
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: isGraded
                        ? const Color(0xFFDCFCE7)
                        : (isSubmitted ? const Color(0xFFDBEAFE) : const Color(0xFFFEF3C7)),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        isGraded
                            ? Icons.star_rounded
                            : (isSubmitted ? Icons.done_all_rounded : Icons.pending_actions_rounded),
                        size: 14,
                        color: isGraded
                            ? const Color(0xFF166534)
                            : (isSubmitted ? const Color(0xFF1E40AF) : const Color(0xFF92400E)),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        isGraded ? 'Graded' : item.status,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: isGraded
                              ? const Color(0xFF166534)
                              : (isSubmitted ? const Color(0xFF1E40AF) : const Color(0xFF92400E)),
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
              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
            ),

            // Description
            if (item.description != null && item.description!.isNotEmpty) ...[
              const SizedBox(height: 6),
              Text(
                item.description!,
                style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary, height: 1.4),
              ),
            ],

            const SizedBox(height: 12),

            // Deadline & Max Marks bar
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(countdownIcon, size: 14, color: countdownColor),
                      const SizedBox(width: 5),
                      Text(
                        countdownText,
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: countdownColor),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      const Icon(Icons.military_tech_rounded, size: 16, color: Color(0xFFF59E0B)),
                      const SizedBox(width: 4),
                      Text(
                        isGraded
                            ? '${item.obtainedMarks}/${item.maxMarks} Marks (${item.grade ?? 'A'})'
                            : 'Max: ${item.maxMarks} M',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: isGraded ? const Color(0xFF16A34A) : AppTheme.textPrimary,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Teacher Feedback Section if Graded
            if (isGraded && item.teacherFeedback != null) ...[
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFFF0FDF4),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFFBBF7D0)),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.rate_review_rounded, size: 16, color: Color(0xFF16A34A)),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Teacher Remark:', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF166534))),
                          const SizedBox(height: 2),
                          Text(item.teacherFeedback!, style: const TextStyle(fontSize: 12, color: Color(0xFF14532D), height: 1.3)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],

            const SizedBox(height: 14),

            // Action Buttons: Download Worksheet & Submit Work
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.download_rounded, size: 16),
                    label: const Text('Worksheet', style: TextStyle(fontSize: 12)),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppTheme.primary,
                      side: const BorderSide(color: AppTheme.primary),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      padding: const EdgeInsets.symmetric(vertical: 8),
                    ),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('📥 Downloading worksheet for "${item.title}"...'),
                          duration: const Duration(seconds: 2),
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton.icon(
                    icon: Icon(
                      isSubmitted || isGraded ? Icons.check_circle_outline_rounded : Icons.upload_file_rounded,
                      size: 16,
                    ),
                    label: Text(
                      isSubmitted || isGraded ? 'Submitted' : 'Submit Work',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isSubmitted || isGraded ? const Color(0xFF16A34A) : AppTheme.primary,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      padding: const EdgeInsets.symmetric(vertical: 8),
                    ),
                    onPressed: isSubmitted || isGraded
                        ? () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('✅ Assignment already turned in (${item.status})'),
                                duration: const Duration(seconds: 2),
                                behavior: SnackBarBehavior.floating,
                              ),
                            );
                          }
                        : () => _showSubmitModal(item),
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
