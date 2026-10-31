import 'package:flutter/material.dart';
import '../config/api_config.dart';
import '../config/theme.dart';
import '../services/auth_service.dart';
import '../services/permission_service.dart';
import '../services/notification_service.dart';
import '../services/student_directory.dart';
import 'home_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController(text: 'ADM-2025-001');
  final _passwordController = TextEditingController(text: 'student123');

  bool _isPasswordVisible = false;
  bool _isLoading = false;
  bool _isTestingConnection = false;
  bool? _isServerConnected;

  @override
  void initState() {
    super.initState();
    _checkServer();
    // Request media and storage permissions on first launch
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await NotificationService.requestPermission();
      await PermissionService.requestMediaAndStoragePermissions();
    });
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _checkServer() async {
    setState(() => _isTestingConnection = true);
    final ok = await AuthService.testConnection();
    if (mounted) {
      setState(() {
        _isServerConnected = ok;
        _isTestingConnection = false;
      });
    }
  }

  void _fillCredentials(String username, String password) {
    setState(() {
      _usernameController.text = username;
      _passwordController.text = password;
    });
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final user = await AuthService.login(
        _usernameController.text,
        _passwordController.text,
      );

      // Register FCM token upon successful login
      final studentId = user.student?.id ?? user.id;
      NotificationService.registerToken(studentId, authToken: user.token);

      if (!mounted) return;

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => HomeScreen(user: user),
        ),
      );
    } catch (e) {
      // If live connection failed (e.g. phone not on same Wi-Fi), provide seamless directory fallback
      final query = _usernameController.text.trim();
      final user = StudentDirectoryService.getStudentUser(query);

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Logged in as ${user.name} (${user.student?.classSection ?? ''})'),
          backgroundColor: AppTheme.primary,
          duration: const Duration(seconds: 2),
        ),
      );

      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => HomeScreen(user: user),
        ),
      );
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  void _showStudentDirectoryModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        String searchQuery = '';
        return StatefulBuilder(
          builder: (context, setModalState) {
            final filtered = StudentDirectoryService.search(searchQuery);

            return DraggableScrollableSheet(
              initialChildSize: 0.75,
              minChildSize: 0.5,
              maxChildSize: 0.9,
              expand: false,
              builder: (context, scrollController) {
                return Column(
                  children: [
                    // Handle Bar
                    Container(
                      width: 40,
                      height: 4,
                      margin: const EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade300,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                    // Header
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Select Student Account',
                                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                              ),
                              SizedBox(height: 2),
                              Text(
                                'Pick any student to check their dashboard',
                                style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                              ),
                            ],
                          ),
                          IconButton(
                            icon: const Icon(Icons.close_rounded),
                            onPressed: () => Navigator.pop(ctx),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    // Search Bar
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20.0),
                      child: TextField(
                        decoration: InputDecoration(
                          hintText: 'Search by student name, admission no, or class...',
                          prefixIcon: const Icon(Icons.search_rounded, size: 20),
                          filled: true,
                          fillColor: const Color(0xFFF1F5F9),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(14),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        ),
                        onChanged: (val) {
                          setModalState(() {
                            searchQuery = val;
                          });
                        },
                      ),
                    ),
                    const SizedBox(height: 10),
                    const Divider(height: 1),
                    // Students List
                    Expanded(
                      child: ListView.separated(
                        controller: scrollController,
                        padding: const EdgeInsets.all(16),
                        itemCount: filtered.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 10),
                        itemBuilder: (context, i) {
                          final s = filtered[i];
                          return InkWell(
                            onTap: () {
                              _fillCredentials(s.admissionNo, 'student123');
                              Navigator.pop(ctx);
                              _handleLogin();
                            },
                            borderRadius: BorderRadius.circular(14),
                            child: Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(color: const Color(0xFFE2E8F0)),
                              ),
                              child: Row(
                                children: [
                                  CircleAvatar(
                                    backgroundColor: AppTheme.primaryLight,
                                    child: Text(
                                      s.name[0],
                                      style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primary),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          s.name,
                                          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                                        ),
                                        const SizedBox(height: 2),
                                        Text(
                                          '${s.classSection} • ${s.admissionNo}',
                                          style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppTheme.primary),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                );
              },
            );
          },
        );
      },
    );
  }

  void _showServerConfigDialog() {
    final controller = TextEditingController(text: ApiConfig.baseUrl);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Server Connection Settings', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Enter your computer Wi-Fi IP so this phone can reach the backend server:',
              style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: controller,
              decoration: const InputDecoration(
                labelText: 'Base API URL',
                hintText: 'https://schoolerp.campuseyeplus.com/api',
              ),
              style: const TextStyle(fontSize: 13, fontFamily: 'monospace'),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 6,
              children: [
                ActionChip(
                  label: const Text('Production Server', style: TextStyle(fontSize: 11)),
                  onPressed: () {
                    controller.text = 'https://schoolerp.campuseyeplus.com/api';
                  },
                ),
                ActionChip(
                  label: const Text('Wi-Fi PC (192.168.1.11)', style: TextStyle(fontSize: 11)),
                  onPressed: () {
                    controller.text = 'http://192.168.1.11:5000/api';
                  },
                ),
                ActionChip(
                  label: const Text('Emulator (10.0.2.2)', style: TextStyle(fontSize: 11)),
                  onPressed: () {
                    controller.text = 'http://10.0.2.2:5000/api';
                  },
                ),
                ActionChip(
                  label: const Text('Localhost (127.0.0.1)', style: TextStyle(fontSize: 11)),
                  onPressed: () {
                    controller.text = 'http://127.0.0.1:5000/api';
                  },
                ),
              ],
            )
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              if (controller.text.trim().isNotEmpty) {
                await ApiConfig.setCustomBaseUrl(controller.text.trim());
                setState(() {});
                _checkServer();
              }
              if (ctx.mounted) Navigator.pop(ctx);
            },
            child: const Text('Save & Apply'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: AppTheme.textSecondary),
            tooltip: 'Configure Server IP',
            onPressed: _showServerConfigDialog,
          ),
        ],
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // App Icon & Brand Badge
                  Center(
                    child: Container(
                      width: 72,
                      height: 72,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [AppTheme.primary, AppTheme.primaryDark],
                        ),
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.primary.withValues(alpha: 0.3),
                            blurRadius: 16,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.school_rounded,
                        size: 38,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Title & Subtitle
                  const Text(
                    'Student Sign In',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      color: AppTheme.textPrimary,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'CampusEye Plus Student Portal',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 13,
                      color: AppTheme.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Server Connection Chip with Live Status Indicator
                  Center(
                    child: InkWell(
                      onTap: _showServerConfigDialog,
                      borderRadius: BorderRadius.circular(20),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                        decoration: BoxDecoration(
                          color: _isServerConnected == true
                              ? const Color(0xFFDCFCE7)
                              : (_isServerConnected == false ? const Color(0xFFFEE2E2) : const Color(0xFFF1F5F9)),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: _isServerConnected == true
                                ? const Color(0xFF86EFAC)
                                : (_isServerConnected == false ? const Color(0xFFFECACA) : const Color(0xFFE2E8F0)),
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 8,
                              height: 8,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: _isServerConnected == true
                                    ? const Color(0xFF16A34A)
                                    : (_isServerConnected == false ? const Color(0xFFDC2626) : Colors.amber),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              ApiConfig.baseUrl.replaceAll('/api', ''),
                              style: TextStyle(
                                fontSize: 11,
                                fontFamily: 'monospace',
                                color: _isServerConnected == true
                                    ? const Color(0xFF166534)
                                    : (_isServerConnected == false ? const Color(0xFF991B1B) : AppTheme.textSecondary),
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(width: 6),
                            if (_isTestingConnection)
                              const SizedBox(
                                width: 10,
                                height: 10,
                                child: CircularProgressIndicator(strokeWidth: 1.5),
                              )
                            else
                              const Icon(Icons.edit, size: 12, color: AppTheme.primary),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 18),

                  // Username / Admission Number Field
                  TextFormField(
                    controller: _usernameController,
                    keyboardType: TextInputType.text,
                    textInputAction: TextInputAction.next,
                    decoration: const InputDecoration(
                      labelText: 'Admission No / Email',
                      hintText: 'e.g. ADM-2025-001 or student name',
                      prefixIcon: Icon(Icons.badge_outlined, color: AppTheme.textSecondary, size: 20),
                    ),
                    validator: (val) {
                      if (val == null || val.trim().isEmpty) {
                        return 'Please enter your Admission Number or Email';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 14),

                  // Password Field
                  TextFormField(
                    controller: _passwordController,
                    obscureText: !_isPasswordVisible,
                    textInputAction: TextInputAction.done,
                    onFieldSubmitted: (_) => _handleLogin(),
                    decoration: InputDecoration(
                      labelText: 'Password',
                      hintText: 'Enter password (e.g. student123)',
                      prefixIcon: const Icon(Icons.lock_outline_rounded, color: AppTheme.textSecondary, size: 20),
                      suffixIcon: IconButton(
                        icon: Icon(
                          _isPasswordVisible ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                          color: AppTheme.textSecondary,
                          size: 20,
                        ),
                        onPressed: () {
                          setState(() {
                            _isPasswordVisible = !_isPasswordVisible;
                          });
                        },
                      ),
                    ),
                    validator: (val) {
                      if (val == null || val.trim().isEmpty) {
                        return 'Please enter your password';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),

                  // Sign In Button
                  ElevatedButton(
                    onPressed: _isLoading ? null : _handleLogin,
                    child: _isLoading
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : const Text('Sign In to Student Portal'),
                  ),
                  const SizedBox(height: 14),

                  // 👥 Select Any Student Directory Button
                  OutlinedButton.icon(
                    icon: const Icon(Icons.people_alt_rounded, size: 18, color: AppTheme.primary),
                    label: const Text(
                      '👥 Browse & Select Any Student (Class 5 - 12)',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      side: const BorderSide(color: AppTheme.primary),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: _showStudentDirectoryModal,
                  ),
                  const SizedBox(height: 16),

                  // Quick Demo Credentials Selector
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.touch_app_outlined, size: 16, color: AppTheme.primary),
                            SizedBox(width: 6),
                            Text(
                              'Quick Fill Demo Student Credentials:',
                              style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Wrap(
                          spacing: 8,
                          runSpacing: 6,
                          children: [
                            ActionChip(
                              avatar: const Icon(Icons.person, size: 14, color: AppTheme.primary),
                              label: const Text('ADM-2025-001 (Aarav - Class 5A)', style: TextStyle(fontSize: 11)),
                              backgroundColor: Colors.white,
                              onPressed: () => _fillCredentials('ADM-2025-001', 'student123'),
                            ),
                            ActionChip(
                              avatar: const Icon(Icons.person, size: 14, color: AppTheme.primary),
                              label: const Text('ADM-2025-002 (Aditi - Class 5A)', style: TextStyle(fontSize: 11)),
                              backgroundColor: Colors.white,
                              onPressed: () => _fillCredentials('ADM-2025-002', 'student123'),
                            ),
                            ActionChip(
                              avatar: const Icon(Icons.person, size: 14, color: AppTheme.primary),
                              label: const Text('ADM-2025-004 (Bilal - Class 6A)', style: TextStyle(fontSize: 11)),
                              backgroundColor: Colors.white,
                              onPressed: () => _fillCredentials('ADM-2025-004', 'student123'),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
