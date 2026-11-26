
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/main.dart';

void main() {
  testWidgets('AquaGrow app launches', (WidgetTester tester) async {
    await tester.pumpWidget(const AquaGrowApp());

    expect(find.text('AquaGrow'), findsOneWidget);
  });
}
