import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../config/theme.dart';
import '../models/portal_models.dart';
import '../models/student_user.dart';
import '../services/portal_service.dart';

class CalendarScreen extends StatefulWidget {
  final StudentUser user;
  const CalendarScreen({super.key, required this.user});

  @override
  State<CalendarScreen> createState() => _CalendarScreenState();
}

class _CalendarScreenState extends State<CalendarScreen> {
  bool _isLoading = true;
  List<CalendarEventItem> _events = [];

  late DateTime _selectedMonth;
  late DateTime _selectedDate;
  final ScrollController _dateStripController = ScrollController();

  bool _isGridView = false; // Toggle between Day Strip and Full Month Grid
  bool _showAllMonth = false;

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _selectedMonth = DateTime(now.year, now.month, 1);
    _selectedDate = DateTime(now.year, now.month, now.day);
    _loadEvents();
  }

  @override
  void dispose() {
    _dateStripController.dispose();
    super.dispose();
  }

  Future<void> _loadEvents() async {
    setState(() => _isLoading = true);
    final events = await PortalService.getCalendarEvents();
    setState(() {
      _events = events;
      _isLoading = false;
    });

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _scrollToSelectedDate();
    });
  }

  List<CalendarEventItem> get _effectiveList {
    if (_events.isNotEmpty) return _events;
    return [
      CalendarEventItem(
        id: 1,
        title: 'Deepavali / Diwali Festive Holidays',
        description: 'School closed for Diwali festival celebration across all branches.',
        eventType: 'Holiday',
        startDate: '2026-11-08',
        endDate: '2026-11-12',
        venue: 'All Campuses',
      ),
      CalendarEventItem(
        id: 2,
        title: 'Annual Inter-School Sports Day 2026',
        description: 'Grand athletic track events, march past, pyramid gymnastics, and trophy distribution.',
        eventType: 'Sports',
        startDate: '2026-11-15',
        startTime: '08:30 AM',
        endTime: '04:00 PM',
        venue: 'Main School Athletics Ground',
      ),
      CalendarEventItem(
        id: 3,
        title: 'Term 2 Mid-Term Examinations',
        description: 'Comprehensive mid-term evaluation across Mathematics, Science, and Languages.',
        eventType: 'Examination',
        startDate: '2026-11-23',
        endDate: '2026-11-28',
        startTime: '09:30 AM',
        endTime: '12:30 PM',
        venue: 'Senior Academic Block - Halls 1 to 6',
      ),
      CalendarEventItem(
        id: 4,
        title: 'Gandhi Jayanti National Holiday',
        description: 'National holiday observed in commemoration of the Father of the Nation.',
        eventType: 'Holiday',
        startDate: '2026-10-02',
      ),
      CalendarEventItem(
        id: 5,
        title: 'Ayutha Pooja & Dussehra Vacation',
        description: 'Traditional autumnal festive holiday.',
        eventType: 'Holiday',
        startDate: '2026-10-18',
        endDate: '2026-10-24',
      ),
      CalendarEventItem(
        id: 6,
        title: 'Parent-Teacher Conference (PTM)',
        description: 'Term 1 progress report discussion between class teachers and parents.',
        eventType: 'PTM',
        startDate: '2026-10-28',
        startTime: '09:30 AM',
        endTime: '01:00 PM',
        venue: 'Respective Classrooms',
      ),
      CalendarEventItem(
        id: 7,
        title: 'Science & Robotics Innovation Fair',
        description: 'Exhibition of working student robotics models, AI projects, and scientific demonstrations.',
        eventType: 'Event',
        startDate: '2026-10-30',
        startTime: '10:00 AM',
        endTime: '03:30 PM',
        venue: 'Campus Open Air Auditorium',
      ),
      CalendarEventItem(
        id: 8,
        title: 'Christmas & New Year Winter Break',
        description: 'Winter break begins for all student classes.',
        eventType: 'Holiday',
        startDate: '2026-12-23',
        endDate: '2027-01-02',
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

  // Check if a date falls inside an event range
  bool _isDateInEvent(DateTime date, CalendarEventItem ev) {
    try {
      final start = DateTime.parse(ev.startDate.split('T').first);
      final d = DateTime(date.year, date.month, date.day);

      if (ev.endDate != null && ev.endDate!.isNotEmpty) {
        final end = DateTime.parse(ev.endDate!.split('T').first);
        return !d.isBefore(start) && !d.isAfter(end);
      }
      return d.year == start.year && d.month == start.month && d.day == start.day;
    } catch (_) {
      return false;
    }
  }

  List<CalendarEventItem> _getEventsForDate(DateTime date) {
    return _effectiveList.where((ev) => _isDateInEvent(date, ev)).toList();
  }

  List<CalendarEventItem> get _filteredEvents {
    if (_showAllMonth) {
      final monthPrefix = DateFormat('yyyy-MM').format(_selectedMonth);
      return _effectiveList.where((ev) {
        return ev.startDate.startsWith(monthPrefix) ||
            (ev.endDate != null && ev.endDate!.startsWith(monthPrefix));
      }).toList();
    }
    return _getEventsForDate(_selectedDate);
  }

  // Find next upcoming holiday for banner
  CalendarEventItem? get _nextUpcomingHoliday {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);

    for (final ev in _effectiveList) {
      if (ev.eventType.toLowerCase().contains('holiday')) {
        try {
          final start = DateTime.parse(ev.startDate.split('T').first);
          if (!start.isBefore(today)) {
            return ev;
          }
          if (ev.endDate != null) {
            final end = DateTime.parse(ev.endDate!.split('T').first);
            if (!end.isBefore(today)) {
              return ev;
            }
          }
        } catch (_) {}
      }
    }
    return null;
  }

  Color _getEventDotColor(String eventType) {
    final type = eventType.toLowerCase();
    if (type.contains('holiday')) {
      return const Color(0xFF10B981); // Emerald Green
    } else if (type.contains('exam')) {
      return const Color(0xFFEF4444); // Red
    } else if (type.contains('ptm') || type.contains('meeting')) {
      return const Color(0xFFF59E0B); // Amber
    }
    return const Color(0xFF3B82F6); // Blue
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text('Academic Calendar'),
        actions: [
          IconButton(
            icon: Icon(_isGridView ? Icons.view_agenda_outlined : Icons.calendar_view_month_rounded),
            tooltip: _isGridView ? 'Switch to Day Strip' : 'Switch to Month Grid',
            onPressed: () {
              setState(() => _isGridView = !_isGridView);
            },
          ),
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: _loadEvents,
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // 1. Month Switcher
                _buildMonthNavigator(),

                // 2. Upcoming Holiday Highlight Banner
                _buildUpcomingHolidayBanner(),

                // 3. Calendar View: Either Day Strip or Full Month Grid
                if (_isGridView)
                  _buildMonthGrid()
                else
                  _buildDayStrip(),

                // 4. View Mode Selector Bar
                _buildViewModeBar(),

                // 5. Events List for Selected Date
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: _loadEvents,
                    child: _buildEventsListView(),
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
              const Icon(Icons.event_available_rounded, size: 20, color: AppTheme.primary),
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

  Widget _buildUpcomingHolidayBanner() {
    final holiday = _nextUpcomingHoliday;
    if (holiday == null) return const SizedBox.shrink();

    int daysRemaining = 0;
    try {
      final start = DateTime.parse(holiday.startDate.split('T').first);
      final now = DateTime.now();
      daysRemaining = start.difference(DateTime(now.year, now.month, now.day)).inDays;
    } catch (_) {}

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 8, 16, 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF065F46), Color(0xFF047857)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF047857).withValues(alpha: 0.25),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.celebration_rounded, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Text(
                      'NEXT UPCOMING HOLIDAY',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.6,
                        color: Color(0xFFA7F3D0),
                      ),
                    ),
                    const Spacer(),
                    if (daysRemaining > 0)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.25),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          'In $daysRemaining days',
                          style: const TextStyle(fontSize: 10, color: Colors.white, fontWeight: FontWeight.bold),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  holiday.title,
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.white),
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  holiday.endDate != null
                      ? '${holiday.startDate} to ${holiday.endDate}'
                      : holiday.startDate,
                  style: const TextStyle(fontSize: 11, color: Color(0xFFD1FAE5)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDayStrip() {
    final now = DateTime.now();
    final todayStr = DateFormat('yyyy-MM-dd').format(now);
    final daysCount = _daysInMonth;

    return Container(
      height: 80,
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

          // Events on this date
          final dayEvents = _getEventsForDate(date);
          final hasEvents = dayEvents.isNotEmpty;

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
                  if (hasEvents)
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: dayEvents.take(3).map((e) {
                        return Container(
                          width: 4.5,
                          height: 4.5,
                          margin: const EdgeInsets.symmetric(horizontal: 1),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: isSelected ? Colors.white : _getEventDotColor(e.eventType),
                          ),
                        );
                      }).toList(),
                    )
                  else
                    const SizedBox(height: 4.5),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildMonthGrid() {
    final daysCount = _daysInMonth;
    final firstDayOfMonth = DateTime(_selectedMonth.year, _selectedMonth.month, 1);
    final startingWeekday = firstDayOfMonth.weekday; // 1 = Mon, 7 = Sun
    final now = DateTime.now();

    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return Container(
      color: Colors.white,
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 12),
      child: Column(
        children: [
          // Weekday header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: weekDays.map((w) {
              return SizedBox(
                width: 38,
                child: Center(
                  child: Text(
                    w,
                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.textSecondary),
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 8),

          // Days grid
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: 42, // 6 weeks * 7 days
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 7,
              mainAxisSpacing: 6,
              crossAxisSpacing: 6,
              childAspectRatio: 1.1,
            ),
            itemBuilder: (context, i) {
              final dayOffset = i - (startingWeekday - 1);
              if (dayOffset < 0 || dayOffset >= daysCount) {
                return const SizedBox.shrink();
              }

              final day = dayOffset + 1;
              final date = DateTime(_selectedMonth.year, _selectedMonth.month, day);
              final isSelected = date.year == _selectedDate.year &&
                  date.month == _selectedDate.month &&
                  date.day == _selectedDate.day;
              final isToday = date.year == now.year && date.month == now.month && date.day == now.day;
              final dayEvents = _getEventsForDate(date);

              return GestureDetector(
                onTap: () {
                  setState(() {
                    _selectedDate = date;
                    _showAllMonth = false;
                  });
                },
                child: Container(
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppTheme.primary
                        : (isToday ? const Color(0xFFEFF6FF) : Colors.transparent),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: isSelected
                          ? AppTheme.primary
                          : (isToday ? AppTheme.primary : Colors.transparent),
                    ),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        '$day',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: isSelected
                              ? Colors.white
                              : (isToday ? AppTheme.primary : AppTheme.textPrimary),
                        ),
                      ),
                      if (dayEvents.isNotEmpty)
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: dayEvents.take(3).map((e) {
                            return Container(
                              width: 4,
                              height: 4,
                              margin: const EdgeInsets.symmetric(horizontal: 0.8),
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: isSelected ? Colors.white : _getEventDotColor(e.eventType),
                              ),
                            );
                          }).toList(),
                        ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildViewModeBar() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(
                _showAllMonth ? Icons.calendar_view_month_rounded : Icons.event_rounded,
                size: 16,
                color: AppTheme.primary,
              ),
              const SizedBox(width: 6),
              Text(
                _showAllMonth
                    ? 'All Events in ${DateFormat('MMMM yyyy').format(_selectedMonth)}'
                    : DateFormat('EEEE, d MMMM yyyy').format(_selectedDate),
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textPrimary,
                ),
              ),
            ],
          ),
          TextButton.icon(
            icon: Icon(
              _showAllMonth ? Icons.filter_alt_outlined : Icons.list_alt_rounded,
              size: 14,
              color: AppTheme.primary,
            ),
            label: Text(
              _showAllMonth ? 'By Date' : 'View All',
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
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
    );
  }

  Widget _buildEventsListView() {
    final list = _filteredEvents;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        if (list.isEmpty)
          _buildEmptyState()
        else
          ...list.map((item) => _buildEventCard(item)),
      ],
    );
  }

  Widget _buildEmptyState() {
    return Container(
      margin: const EdgeInsets.only(top: 24),
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
              color: Color(0xFFEFF6FF),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.event_busy_rounded, color: AppTheme.primary, size: 32),
          ),
          const SizedBox(height: 16),
          Text(
            _showAllMonth ? 'No events scheduled for this month' : 'No events scheduled on this date',
            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 6),
          Text(
            _showAllMonth
                ? 'Check other months with the arrows above.'
                : 'Regular classes will follow the normal timetable. Tap dates with color dots to see functions & exams.',
            style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
            textAlign: TextAlign.center,
          ),
          if (!_showAllMonth) ...[
            const SizedBox(height: 16),
            ElevatedButton.icon(
              icon: const Icon(Icons.list_alt_rounded, size: 16),
              label: const Text('View All Month Events', style: TextStyle(fontSize: 13)),
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

  Widget _buildEventCard(CalendarEventItem item) {
    final color = _getEventDotColor(item.eventType);
    final isHoliday = item.eventType.toLowerCase().contains('holiday');
    final isExam = item.eventType.toLowerCase().contains('exam');

    return Card(
      margin: const EdgeInsets.only(bottom: 14),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      elevation: 1,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          border: Border(left: BorderSide(color: color, width: 5)),
        ),
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Row: Type Badge & Duration
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        isHoliday
                            ? Icons.celebration_rounded
                            : (isExam ? Icons.menu_book_rounded : Icons.event_note_rounded),
                        size: 13,
                        color: color,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        item.eventType.toUpperCase(),
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.5,
                          color: color,
                        ),
                      ),
                    ],
                  ),
                ),
                Text(
                  item.endDate != null ? '${item.startDate} to ${item.endDate}' : item.startDate,
                  style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Event Title
            Text(
              item.title,
              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
            ),

            // Event Description
            if (item.description != null && item.description!.isNotEmpty) ...[
              const SizedBox(height: 6),
              Text(
                item.description!,
                style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary, height: 1.4),
              ),
            ],

            const SizedBox(height: 12),

            // Time and Venue Bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFFF1F5F9)),
              ),
              child: Row(
                children: [
                  if (item.startTime != null) ...[
                    const Icon(Icons.access_time_rounded, size: 13, color: AppTheme.textSecondary),
                    const SizedBox(width: 4),
                    Text(
                      '${item.startTime} ${item.endTime != null ? '- ${item.endTime}' : ''}',
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppTheme.textPrimary),
                    ),
                    const SizedBox(width: 14),
                  ],
                  const Icon(Icons.location_on_outlined, size: 14, color: AppTheme.textSecondary),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      item.venue ?? 'School Campus',
                      style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 12),

            // Action: Set Reminder
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                icon: const Icon(Icons.notifications_active_outlined, size: 16),
                label: const Text('Add to My Reminders', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                style: OutlinedButton.styleFrom(
                  foregroundColor: color,
                  side: BorderSide(color: color.withValues(alpha: 0.5)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  padding: const EdgeInsets.symmetric(vertical: 8),
                ),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('⏰ Reminder set for "${item.title}"!'),
                      backgroundColor: color,
                      duration: const Duration(seconds: 2),
                      behavior: SnackBarBehavior.floating,
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
