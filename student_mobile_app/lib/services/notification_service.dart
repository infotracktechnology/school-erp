import 'dart:convert';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:permission_handler/permission_handler.dart';
import '../config/api_config.dart';

class NotificationService {
  static final FirebaseMessaging _fcm = FirebaseMessaging.instance;

  /// Request Notification Permission (Prompt on Android 13+) and setup foreground alerts
  static Future<bool> requestPermission() async {
    try {
      // 1. Configure foreground notification presentation options
      await _fcm.setForegroundNotificationPresentationOptions(
        alert: true,
        badge: true,
        sound: true,
      );

      // 2. Trigger Android 13+ native POST_NOTIFICATIONS dialog via permission_handler
      final status = await Permission.notification.status;
      debugPrint('[NotificationService] Current system notification status: $status');
      if (!status.isGranted) {
        final reqStatus = await Permission.notification.request();
        debugPrint('[NotificationService] System notification requested result: $reqStatus');
      }

      // 3. Register FCM messaging permissions
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

  /// Listen for incoming messages while app is in foreground or clicked
  static void setupForegroundMessageListeners() {
    try {
      FirebaseMessaging.onMessage.listen((RemoteMessage message) {
        debugPrint('[FCM Foreground] Message received: ${message.messageId}');
        debugPrint('[FCM Foreground] Notification: title="${message.notification?.title}", body="${message.notification?.body}"');
        debugPrint('[FCM Foreground] Data: ${message.data}');
      });

      FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
        debugPrint('[FCM onMessageOpenedApp] User clicked notification: ${message.data}');
      });
    } catch (e) {
      debugPrint('[NotificationService] Error attaching message listeners: $e');
    }
  }

  /// Get device FCM token and register it with both user_id and student_id in backend
  static Future<void> registerToken({
    int? studentId,
    int? userId,
    String? authToken,
  }) async {
    try {
      final token = await _fcm.getToken();
      if (token == null) {
        debugPrint('[FCM] Token is null');
        return;
      }
      debugPrint('[FCM] Fetched token: $token (studentId=$studentId, userId=$userId)');

      final headers = <String, String>{
        'Content-Type': 'application/json',
      };
      if (authToken != null && authToken.isNotEmpty) {
        headers['Authorization'] = 'Bearer $authToken';
      }

      final body = jsonEncode({'token': token});

      // 1. Register with User ID (live production server target)
      if (userId != null && userId > 0) {
        try {
          final userUrl = Uri.parse('${ApiConfig.baseUrl}/admin/users/$userId/fcm-token');
          final userRes = await http.post(userUrl, headers: headers, body: body)
              .timeout(const Duration(seconds: 5));
          debugPrint('[FCM] /admin/users/$userId/fcm-token response (${userRes.statusCode}): ${userRes.body}');
        } catch (e) {
          debugPrint('[FCM] Error posting to user fcm-token: $e');
        }
      }

      // 2. Register with Student ID (student endpoint)
      if (studentId != null && studentId > 0) {
        try {
          final studentUrl = Uri.parse('${ApiConfig.baseUrl}/students/$studentId/fcm-token');
          final studentRes = await http.post(studentUrl, headers: headers, body: body)
              .timeout(const Duration(seconds: 5));
          debugPrint('[FCM] /students/$studentId/fcm-token response (${studentRes.statusCode}): ${studentRes.body}');
        } catch (e) {
          debugPrint('[FCM] Error posting to student fcm-token: $e');
        }
      }
    } catch (e) {
      debugPrint('[FCM] Token registration failed gracefully: $e');
    }
  }

  /// Unregister device FCM token on logout
  static Future<void> unregisterToken({
    int? studentId,
    int? userId,
    String? authToken,
  }) async {
    try {
      final token = await _fcm.getToken();
      if (token == null) return;

      final headers = <String, String>{
        'Content-Type': 'application/json',
      };
      if (authToken != null && authToken.isNotEmpty) {
        headers['Authorization'] = 'Bearer $authToken';
      }

      final body = jsonEncode({'token': token});

      if (userId != null && userId > 0) {
        try {
          final userUrl = Uri.parse('${ApiConfig.baseUrl}/admin/users/$userId/fcm-token');
          await http.delete(userUrl, headers: headers, body: body).timeout(const Duration(seconds: 5));
        } catch (_) {}
      }

      if (studentId != null && studentId > 0) {
        try {
          final studentUrl = Uri.parse('${ApiConfig.baseUrl}/students/$studentId/fcm-token');
          await http.delete(studentUrl, headers: headers, body: body).timeout(const Duration(seconds: 5));
        } catch (_) {}
      }
    } catch (e) {
      debugPrint('[FCM] Token unregistration failed gracefully: $e');
    }
  }
}
