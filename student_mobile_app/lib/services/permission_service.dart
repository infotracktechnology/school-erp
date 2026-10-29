import 'package:permission_handler/permission_handler.dart';

class PermissionService {
  // Request all necessary storage, media, and notification permissions
  static Future<bool> requestMediaAndStoragePermissions() async {
    try {
      final statuses = await [
        Permission.storage,
        Permission.photos,
        Permission.videos,
      ].request();

      // Return true if at least one or storage is granted
      return statuses.values.any((s) => s.isGranted || s.isLimited);
    } catch (_) {
      return false;
    }
  }

  // Check if permissions are already granted
  static Future<bool> hasMediaPermissions() async {
    try {
      final status = await Permission.photos.status;
      if (status.isGranted) return true;
      final storageStatus = await Permission.storage.status;
      return storageStatus.isGranted;
    } catch (_) {
      return false;
    }
  }
}
