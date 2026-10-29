import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';
import '../models/student_user.dart';

class AuthService {
  static const String _userPrefsKey = 'saved_student_user';
  static const String _tokenPrefsKey = 'saved_auth_token';

  // Test server connectivity
  static Future<bool> testConnection() async {
    try {
      final rootUri = Uri.parse(ApiConfig.baseUrl.replaceAll('/api', ''));
      final res = await http.get(rootUri).timeout(const Duration(seconds: 4));
      return res.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  // Perform Student Login
  static Future<StudentUser> login(String username, String password) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}${ApiConfig.loginEndpoint}');

    try {
      final response = await http
          .post(
            uri,
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'username': username.trim(),
              'password': password.trim(),
            }),
          )
          .timeout(const Duration(seconds: 3));

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        final token = data['token'] as String?;
        final user = StudentUser.fromJson(data['user'], token: token);

        // Persist session locally
        await _saveSession(user, token);
        return user;
      } else {
        throw Exception(data['message'] ?? 'Invalid admission number or password');
      }
    } on TimeoutException {
      throw Exception(
        'Connection timed out! Cannot reach server at ${ApiConfig.baseUrl}.\n'
        'Please ensure your phone and computer are on the same Wi-Fi network.',
      );
    } catch (e) {
      if (e.toString().contains('Failed host lookup') ||
          e.toString().contains('Connection refused') ||
          e.toString().contains('SocketException')) {
        throw Exception(
          'Cannot reach PC Server at ${ApiConfig.baseUrl}.\n'
          '1. Make sure your phone is connected to the same Wi-Fi as your computer.\n'
          '2. Verify your computer IP address is correct.',
        );
      }
      rethrow;
    }
  }

  // Demo user for offline testing
  static StudentUser getDemoUser({String admissionNo = 'ADM-2025-001'}) {
    return StudentUser(
      id: 2,
      name: 'Aarav Kumar',
      email: 'aarav.adm-2025-001@student.vidyamandir.edu',
      role: 'student',
      branchName: 'Main Campus (Coimbatore)',
      student: StudentProfile(
        id: 1,
        admissionNumber: admissionNo,
        rollNumber: '01',
        firstName: 'Aarav',
        lastName: 'Kumar',
        className: 'Class 5',
        sectionName: 'A',
        dob: '2015-05-12',
        gender: 'Male',
        parentName: 'Rajesh Kumar',
        parentPhone: '+91 9842101234',
        parentEmail: 'rajesh.kumar@parent.vidyamandir.edu',
        address: '124, Gandhipuram Main Road, Coimbatore',
      ),
    );
  }

  // Save session to SharedPreferences
  static Future<void> _saveSession(StudentUser user, String? token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userPrefsKey, jsonEncode(user.toJson()));
    if (token != null) {
      await prefs.setString(_tokenPrefsKey, token);
    }
  }

  // Load active session on App start
  static Future<StudentUser?> getSavedUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userJson = prefs.getString(_userPrefsKey);
    final token = prefs.getString(_tokenPrefsKey);

    if (userJson != null) {
      try {
        final map = jsonDecode(userJson);
        return StudentUser.fromJson(map, token: token);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  // Logout & clear local cache
  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_userPrefsKey);
    await prefs.remove(_tokenPrefsKey);
  }
}
