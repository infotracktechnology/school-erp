import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../models/student_user.dart';
import '../services/notification_service.dart';
import 'announcements_screen.dart';
import 'assignments_screen.dart';
import 'attendance_screen.dart';
import 'calendar_screen.dart';
import 'gallery_screen.dart';
import 'homework_screen.dart';
import 'profile_screen.dart';
import 'timetable_screen.dart';

class HomeScreen extends StatefulWidget {
  final StudentUser user;
  const HomeScreen({super.key, required this.user});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentNavIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      NotificationService.requestPermission();
      NotificationService.registerToken(
        studentId: widget.user.student?.id,
        userId: widget.user.id,
        authToken: widget.user.token,
      );
    });
  }

  void _onBottomNavTapped(int index) {
    if (index == 0) return; // Already on Home
    if (index == 1) {
      Navigator.push(context, MaterialPageRoute(builder: (_) => HomeworkScreen(user: widget.user)));
    } else if (index == 2) {
      Navigator.push(context, MaterialPageRoute(builder: (_) => TimetableScreen(user: widget.user)));
    } else if (index == 3) {
      Navigator.push(context, MaterialPageRoute(builder: (_) => ProfileScreen(user: widget.user)));
    }
  }

  @override
  Widget build(BuildContext context) {
    final student = widget.user.student;
    final displayName = student != null && student.fullName.isNotEmpty
        ? student.fullName
        : widget.user.name;
    final admissionNo = student?.admissionNumber ?? 'ADM-2025-001';
    final classSection = student != null ? student.classSection : 'Class 5 - A';

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: Colors.white24,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Center(
                child: Text(
                  displayName.isNotEmpty ? displayName[0].toUpperCase() : 'S',
                  style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 16),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  displayName,
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                ),
                Text(
                  '$classSection • $admissionNo',
                  style: const TextStyle(fontSize: 11, color: Colors.white70),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.account_circle_outlined),
            tooltip: 'Student Profile',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => ProfileScreen(user: widget.user)),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Welcome & Attendance Quick Banner
            _buildWelcomeBanner(displayName, classSection),
            const SizedBox(height: 20),

            // Section Header
            const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Student ERP Modules',
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.textPrimary,
                  ),
                ),
                Text(
                  '8 Dedicated Services',
                  style: TextStyle(fontSize: 12, color: AppTheme.textSecondary, fontWeight: FontWeight.w500),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // 8 Modules Grid
            _buildModulesGrid(),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentNavIndex,
        onTap: (index) {
          setState(() => _currentNavIndex = index);
          _onBottomNavTapped(index);
          // Return selection to Home
          Future.delayed(const Duration(milliseconds: 300), () {
            if (mounted) setState(() => _currentNavIndex = 0);
          });
        },
        type: BottomNavigationBarType.fixed,
        selectedItemColor: AppTheme.primary,
        unselectedItemColor: AppTheme.textSecondary,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard_rounded),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.menu_book_rounded),
            label: 'Homework',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_view_week_rounded),
            label: 'Timetable',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_rounded),
            label: 'Profile',
          ),
        ],
      ),
    );
  }

  Widget _buildWelcomeBanner(String name, String classSection) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF4338CA), Color(0xFF6366F1)],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF4338CA).withValues(alpha: 0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: Colors.white24,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text(
                    'ACADEMIC YEAR 2025-2026',
                    style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 0.5),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Hello, $name! 👋',
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Colors.white),
                ),
                const SizedBox(height: 4),
                Text(
                  'Welcome to your dedicated student learning portal for $classSection.',
                  style: const TextStyle(fontSize: 12, color: Colors.white70, height: 1.3),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          // Attendance Mini Gauge
          InkWell(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => AttendanceScreen(user: widget.user)),
              );
            },
            borderRadius: BorderRadius.circular(16),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white30),
              ),
              child: const Column(
                children: [
                  Text('85.7%', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF86EFAC))),
                  SizedBox(height: 2),
                  Text('Attendance', style: TextStyle(fontSize: 10, color: Colors.white70)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildModulesGrid() {
    final modules = [
      _ModuleItem(
        title: 'Homework',
        subtitle: 'Daily subject tasks',
        badge: 'Tasks',
        icon: Icons.menu_book_rounded,
        gradient: const [Color(0xFF0284C7), Color(0xFF38BDF8)],
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => HomeworkScreen(user: widget.user))),
      ),
      _ModuleItem(
        title: 'Assignments',
        subtitle: 'Projects & deadlines',
        badge: 'Projects',
        icon: Icons.assignment_rounded,
        gradient: const [Color(0xFF7C3AED), Color(0xFFA78BFA)],
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => AssignmentsScreen(user: widget.user))),
      ),
      _ModuleItem(
        title: 'Announcements',
        subtitle: 'Circulars & alerts',
        badge: 'Notice',
        icon: Icons.campaign_rounded,
        gradient: const [Color(0xFFD97706), Color(0xFFFBBF24)],
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => AnnouncementsScreen(user: widget.user))),
      ),
      _ModuleItem(
        title: 'Timetable',
        subtitle: 'Class periods & timing',
        badge: 'Mon-Sat',
        icon: Icons.calendar_view_week_rounded,
        gradient: const [Color(0xFF4F46E5), Color(0xFF818CF8)],
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => TimetableScreen(user: widget.user))),
      ),
      _ModuleItem(
        title: 'Attendance',
        subtitle: 'Day logs & percentages',
        badge: 'Report',
        icon: Icons.how_to_reg_rounded,
        gradient: const [Color(0xFF059669), Color(0xFF34D399)],
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => AttendanceScreen(user: widget.user))),
      ),
      _ModuleItem(
        title: 'Calendar',
        subtitle: 'Holidays & exam dates',
        badge: 'Events',
        icon: Icons.event_note_rounded,
        gradient: const [Color(0xFFE11D48), Color(0xFFFB7185)],
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => CalendarScreen(user: widget.user))),
      ),
      _ModuleItem(
        title: 'Photo Gallery',
        subtitle: 'School events & photos',
        badge: 'Albums',
        icon: Icons.photo_library_rounded,
        gradient: const [Color(0xFFDB2777), Color(0xFFF472B6)],
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => GalleryScreen(user: widget.user))),
      ),
      _ModuleItem(
        title: 'My Profile',
        subtitle: 'Student identity & dossier',
        badge: '360°',
        icon: Icons.account_box_rounded,
        gradient: const [Color(0xFF334155), Color(0xFF64748B)],
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => ProfileScreen(user: widget.user))),
      ),
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: modules.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 14,
        mainAxisSpacing: 14,
        childAspectRatio: 1.15,
      ),
      itemBuilder: (context, i) {
        final mod = modules[i];
        return _buildModuleCard(mod);
      },
    );
  }

  Widget _buildModuleCard(_ModuleItem mod) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: mod.onTap,
        borderRadius: BorderRadius.circular(18),
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: const Color(0xFFE2E8F0)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.03),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    width: 42,
                    height: 42,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: mod.gradient,
                      ),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(mod.icon, color: Colors.white, size: 22),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      mod.badge,
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.textSecondary),
                    ),
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    mod.title,
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    mod.subtitle,
                    style: const TextStyle(fontSize: 10, color: AppTheme.textSecondary),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ModuleItem {
  final String title;
  final String subtitle;
  final String badge;
  final IconData icon;
  final List<Color> gradient;
  final VoidCallback onTap;

  _ModuleItem({
    required this.title,
    required this.subtitle,
    required this.badge,
    required this.icon,
    required this.gradient,
    required this.onTap,
  });
}
