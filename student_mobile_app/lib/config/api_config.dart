import 'package:shared_preferences/shared_preferences.dart';

class ApiConfig {
  // Production live server domain
  static const String defaultBaseUrl = 'https://schoolerp.campuseyeplus.com/api';
  static const String _serverUrlKey = 'custom_server_base_url_prod_v1';

  static String baseUrl = defaultBaseUrl;

  static const String loginEndpoint = '/auth/login';
  static const String meEndpoint = '/auth/me';

  // Initialize saved baseUrl from storage
  static Future<void> initialize() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final saved = prefs.getString(_serverUrlKey);
      
      if (saved != null && saved.trim().isNotEmpty) {
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
