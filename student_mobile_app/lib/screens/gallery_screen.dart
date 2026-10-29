import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../config/theme.dart';
import '../models/portal_models.dart';
import '../models/student_user.dart';
import '../services/portal_service.dart';
import 'album_detail_screen.dart';

class GalleryScreen extends StatefulWidget {
  final StudentUser user;
  const GalleryScreen({super.key, required this.user});

  @override
  State<GalleryScreen> createState() => _GalleryScreenState();
}

class _GalleryScreenState extends State<GalleryScreen> {
  bool _isLoading = true;
  List<GalleryAlbumItem> _albums = [];

  late DateTime _selectedMonth;
  String _selectedCategory = 'All';
  bool _showAllMonths = false;

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _selectedMonth = DateTime(now.year, now.month, 1);
    _loadAlbums();
  }

  Future<void> _loadAlbums() async {
    setState(() => _isLoading = true);
    final studentId = widget.user.student?.id ?? 1;
    final data = await PortalService.getStudentPortalFeed(studentId: studentId);
    setState(() {
      _albums = data['albums'] as List<GalleryAlbumItem>? ?? [];
      _isLoading = false;
    });
  }

  List<GalleryAlbumItem> get _effectiveList {
    if (_albums.isNotEmpty) return _albums;
    return [
      GalleryAlbumItem(
        id: 1,
        title: 'Annual Sports Day 2026',
        description: 'Track and field competition highlights, relay races, and championship trophy ceremony.',
        eventDate: '2026-10-15',
        category: 'Sports',
        coverImageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
        photos: [
          'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=800&auto=format&fit=crop&q=80',
        ],
      ),
      GalleryAlbumItem(
        id: 2,
        title: 'Inter-School Science & Robotics Expo',
        description: 'Student science projects, AI robotics demonstration, and working model showcases.',
        eventDate: '2026-10-22',
        category: 'Science',
        coverImageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
        photos: [
          'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
        ],
      ),
      GalleryAlbumItem(
        id: 3,
        title: 'Independence Day Cultural Fest',
        description: 'Flag hoisting ceremony, patriotic songs, drama performances, and march past salute.',
        eventDate: '2026-08-15',
        category: 'Cultural',
        coverImageUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&auto=format&fit=crop&q=80',
        photos: [
          'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
        ],
      ),
      GalleryAlbumItem(
        id: 4,
        title: 'Tamil Ilakkiya Mandram Celebrations',
        description: 'Traditional Tamil dance, Villupaattu, oratorical competitions, and Kural recitation fest.',
        eventDate: '2026-07-22',
        category: 'Cultural',
        coverImageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
        photos: [
          'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
        ],
      ),
      GalleryAlbumItem(
        id: 5,
        title: 'Investiture & Student Council Oath Ceremony',
        description: 'Badge pinning for Head Boy, Head Girl, Sports Captain, and House Prefects.',
        eventDate: '2026-06-18',
        category: 'Honors',
        coverImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
        photos: [
          'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
        ],
      ),
    ];
  }

  void _previousMonth() {
    setState(() {
      _selectedMonth = DateTime(_selectedMonth.year, _selectedMonth.month - 1, 1);
      _showAllMonths = false;
    });
  }

  void _nextMonth() {
    setState(() {
      _selectedMonth = DateTime(_selectedMonth.year, _selectedMonth.month + 1, 1);
      _showAllMonths = false;
    });
  }

  List<GalleryAlbumItem> get _filteredAlbums {
    List<GalleryAlbumItem> list = _effectiveList;

    // Apply category filter
    if (_selectedCategory == 'Sports') {
      list = list.where((a) => a.category.toLowerCase().contains('sport')).toList();
    } else if (_selectedCategory == 'Science') {
      list = list.where((a) => a.category.toLowerCase().contains('science')).toList();
    } else if (_selectedCategory == 'Cultural') {
      list = list.where((a) => a.category.toLowerCase().contains('cultural') || a.category.toLowerCase().contains('arts')).toList();
    } else if (_selectedCategory == 'Honors') {
      list = list.where((a) => a.category.toLowerCase().contains('honor') || a.category.toLowerCase().contains('council')).toList();
    }

    // Apply Month filter if not showing all
    if (!_showAllMonths) {
      final monthPrefix = DateFormat('yyyy-MM').format(_selectedMonth);
      list = list.where((a) {
        if (a.eventDate.isEmpty) return true;
        return a.eventDate.startsWith(monthPrefix);
      }).toList();
    }

    return list;
  }

  void _showPermissionsInfoDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.photo_library_outlined, color: AppTheme.primary),
            SizedBox(width: 8),
            Text('Media Access Granted', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ],
        ),
        content: const Text(
          'CampusEye Student app has permission to display school event photos and allow students to save photos to their device gallery with pinch-to-zoom.',
          style: TextStyle(fontSize: 13, color: AppTheme.textSecondary, height: 1.4),
        ),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('OK, Got It'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text('Photo Gallery & Albums'),
        actions: [
          IconButton(
            icon: const Icon(Icons.security_outlined),
            tooltip: 'Media Permissions Info',
            onPressed: _showPermissionsInfoDialog,
          ),
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: _loadAlbums,
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

                // 2. Event Category Filter Pills
                _buildCategoryTabs(),

                // 3. Status Bar (Selected Month / View All)
                _buildStatusBar(),

                // 4. Albums Grid / List
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: _loadAlbums,
                    child: _buildAlbumsView(),
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
              const Icon(Icons.collections_rounded, size: 20, color: AppTheme.primary),
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

  Widget _buildCategoryTabs() {
    final categories = [
      {'key': 'All', 'label': '🌟 All Albums'},
      {'key': 'Sports', 'label': '🏃 Sports & Athletics'},
      {'key': 'Science', 'label': '🔬 Science & Tech'},
      {'key': 'Cultural', 'label': '🎭 Arts & Culturals'},
      {'key': 'Honors', 'label': '🎓 Council & Honors'},
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

  Widget _buildStatusBar() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            _showAllMonths
                ? 'Showing All Albums (${_filteredAlbums.length} albums)'
                : 'Albums in ${DateFormat('MMMM yyyy').format(_selectedMonth)} (${_filteredAlbums.length})',
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
          ),
          TextButton.icon(
            icon: Icon(
              _showAllMonths ? Icons.filter_alt_outlined : Icons.collections_bookmark_rounded,
              size: 14,
              color: AppTheme.primary,
            ),
            label: Text(
              _showAllMonths ? 'By Month' : 'View All',
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
            ),
            style: TextButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              minimumSize: Size.zero,
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
            onPressed: () {
              setState(() => _showAllMonths = !_showAllMonths);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildAlbumsView() {
    final list = _filteredAlbums;

    if (list.isEmpty) {
      return _buildEmptyState();
    }

    return GridView.builder(
      padding: const EdgeInsets.all(16.0),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 14,
        mainAxisSpacing: 14,
        childAspectRatio: 0.78,
      ),
      itemCount: list.length,
      itemBuilder: (context, i) {
        final album = list[i];
        return _buildAlbumCard(album);
      },
    );
  }

  Widget _buildEmptyState() {
    return Container(
      margin: const EdgeInsets.only(top: 36, left: 16, right: 16),
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
            child: const Icon(Icons.photo_library_outlined, color: AppTheme.primary, size: 32),
          ),
          const SizedBox(height: 16),
          Text(
            _showAllMonths
                ? 'No ${_selectedCategory == 'All' ? '' : '$_selectedCategory '}albums available'
                : 'No albums for ${DateFormat('MMMM yyyy').format(_selectedMonth)}',
            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 6),
          Text(
            _showAllMonths
                ? 'New school event memories will be uploaded soon.'
                : 'Use the arrows above to browse other months or click "View All" to explore all event photos.',
            style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
            textAlign: TextAlign.center,
          ),
          if (!_showAllMonths) ...[
            const SizedBox(height: 16),
            ElevatedButton.icon(
              icon: const Icon(Icons.collections_rounded, size: 16),
              label: const Text('View All Event Albums', style: TextStyle(fontSize: 13)),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primary,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              onPressed: () {
                setState(() => _showAllMonths = true);
              },
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildAlbumCard(GalleryAlbumItem album) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      clipBehavior: Clip.antiAlias,
      elevation: 2,
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => AlbumDetailScreen(album: album),
            ),
          );
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Album Cover Image with Gradient & Badges
            Expanded(
              child: Stack(
                fit: StackFit.expand,
                children: [
                  if (album.coverImageUrl != null && album.coverImageUrl!.isNotEmpty)
                    Image.network(
                      album.coverImageUrl!,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => _buildPlaceholderCover(),
                    )
                  else
                    _buildPlaceholderCover(),

                  // Gradient scrim at bottom
                  Positioned.fill(
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.transparent,
                            Colors.black.withValues(alpha: 0.65),
                          ],
                        ),
                      ),
                    ),
                  ),

                  // Top Category Tag
                  Positioned(
                    top: 8,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.6),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        album.category.toUpperCase(),
                        style: const TextStyle(
                          fontSize: 9,
                          color: Colors.white,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ),

                  // Bottom Photo count badge
                  Positioned(
                    bottom: 8,
                    right: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.7),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.photo_camera_rounded, size: 11, color: Colors.white),
                          const SizedBox(width: 4),
                          Text(
                            '${album.photos.length} photos',
                            style: const TextStyle(fontSize: 10, color: Colors.white, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Title & Date
            Padding(
              padding: const EdgeInsets.all(10.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    album.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
                  ),
                  const SizedBox(height: 3),
                  Row(
                    children: [
                      const Icon(Icons.event_outlined, size: 11, color: AppTheme.textSecondary),
                      const SizedBox(width: 3),
                      Text(
                        album.eventDate,
                        style: const TextStyle(fontSize: 10, color: AppTheme.textSecondary, fontWeight: FontWeight.w500),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlaceholderCover() {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF4F46E5), Color(0xFFE11D48)],
        ),
      ),
      child: const Center(
        child: Icon(Icons.photo_library_rounded, size: 40, color: Colors.white70),
      ),
    );
  }
}
