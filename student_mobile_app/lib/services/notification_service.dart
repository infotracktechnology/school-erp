import 'dart:convert';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:permission_handler/permission_handler.dart';
import '../config/api_config.dart';

class NotificationService {
  static final FirebaseMessaging _fcm = FirebaseMessaging.instance;

  /// Request Notification Permission (Prompt on Android 13+)
  static Future<bool> requestPermission() async {
    try {
      // 1. First trigger Android 13+ native POST_NOTIFICATIONS dialog via permission_handler
      final status = await Permission.notification.status;
      debugPrint('[NotificationService] Current system notification status: $status');
      if (!status.isGranted) {
        final reqStatus = await Permission.notification.request();
        debugPrint('[NotificationService] System notification requested result: $reqStatus');
      }

      // 2. Also register FCM messaging permissions
      final settings = await _fcm.requestPermission(
        alert: true,
        announcement: false,
        badge: true,
        carPlay: false,
        criticalAlert: false,
        provisional: false,
        sound: true,
      );
      debugPrint('[NotificationService] FCM notification status: ${settings.authorizationStatus}');

      return settings.authorizationStatus == AuthorizationStatus.authorized ||
          settings.authorizationStatus == AuthorizationStatus.provisional;
    } catch (e) {
      debugPrint('[NotificationService] Error requesting permission: $e');
      return false;
    }
  }

  /// Get device FCM token and register it with student profile in backend
  static Future<void> registerToken(int studentId, {String? authToken}) async {
    try {
      final token = await _fcm.getToken();
      if (token == null) {
        debugPrint('[FCM] Token is null');
        return;
      }
      debugPrint('[FCM] Fetched token for student $studentId: $token');

      final url = Uri.parse('${ApiConfig.baseUrl}/students/$studentId/fcm-token');
      final headers = <String, String>{
        'Content-Type': 'application/json',
      };
      if (authToken != null && authToken.isNotEmpty) {
        headers['Authorization'] = 'Bearer $authToken';
      }

      final response = await http.post(
        url,
        headers: headers,
        body: jsonEncode({'token': token}),
      ).timeout(const Duration(seconds: 5));

      debugPrint('[FCM] Register response (${response.statusCode}): ${response.body}');
    } catch (e) {
      debugPrint('[FCM] Token registration failed: $e');
    }
  }

  /// Unregister device FCM token on logout
  static Future<void> unregisterToken(int studentId, {String? authToken}) async {
    try {
      final token = await _fcm.getToken();
      if (token == null) return;

      final url = Uri.parse('${ApiConfig.baseUrl}/students/$studentId/fcm-token');
      final headers = <String, String>{
        'Content-Type': 'application/json',
      };
      if (authToken != null && authToken.isNotEmpty) {
        headers['Authorization'] = 'Bearer $authToken';
      }

      final response = await http.delete(
        url,
        headers: headers,
        body: jsonEncode({'token': token}),
      ).timeout(const Duration(seconds: 5));

      debugPrint('[FCM] Unregister response (${response.statusCode}): ${response.body}');
    } catch (e) {
      debugPrint('[FCM] Token unregistration failed: $e');
    }
  }
}
