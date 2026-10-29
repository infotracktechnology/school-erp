import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../config/theme.dart';
import '../models/portal_models.dart';
import '../models/student_user.dart';
import '../services/portal_service.dart';

class AnnouncementsScreen extends StatefulWidget {
  final StudentUser user;
  const AnnouncementsScreen({super.key, required this.user});

  @override
  State<AnnouncementsScreen> createState() => _AnnouncementsScreenState();
}

class _AnnouncementsScreenState extends State<AnnouncementsScreen> {
  bool _isLoading = true;
  List<AnnouncementItem> _announcements = [];

  late DateTime _selectedMonth;
  late DateTime _selectedDate;
  final ScrollController _dateStripController = ScrollController();

  String _selectedCategory = 'All';
  bool _showAllMonth = false;

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _selectedMonth = DateTime(now.year, now.month, 1);
    _selectedDate = DateTime(now.year, now.month, now.day);
    _loadAnnouncements();
  }

  @override
  void dispose() {
    _dateStripController.dispose();
    super.dispose();
  }

  Future<void> _loadAnnouncements() async {
    setState(() => _isLoading = true);
    final studentId = widget.user.student?.id ?? 1;
    final data = await PortalService.getStudentPortalFeed(studentId: studentId);
    setState(() {
      _announcements = data['announcements'] as List<AnnouncementItem>? ?? [];
      _isLoading = false;
    });

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _scrollToSelectedDate();
    });
  }

  List<AnnouncementItem> get _effectiveList {
    if (_announcements.isNotEmpty) return _announcements;
    return [
      AnnouncementItem(
        id: 1,
        title: 'Annual Inter-School Sports Meet 2026',
        message: 'The Annual Sports Meet will be held on November 15, 2026. Interested athletes must register with Coach Vijay before October 30. House track suits are compulsory for all participating houses (Ruby, Emerald, Sapphire, Topaz).',
        category: 'Sports & Athletics',
        publishedDate: '2026-10-27 10:30 AM',
        priority: 'High',
        issuedBy: 'Physical Education Dept',
        targetAudience: 'All Classes',
        attachmentUrl: 'Sports_Schedule_2026.pdf',
      ),
      AnnouncementItem(
        id: 2,
        title: 'Term 1 Report Card Distribution & PTA Meeting',
        message: 'Parent-Teacher Meeting for Class 5 to 12 will take place this Saturday, November 1st, from 09:30 AM to 01:00 PM. All parents are kindly requested to attend to review student progress and attendance.',
        category: 'Academic Notice',
        publishedDate: '2026-10-26 02:15 PM',
        priority: 'High',
        issuedBy: 'Principal Office',
        targetAudience: 'Parents & Students',
        attachmentUrl: 'PTA_Schedule_Slots.pdf',
      ),
      AnnouncementItem(
        id: 3,
        title: 'Diwali Festival Holidays Circular',
        message: 'The school campus will remain closed for Diwali festivities from November 8th to November 12th. Classes will resume with regular timings on Wednesday, November 13th. Happy and safe Diwali!',
        category: 'Holiday Notice',
        publishedDate: '2026-10-25 04:00 PM',
        priority: 'Normal',
        issuedBy: 'Administrative Office',
        targetAudience: 'All Staff & Students',
        attachmentUrl: 'Holiday_Circular_Diwali.pdf',
      ),
      AnnouncementItem(
        id: 4,
        title: 'National Science & Robotics Olympiad Registration',
        message: 'National Science Olympiad (NSO) examination will be conducted on December 5th. Registration fee of Rs. 150 must be paid through class teacher before November 10th.',
        category: 'Competition',
        publishedDate: '2026-10-20 11:00 AM',
        priority: 'Normal',
        issuedBy: 'Science Faculty',
        targetAudience: 'Class 6 - 12',
      ),
      AnnouncementItem(
        id: 5,
        title: 'Campus WiFi & Smart Classroom Maintenance Notice',
        message: 'Network infrastructure upgrades will occur this Friday evening. Portal access may experience brief 15-minute maintenance windows between 08:00 PM and 09:00 PM.',
        category: 'General Notice',
        publishedDate: '2026-10-18 05:00 PM',
        priority: 'Normal',
        issuedBy: 'IT Infrastructure Dept',
        targetAudience: 'All Users',
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

  Map<String, List<AnnouncementItem>> get _announcementsByDate {
    final map = <String, List<AnnouncementItem>>{};
    for (final item in _effectiveList) {
      if (item.publishedDate.isNotEmpty) {
        final dStr = item.publishedDate.split(' ').first.trim();
        map.putIfAbsent(dStr, () => []).add(item);
      }
    }
    return map;
  }

  List<AnnouncementItem> get _filteredList {
    List<AnnouncementItem> list = _effectiveList;

    // Apply category filter
    if (_selectedCategory == 'Urgent') {
      list = list.where((a) => a.priority.toLowerCase() == 'high').toList();
    } else if (_selectedCategory == 'Academic') {
      list = list.where((a) => a.category.toLowerCase().contains('academic')).toList();
    } else if (_selectedCategory == 'Sports') {
      list = list.where((a) => a.category.toLowerCase().contains('sport')).toList();
    } else if (_selectedCategory == 'Holidays') {
      list = list.where((a) => a.category.toLowerCase().contains('holiday')).toList();
    }

    // Apply date/month filter if not viewing all month
    if (!_showAllMonth) {
      final selectedDateStr = DateFormat('yyyy-MM-dd').format(_selectedDate);
      list = list.where((a) {
        if (a.publishedDate.isEmpty) return false;
        final dStr = a.publishedDate.split(' ').first.trim();
        return dStr == selectedDateStr;
      }).toList();
    } else {
      final monthPrefix = DateFormat('yyyy-MM').format(_selectedMonth);
      list = list.where((a) {
        if (a.publishedDate.isEmpty) return true;
        return a.publishedDate.startsWith(monthPrefix);
      }).toList();
    }

    return list;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text('Digital Notice Board'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: _loadAnnouncements,
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

                // 2. Horizontal Broadcast Date Strip
                _buildBroadcastDateStrip(),

                // 3. Category Filter Tabs
                _buildCategoryTabs(),

                // 4. Announcements List
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: _loadAnnouncements,
                    child: _buildAnnouncementsView(),
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
              const Icon(Icons.campaign_rounded, size: 22, color: AppTheme.primary),
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

  Widget _buildBroadcastDateStrip() {
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

          // Check if date has notices
          final noticesOnDate = _announcementsByDate[dateStr] ?? [];
          final hasNotices = noticesOnDate.isNotEmpty;

          Color dotColor = Colors.transparent;
          if (hasNotices) {
            final hasUrgent = noticesOnDate.any((n) => n.priority.toLowerCase() == 'high');
            dotColor = hasUrgent ? const Color(0xFFEF4444) : const Color(0xFF3B82F6);
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

  Widget _buildCategoryTabs() {
    final categories = [
      {'key': 'All', 'label': 'All Notices'},
      {'key': 'Urgent', 'label': '🚨 Urgent'},
      {'key': 'Academic', 'label': '🎓 Academic'},
      {'key': 'Sports', 'label': '🏆 Sports'},
      {'key': 'Holidays', 'label': '🏖️ Holidays'},
    ];

    return Container(
      color: Colors.white,
      padding: const EdgeInsets.only(left: 12, right: 12, bottom: 8),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: categories.map((cat) {
            final isSelected = _selectedCategory == cat['key'];
            return Padding(
              padding: const EdgeInsets.only(right: 8),
              child: FilterChip(
                label: Text(
                  cat['label']!,
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
                  setState(() => _selectedCategory = cat['key']!);
                },
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildAnnouncementsView() {
    final list = _filteredList;
    final selectedDateStr = DateFormat('EEEE, d MMMM yyyy').format(_selectedDate);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Sub-header displaying selected mode
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Row(
                children: [
                  Icon(
                    _showAllMonth ? Icons.calendar_view_month_rounded : Icons.mark_email_unread_rounded,
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
          ...list.map((item) => _buildNoticeCard(item)),
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
              color: Color(0xFFEFF6FF),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.notifications_none_rounded, color: AppTheme.primary, size: 32),
          ),
          const SizedBox(height: 16),
          Text(
            _showAllMonth
                ? 'No ${_selectedCategory == 'All' ? '' : '$_selectedCategory '}notices found this month'
                : 'No circulars broadcasted on this date',
            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 6),
          Text(
            _showAllMonth
                ? 'Check back later or select another category.'
                : 'Tap another date with a dot badge on the strip above or click "View All" to explore the full month.',
            style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
            textAlign: TextAlign.center,
          ),
          if (!_showAllMonth) ...[
            const SizedBox(height: 16),
            ElevatedButton.icon(
              icon: const Icon(Icons.list_alt_rounded, size: 16),
              label: const Text('View All Month Notices', style: TextStyle(fontSize: 13)),
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

  Widget _buildNoticeCard(AnnouncementItem item) {
    final isHigh = item.priority.toLowerCase() == 'high';

    return Card(
      margin: const EdgeInsets.only(bottom: 14),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      elevation: 1,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Row: Category Badge + Urgent Tag + Time
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF59E0B).withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        item.category,
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFFD97706),
                        ),
                      ),
                    ),
                    if (isHigh) ...[
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFEF2F2),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: const Color(0xFFFECACA)),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.warning_amber_rounded, size: 12, color: Color(0xFFDC2626)),
                            SizedBox(width: 3),
                            Text(
                              'URGENT',
                              style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFFDC2626)),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
                Text(
                  item.publishedDate.split(' ').length > 1
                      ? '${item.publishedDate.split(' ')[1]} ${item.publishedDate.split(' ').length > 2 ? item.publishedDate.split(' ')[2] : ''}'
                      : item.publishedDate,
                  style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary, fontWeight: FontWeight.w500),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Title
            Text(
              item.title,
              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
            ),

            // Authority and Audience metadata
            const SizedBox(height: 6),
            Row(
              children: [
                const Icon(Icons.account_balance_outlined, size: 13, color: AppTheme.textSecondary),
                const SizedBox(width: 4),
                Text(
                  item.issuedBy ?? 'School Administration',
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppTheme.textSecondary),
                ),
                const SizedBox(width: 10),
                const Icon(Icons.group_outlined, size: 13, color: AppTheme.textSecondary),
                const SizedBox(width: 4),
                Text(
                  item.targetAudience ?? 'All Students',
                  style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary),
                ),
              ],
            ),

            const SizedBox(height: 10),

            // Message content
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFF1F5F9)),
              ),
              child: Text(
                item.message,
                style: const TextStyle(fontSize: 13, color: AppTheme.textPrimary, height: 1.45),
              ),
            ),

            const SizedBox(height: 12),

            // Actions: View Circular PDF + Share
            Row(
              children: [
                if (item.attachmentUrl != null) ...[
                  Expanded(
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.picture_as_pdf_rounded, size: 16),
                      label: const Text('View Official Circular', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primary,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        padding: const EdgeInsets.symmetric(vertical: 8),
                      ),
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('📄 Opening circular: ${item.attachmentUrl}...'),
                            backgroundColor: AppTheme.primary,
                            duration: const Duration(seconds: 2),
                            behavior: SnackBarBehavior.floating,
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(width: 8),
                ],
                OutlinedButton.icon(
                  icon: const Icon(Icons.share_outlined, size: 16),
                  label: const Text('Share', style: TextStyle(fontSize: 12)),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppTheme.textPrimary,
                    side: const BorderSide(color: Color(0xFFCBD5E1)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('🔗 Sharing "${item.title}"...'),
                        duration: const Duration(seconds: 1),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
