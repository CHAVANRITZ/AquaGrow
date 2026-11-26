
import 'package:flutter/material.dart';
import '../services/api_service.dart';

class SensorHistoryScreen extends StatefulWidget {
  const SensorHistoryScreen({super.key});

  @override
  State<SensorHistoryScreen> createState() =>
      _SensorHistoryScreenState();
}

class _SensorHistoryScreenState extends State<SensorHistoryScreen> {
  List<Map<String, dynamic>> readings = [];

  bool isLoading = true;
  String? errorMessage;

  String selectedSensor = 'soilMoisture';

  final Map<String, Map<String, dynamic>> sensors = {
    'soilMoisture': {
      'name': 'Soil Moisture',
      'unit': '%',
      'icon': Icons.grass,
      'color': const Color(0xFF2E7D32),
    },
    'temperature': {
      'name': 'Temperature',
      'unit': '°C',
      'icon': Icons.thermostat,
      'color': const Color(0xFFEF6C00),
    },
    'humidity': {
      'name': 'Humidity',
      'unit': '%',
      'icon': Icons.water_drop,
      'color': const Color(0xFF0288D1),
    },
    'waterLevel': {
      'name': 'Water Level',
      'unit': '%',
      'icon': Icons.opacity,
      'color': const Color(0xFF00838F),
    },
  };

  @override
  void initState() {
    super.initState();
    fetchReadings();
  }

  Future<void> fetchReadings() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final result = await ApiService.getReadings();

      if (!mounted) return;

      setState(() {
        readings = result;
        isLoading = false;
      });
    } catch (error) {
      if (!mounted) return;

      setState(() {
        errorMessage = error.toString();
        isLoading = false;
      });
    }
  }

  double getValue(dynamic value) {
    if (value is num) return value.toDouble();
    return double.tryParse(value.toString()) ?? 0;
  }

  String formatDate(dynamic value) {
    if (value == null) return 'Unknown date';

    try {
      final date = DateTime.parse(value.toString()).toLocal();

      final day = date.day.toString().padLeft(2, '0');
      final month = date.month.toString().padLeft(2, '0');
      final year = date.year;

      final hour = date.hour.toString().padLeft(2, '0');
      final minute = date.minute.toString().padLeft(2, '0');

      return '$day/$month/$year • $hour:$minute';
    } catch (_) {
      return 'Invalid date';
    }
  }

  @override
  Widget build(BuildContext context) {
    final sensor = sensors[selectedSensor]!;
    final color = sensor['color'] as Color;
    final unit = sensor['unit'] as String;

    // API returns newest records first.
    // Reverse them so the chart runs from oldest to newest.
    final chartReadings = readings.reversed.toList();

    final chartValues = chartReadings
        .map((reading) => getValue(reading[selectedSensor]))
        .toList();

    final latestValue = readings.isNotEmpty
        ? getValue(readings.first[selectedSensor])
        : 0.0;

    return Scaffold(
      backgroundColor: const Color(0xFFF5F8F4),
      appBar: AppBar(
        title: const Text(
          'Sensor History',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: const Color(0xFF1B5E20),
        foregroundColor: Colors.white,
      ),
      body: isLoading
          ? const Center(
              child: CircularProgressIndicator(),
            )
          : errorMessage != null
              ? _buildErrorView()
              : readings.isEmpty
                  ? _buildEmptyView()
                  : RefreshIndicator(
                      onRefresh: fetchReadings,
                      child: ListView(
                        physics:
                            const AlwaysScrollableScrollPhysics(),
                        padding: const EdgeInsets.all(16),
                        children: [
                          _buildSummaryCard(
                            sensor,
                            latestValue,
                            unit,
                            color,
                          ),
                          const SizedBox(height: 20),
                          _buildChartCard(
                            sensor,
                            chartValues,
                            color,
                            unit,
                          ),
                          const SizedBox(height: 20),
                          const Text(
                            'Recorded Readings',
                            style: TextStyle(
                              fontSize: 19,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF26332A),
                            ),
                          ),
                          const SizedBox(height: 12),
                          ...readings.map(
                            (reading) => _buildReadingCard(reading),
                          ),
                          const SizedBox(height: 16),
                          const Center(
                            child: Text(
                              'AquaGrow IoT • Sensor History',
                              style: TextStyle(
                                color: Colors.grey,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
    );
  }

  Widget _buildSummaryCard(
    Map<String, dynamic> sensor,
    double value,
    String unit,
    Color color,
  ) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1B5E20),
        borderRadius: BorderRadius.circular(18),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 27,
            backgroundColor: Colors.white.withValues(alpha: 0.15),
            child: Icon(
              sensor['icon'] as IconData,
              color: Colors.white,
              size: 28,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  sensor['name'] as String,
                  style: const TextStyle(
                    color: Colors.white70,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 5),
                Text(
                  '${value.toStringAsFixed(1)}$unit',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 27,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Text(
                  'Latest recorded value',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChartCard(
    Map<String, dynamic> sensor,
    List<double> values,
    Color color,
    String unit,
  ) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Sensor Trend',
            style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 14),
          DropdownButtonFormField<String>(
  initialValue: selectedSensor,
            decoration: InputDecoration(
              labelText: 'Select Sensor',
              prefixIcon: Icon(
                sensor['icon'] as IconData,
                color: color,
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 12,
                vertical: 10,
              ),
            ),
            items: sensors.entries.map((entry) {
              return DropdownMenuItem<String>(
                value: entry.key,
                child: Text(entry.value['name'] as String),
              );
            }).toList(),
            onChanged: (value) {
              if (value == null) return;
              setState(() {
                selectedSensor = value;
              });
            },
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 210,
            width: double.infinity,
            child: CustomPaint(
              painter: SensorChartPainter(
                values: values,
                lineColor: color,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '${values.length} recorded data points • Oldest to newest',
            style: const TextStyle(
              color: Colors.grey,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReadingCard(Map<String, dynamic> reading) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.access_time,
                size: 17,
                color: Color(0xFF1B5E20),
              ),
              const SizedBox(width: 7),
              Expanded(
                child: Text(
                  formatDate(reading['createdAt']),
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 13,
                  ),
                ),
              ),
            ],
          ),
          const Divider(height: 22),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _smallReading(
                'Soil',
                '${getValue(reading['soilMoisture']).toStringAsFixed(0)}%',
                const Color(0xFF2E7D32),
              ),
              _smallReading(
                'Temperature',
                '${getValue(reading['temperature']).toStringAsFixed(0)}°C',
                const Color(0xFFEF6C00),
              ),
              _smallReading(
                'Humidity',
                '${getValue(reading['humidity']).toStringAsFixed(0)}%',
                const Color(0xFF0288D1),
              ),
              _smallReading(
                'Water',
                '${getValue(reading['waterLevel']).toStringAsFixed(0)}%',
                const Color(0xFF00838F),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _smallReading(String label, String value, Color color) {
    return SizedBox(
      width: 125,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.grey,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 3),
          Text(
            value,
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorView() {
    return ListView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(24),
      children: [
        const SizedBox(height: 120),
        const Icon(
          Icons.cloud_off,
          size: 60,
          color: Colors.redAccent,
        ),
        const SizedBox(height: 16),
        const Center(
          child: Text(
            'Unable to load sensor history',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        const SizedBox(height: 10),
        Text(
          errorMessage ?? '',
          textAlign: TextAlign.center,
          style: const TextStyle(color: Colors.grey),
        ),
        const SizedBox(height: 20),
        Center(
          child: ElevatedButton.icon(
            onPressed: fetchReadings,
            icon: const Icon(Icons.refresh),
            label: const Text('Try Again'),
          ),
        ),
      ],
    );
  }

  Widget _buildEmptyView() {
    return ListView(
      physics: const AlwaysScrollableScrollPhysics(),
      children: const [
        SizedBox(height: 150),
        Icon(
          Icons.show_chart,
          size: 65,
          color: Colors.grey,
        ),
        SizedBox(height: 15),
        Center(
          child: Text(
            'No sensor readings available',
            style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        SizedBox(height: 8),
        Center(
          child: Text(
            'Sensor records will appear here when available.',
            style: TextStyle(color: Colors.grey),
          ),
        ),
      ],
    );
  }
}

class SensorChartPainter extends CustomPainter {
  final List<double> values;
  final Color lineColor;

  SensorChartPainter({
    required this.values,
    required this.lineColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (values.isEmpty) return;

    const leftPadding = 35.0;
    const rightPadding = 12.0;
    const topPadding = 15.0;
    const bottomPadding = 25.0;

    final chartWidth = size.width - leftPadding - rightPadding;
    final chartHeight = size.height - topPadding - bottomPadding;

    final minValue = values.reduce((a, b) => a < b ? a : b);
    final maxValue = values.reduce((a, b) => a > b ? a : b);

    final range = maxValue - minValue;
    final adjustedRange = range == 0 ? 1.0 : range;
    final padding = adjustedRange * 0.2;

    final chartMin = minValue - padding;
    final chartMax = maxValue + padding;

    final gridPaint = Paint()
      ..color = Colors.grey.withValues(alpha: 0.2)
      ..strokeWidth = 1;

    final linePaint = Paint()
      ..color = lineColor
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final dotPaint = Paint()
      ..color = lineColor
      ..style = PaintingStyle.fill;

    // Draw horizontal grid lines.
    for (int i = 0; i <= 4; i++) {
      final y = topPadding + (chartHeight * i / 4);

      canvas.drawLine(
        Offset(leftPadding, y),
        Offset(size.width - rightPadding, y),
        gridPaint,
      );
    }

    final path = Path();
    final points = <Offset>[];

    for (int i = 0; i < values.length; i++) {
      final x = values.length == 1
          ? leftPadding + chartWidth / 2
          : leftPadding + chartWidth * i / (values.length - 1);

      final normalized = (values[i] - chartMin) /
          (chartMax - chartMin);

      final y = topPadding + chartHeight * (1 - normalized);

      final point = Offset(x, y);
      points.add(point);

      if (i == 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }

    if (points.length > 1) {
      canvas.drawPath(path, linePaint);
    }

    for (final point in points) {
      canvas.drawCircle(point, 5, dotPaint);
      canvas.drawCircle(
        point,
        2,
        Paint()..color = Colors.white,
      );
    }

    _drawLabel(
      canvas,
      chartMax.toStringAsFixed(1),
      Offset(0, topPadding - 7),
    );

    _drawLabel(
      canvas,
      chartMin.toStringAsFixed(1),
      Offset(0, topPadding + chartHeight - 7),
    );
  }

  void _drawLabel(Canvas canvas, String text, Offset position) {
    final textPainter = TextPainter(
      text: TextSpan(
        text: text,
        style: const TextStyle(
          color: Colors.grey,
          fontSize: 10,
        ),
      ),
      textDirection: TextDirection.ltr,
    );

    textPainter.layout();
    textPainter.paint(canvas, position);
  }

  @override
  bool shouldRepaint(covariant SensorChartPainter oldDelegate) {
    return oldDelegate.values != values ||
        oldDelegate.lineColor != lineColor;
  }
}
