import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../services/auth_service.dart';
import '../services/notification_service.dart';
import 'login_screen.dart';
import 'home_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _checkSession();
  }

  Future<void> _checkSession() async {
    // Request notification permission during splash
    try {
      await NotificationService.requestPermission();
    } catch (e) {
      debugPrint('[Splash] Notification permission error: $e');
    }

    await Future.delayed(const Duration(milliseconds: 1500));
    final savedUser = await AuthService.getSavedUser();

    if (savedUser != null) {
      // Sync/register FCM token with backend
      NotificationService.registerToken(
        studentId: savedUser.student?.id,
        userId: savedUser.id,
        authToken: savedUser.token,
      );
    }

    if (!mounted) return;

    if (savedUser != null) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => HomeScreen(user: savedUser),
        ),
      );
    } else {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => const LoginScreen(),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              AppTheme.primaryDark,
              AppTheme.primary,
            ],
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 90,
              height: 90,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.15),
                    blurRadius: 20,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: const Icon(
                Icons.school_rounded,
                size: 50,
                color: AppTheme.primary,
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'CampusEye Plus',
              style: TextStyle(
                color: Colors.white,
                fontSize: 26,
                fontWeight: FontWeight.w900,
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(height: 6),
            const Text(
              'Student ERP Portal',
              style: TextStyle(
                color: Color(0xFFC7D2FE),
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 48),
            const SizedBox(
              width: 24,
              height: 24,
              child: CircularProgressIndicator(
                strokeWidth: 2.5,
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
