import 'package:flutter_test/flutter_test.dart';
import 'package:student_mobile_app/main.dart';

void main() {
  testWidgets('App renders splash screen', (WidgetTester tester) async {
    await tester.pumpWidget(const CampusEyeStudentApp());
    expect(find.text('CampusEye Plus'), findsOneWidget);
    await tester.pump(const Duration(seconds: 2));
  });
}
