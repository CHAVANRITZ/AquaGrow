
import 'package:flutter/material.dart';
import '../services/api_service.dart';

class PumpHistoryScreen extends StatefulWidget {
  const PumpHistoryScreen({super.key});

  @override
  State<PumpHistoryScreen> createState() => _PumpHistoryScreenState();
}

class _PumpHistoryScreenState extends State<PumpHistoryScreen> {
  List<Map<String, dynamic>> history = [];
  bool isLoading = true;
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    fetchPumpHistory();
  }

  Future<void> fetchPumpHistory() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    try {
      final result = await ApiService.getPumpHistory();

      if (!mounted) return;

      setState(() {
        history = result;
        isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        errorMessage = e.toString();
        isLoading = false;
      });
    }
  }

  String formatDate(dynamic value) {
    if (value == null) return 'Unknown date';

    final date = DateTime.tryParse(value.toString());

    if (date == null) return 'Unknown date';

    final localDate = date.toLocal();

    final day = localDate.day.toString().padLeft(2, '0');
    final month = localDate.month.toString().padLeft(2, '0');
    final year = localDate.year;

    final hour = localDate.hour % 12 == 0
        ? 12
        : localDate.hour % 12;

    final minute = localDate.minute.toString().padLeft(2, '0');
    final period = localDate.hour >= 12 ? 'PM' : 'AM';

    return '$day/$month/$year • $hour:$minute $period';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Pump Activity History',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: const Color(0xFF1B5E20),
        foregroundColor: Colors.white,
      ),
      body: RefreshIndicator(
        onRefresh: fetchPumpHistory,
        child: _buildBody(),
      ),
    );
  }

  Widget _buildBody() {
    if (isLoading && history.isEmpty) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    if (errorMessage != null && history.isEmpty) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: [
          const SizedBox(height: 150),
          const Icon(
            Icons.error_outline,
            size: 55,
            color: Colors.red,
          ),
          const SizedBox(height: 12),
          Center(
            child: Text(
              errorMessage!,
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: 15),
          Center(
            child: ElevatedButton(
              onPressed: fetchPumpHistory,
              child: const Text('Retry'),
            ),
          ),
        ],
      );
    }

    if (history.isEmpty) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: const [
          SizedBox(height: 150),
          Icon(
            Icons.history,
            size: 60,
            color: Colors.grey,
          ),
          SizedBox(height: 12),
          Center(
            child: Text('No pump activity recorded yet'),
          ),
        ],
      );
    }

    return ListView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: const Color(0xFFE8F5E9),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Row(
            children: [
              const Icon(
                Icons.history,
                size: 35,
                color: Color(0xFF1B5E20),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Total Pump Activities',
                      style: TextStyle(color: Colors.black54),
                    ),
                    Text(
                      '${history.length}',
                      style: const TextStyle(
                        fontSize: 25,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1B5E20),
                      ),
                    ),
                  ],
                ),
              ),
              IconButton(
                onPressed: fetchPumpHistory,
                icon: const Icon(Icons.refresh),
                color: const Color(0xFF1B5E20),
                tooltip: 'Refresh history',
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),
        const Text(
          'Recent Activities',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        ...history.map((item) {
          final action =
              item['action']?.toString().toUpperCase() ?? 'UNKNOWN';

          final isOn = action == 'ON';

          final mode =
              item['mode']?.toString().toUpperCase() ?? 'UNKNOWN';

          final reason =
              item['reason']?.toString() ?? 'No reason provided';

          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            elevation: 1,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CircleAvatar(
                    radius: 23,
                    backgroundColor: isOn
                        ? Colors.green.withValues(alpha: 0.12)
                        : Colors.red.withValues(alpha: 0.12),
                    child: Icon(
                      isOn ? Icons.power : Icons.power_off,
                      color: isOn ? Colors.green : Colors.red,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              'Pump $action',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: isOn ? Colors.green : Colors.red,
                              ),
                            ),
                            const Spacer(),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 9,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: const Color(0xFFE8F5E9),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                mode,
                                style: const TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF1B5E20),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 7),
                        Text(
                          formatDate(item['createdAt']),
                          style: const TextStyle(
                            fontSize: 12,
                            color: Colors.black54,
                          ),
                        ),
                        const SizedBox(height: 7),
                        Text(
                          reason,
                          style: const TextStyle(fontSize: 13),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }
}
