import 'package:shared_preferences/shared_preferences.dart';

class ApiConfig {
  // Production server URL
  static const String defaultBaseUrl = 'https://schoolerp.campuseyeplus.com/api';
  static const String _serverUrlKey = 'custom_server_base_url';

  static String baseUrl = defaultBaseUrl;

  static const String loginEndpoint = '/auth/login';
  static const String meEndpoint = '/auth/me';

  // Initialize saved baseUrl from storage
  static Future<void> initialize() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final saved = prefs.getString(_serverUrlKey);
      
      // If saved URL is an old local IP, upgrade to production domain
      if (saved != null && 
          saved.trim().isNotEmpty && 
          !saved.contains('192.168.') &&
          !saved.contains('10.28.') &&
          !saved.contains('10.18.') && 
          !saved.contains('10.0.2.2') &&
          !saved.contains('127.0.0.1')) {
        baseUrl = saved.trim();
      } else {
        baseUrl = defaultBaseUrl;
        await prefs.setString(_serverUrlKey, defaultBaseUrl);
      }
    } catch (_) {
      baseUrl = defaultBaseUrl;
    }
  }

  // Update and persist base URL
  static Future<void> setCustomBaseUrl(String url) async {
    baseUrl = url.trim();
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_serverUrlKey, baseUrl);
    } catch (_) {}
  }

  // Helper method to set custom host
  static Future<void> setCustomHost(String host, {String port = '5000'}) async {
    await setCustomBaseUrl('http://$host:$port/api');
  }
}
