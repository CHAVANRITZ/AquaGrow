import 'dart:async';

import 'package:flutter/material.dart';

import '../services/api_service.dart';
import 'sensor_history_screen.dart';
import 'pump_history_screen.dart';
class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  Map<String, dynamic>? dashboard;

  bool isLoading = true;
  bool isUpdating = false;

  String? errorMessage;
  Timer? refreshTimer;

@override
void initState() {
  super.initState();

  fetchDashboard();

  // Automatically refresh dashboard every 30 seconds.
  refreshTimer = Timer.periodic(
    const Duration(seconds: 30),
    (timer) {
      if (mounted && !isUpdating) {
        fetchDashboard();
      }
    },
  );
}
@override
void dispose() {
  refreshTimer?.cancel();
  super.dispose();
}
  // Fetch dashboard data from backend
  Future<void> fetchDashboard() async {
    try {
      final result = await ApiService.getDashboard();

      if (!mounted) return;

      setState(() {
        dashboard = result;
        errorMessage = null;
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

  // Refresh dashboard
  Future<void> refreshDashboard() async {
    await fetchDashboard();
  }

  // Convert API values safely to double
  double getNumber(dynamic value) {
    if (value is num) {
      return value.toDouble();
    }

    return 0;
  }

  // Show notification
  void showMessage(String message, {bool isError = false}) {
    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? Colors.red : Colors.green,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  // Control pump manually
  Future<void> controlPump(String action) async {
    if (isUpdating) return;

    setState(() {
      isUpdating = true;
    });

    try {
      await ApiService.controlPump(action);

      await fetchDashboard();

      if (!mounted) return;

      if (errorMessage == null) {
        showMessage('Pump switched $action successfully');
      } else {
        showMessage(
          'Pump command sent, but dashboard refresh failed.',
          isError: true,
        );
      }
    } catch (error) {
      showMessage(
        'Pump control failed: $error',
        isError: true,
      );
    } finally {
      if (mounted) {
        setState(() {
          isUpdating = false;
        });
      }
    }
  }

  // Change automatic/manual mode
  Future<void> updatePumpMode(bool autoMode) async {
    if (isUpdating) return;

    setState(() {
      isUpdating = true;
    });

    try {
      await ApiService.updateMode(autoMode);

      await fetchDashboard();

      if (!mounted) return;

      if (errorMessage == null) {
        showMessage(
          autoMode
              ? 'Automatic mode enabled'
              : 'Manual mode enabled',
        );
      } else {
        showMessage(
          'Mode updated, but dashboard refresh failed.',
          isError: true,
        );
      }
    } catch (error) {
      showMessage(
        'Mode update failed: $error',
        isError: true,
      );
    } finally {
      if (mounted) {
        setState(() {
          isUpdating = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final device =
        dashboard?['device'] as Map<String, dynamic>? ?? {};

    final reading =
        dashboard?['latestReading'] as Map<String, dynamic>? ?? {};

    final settings =
        dashboard?['settings'] as Map<String, dynamic>? ?? {};

    final soil = getNumber(reading['soilMoisture']);
    final temperature = getNumber(reading['temperature']);
    final humidity = getNumber(reading['humidity']);
    final waterLevel = getNumber(reading['waterLevel']);

    final pumpStatus = dashboard?['pumpStatus'] ?? 'OFF';
    final autoMode = settings['autoMode'] == true;

    return Scaffold(
      backgroundColor: const Color(0xFFF5F8F4),

      appBar: AppBar(
        backgroundColor: const Color(0xFF1B5E20),
        foregroundColor: Colors.white,
        elevation: 0,

        title: const Row(
          children: [
            Icon(Icons.eco, size: 27),
            SizedBox(width: 10),
            Text(
              'AquaGrow',
              style: TextStyle(
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),

        actions: [
          IconButton(
            onPressed: isUpdating ? null : fetchDashboard,
            icon: const Icon(Icons.refresh),
            tooltip: 'Refresh dashboard',
          ),
        ],
      ),

      body: RefreshIndicator(
        onRefresh: refreshDashboard,

        child: isLoading
            ? ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                children: const [
                  SizedBox(height: 250),
                  Center(
                    child: CircularProgressIndicator(),
                  ),
                  SizedBox(height: 15),
                  Center(
                    child: Text('Loading AquaGrow data...'),
                  ),
                ],
              )

            : errorMessage != null
                ? ListView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.all(24),
                    children: [
                      const SizedBox(height: 130),

                      const Icon(
                        Icons.cloud_off,
                        size: 65,
                        color: Colors.redAccent,
                      ),

                      const SizedBox(height: 15),

                      const Text(
                        'Unable to load dashboard',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 19,
                          fontWeight: FontWeight.bold,
                        ),
                      ),

                      const SizedBox(height: 10),

                      Text(
                        errorMessage!,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: Colors.grey,
                        ),
                      ),

                      const SizedBox(height: 20),

                      Center(
                        child: ElevatedButton.icon(
                          onPressed: fetchDashboard,
                          icon: const Icon(Icons.refresh),
                          label: const Text('Try Again'),
                        ),
                      ),
                    ],
                  )

                : ListView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.all(16),

                    children: [
                      // Device information
                      _buildWelcomeCard(device),

                      const SizedBox(height: 20),

                      // Sensor heading
                      const Text(
                        'Sensor Overview',
                        style: TextStyle(
                          fontSize: 19,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF26332A),
                        ),
                      ),

                      const SizedBox(height: 12),

                      // Sensor cards
                      LayoutBuilder(
                        builder: (context, constraints) {
                          final cardWidth =
                              (constraints.maxWidth - 12) / 2;

                          return Wrap(
                            spacing: 12,
                            runSpacing: 12,

                            children: [
                              SizedBox(
                                width: cardWidth,
                                child: _sensorCard(
                                  'Soil Moisture',
                                  soil,
                                  '%',
                                  Icons.grass,
                                  const Color(0xFF2E7D32),
                                ),
                              ),

                              SizedBox(
                                width: cardWidth,
                                child: _sensorCard(
                                  'Temperature',
                                  temperature,
                                  '°C',
                                  Icons.thermostat,
                                  const Color(0xFFEF6C00),
                                ),
                              ),

                              SizedBox(
                                width: cardWidth,
                                child: _sensorCard(
                                  'Humidity',
                                  humidity,
                                  '%',
                                  Icons.water_drop,
                                  const Color(0xFF0288D1),
                                ),
                              ),

                              SizedBox(
                                width: cardWidth,
                                child: _sensorCard(
                                  'Water Level',
                                  waterLevel,
                                  '%',
                                  Icons.opacity,
                                  const Color(0xFF00838F),
                                ),
                              ),
                            ],
                          );
                        },
                      ),

                     const SizedBox(height: 16),


                      // Sensor History button
                      SizedBox(
                        width: double.infinity,
                        child: OutlinedButton.icon(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) =>
                                    const SensorHistoryScreen(),
                              ),
                            );
                          },
                          icon: const Icon(Icons.show_chart),
                          label: const Text('View Sensor History'),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: const Color(0xFF1B5E20),
                            side: const BorderSide(
                              color: Color(0xFF1B5E20),
                            ),
                            padding: const EdgeInsets.symmetric(
                              vertical: 14,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(height: 12),

                      // Pump History button
                      SizedBox(
                        width: double.infinity,
                        child: OutlinedButton.icon(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) =>
                                    const PumpHistoryScreen(),
                              ),
                            );
                          },
                          icon: const Icon(Icons.history),
                          label: const Text('View Pump History'),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: const Color(0xFF1B5E20),
                            side: const BorderSide(
                              color: Color(0xFF1B5E20),
                            ),
                            padding: const EdgeInsets.symmetric(
                              vertical: 14,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Irrigation heading
                      const Text(
                        'Irrigation Status',
                        style: TextStyle(
                          fontSize: 19,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF26332A),
                        ),
                      ),

                      const SizedBox(height: 12),

                      // Pump controls
                      _buildPumpCard(
                        pumpStatus.toString(),
                        autoMode,
                      ),

                      const SizedBox(height: 20),

                      // Irrigation settings
                      _buildSettingsCard(settings),

                      const SizedBox(height: 20),

                      const Center(
                        child: Text(
                          'AquaGrow IoT • Smart Irrigation System',
                          style: TextStyle(
                            color: Colors.grey,
                            fontSize: 12,
                          ),
                        ),
                      ),

                      const SizedBox(height: 15),
                    ],
                  ),
      ),
    );
  }

  // Device welcome card
  Widget _buildWelcomeCard(Map<String, dynamic> device) {
    final name = device['name'] ?? 'AquaGrow Device';
    final deviceId = device['deviceId'] ?? 'Unknown';
    final location = device['location'] ?? 'Unknown location';

    final isOnline = device['status'] == 'online';

    return Container(
      padding: const EdgeInsets.all(20),

      decoration: BoxDecoration(
        color: const Color(0xFF1B5E20),
        borderRadius: BorderRadius.circular(18),
      ),

      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,

        children: [
          const Text(
            'Welcome to',
            style: TextStyle(
              color: Colors.white70,
              fontSize: 14,
            ),
          ),

          const SizedBox(height: 4),

          Text(
            name.toString(),
            style: const TextStyle(
              color: Colors.white,
              fontSize: 23,
              fontWeight: FontWeight.bold,
            ),
          ),

          const SizedBox(height: 8),

          Text(
            '$deviceId • $location',
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 12,
            ),
          ),

          const SizedBox(height: 16),

          Row(
            children: [
              Icon(
                Icons.circle,
                size: 11,
                color: isOnline
                    ? Colors.lightGreenAccent
                    : Colors.redAccent,
              ),

              const SizedBox(width: 7),

              Text(
                isOnline ? 'Device Online' : 'Device Offline',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // Sensor card
  Widget _sensorCard(
    String title,
    double value,
    String unit,
    IconData icon,
    Color color,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),

        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),

      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,

        children: [
          CircleAvatar(
            radius: 20,
            backgroundColor: color.withValues(alpha: 0.12),
            child: Icon(
              icon,
              color: color,
              size: 22,
            ),
          ),

          const SizedBox(height: 15),

          Text(
            '$value$unit',
            style: const TextStyle(
              fontSize: 25,
              fontWeight: FontWeight.bold,
              color: Color(0xFF26332A),
            ),
          ),

          const SizedBox(height: 4),

          Text(
            title,
            style: const TextStyle(
              color: Colors.grey,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }

  // Pump status and control card
  Widget _buildPumpCard(String status, bool autoMode) {
    final isOn = status == 'ON';

    return Container(
      padding: const EdgeInsets.all(18),

      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),

        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),

      child: Column(
        children: [
          // Current pump status
          Row(
            children: [
              CircleAvatar(
                radius: 27,

                backgroundColor: isOn
                    ? Colors.green.withValues(alpha: 0.12)
                    : Colors.grey.withValues(alpha: 0.12),

                child: Icon(
                  Icons.water,
                  color: isOn ? Colors.green : Colors.grey,
                  size: 28,
                ),
              ),

              const SizedBox(width: 14),

              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,

                  children: [
                    const Text(
                      'Water Pump',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),

                    const SizedBox(height: 5),

                    Text(
                      isOn
                          ? 'Currently Running'
                          : 'Currently Stopped',
                      style: const TextStyle(
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ),
              ),

              Text(
                status,
                style: TextStyle(
                  color: isOn ? Colors.green : Colors.grey,
                  fontWeight: FontWeight.bold,
                  fontSize: 17,
                ),
              ),
            ],
          ),

          const Divider(height: 28),

          // Automatic / Manual mode
          Row(
            children: [
              const Expanded(
                child: Text(
                  'Automatic Mode',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),

              Switch(
                value: autoMode,
                activeThumbColor: const Color(0xFF1B5E20),
                onChanged: isUpdating
                    ? null
                    : updatePumpMode,
              ),
            ],
          ),

          const SizedBox(height: 8),

          // Manual pump controls
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: isUpdating || autoMode
                      ? null
                      : () => controlPump('ON'),

                  icon: const Icon(Icons.play_arrow),
                  label: const Text('Pump ON'),

                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    foregroundColor: Colors.white,
                  ),
                ),
              ),

              const SizedBox(width: 12),

              Expanded(
                child: ElevatedButton.icon(
                  onPressed: isUpdating || autoMode
                      ? null
                      : () => controlPump('OFF'),

                  icon: const Icon(Icons.stop),
                  label: const Text('Pump OFF'),

                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    foregroundColor: Colors.white,
                  ),
                ),
              ),
            ],
          ),

          // Automatic mode information
          if (autoMode)
            const Padding(
              padding: EdgeInsets.only(top: 10),

              child: Text(
                'Switch to Manual mode to control the pump.',
                textAlign: TextAlign.center,

                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 12,
                ),
              ),
            ),

          // Loading indicator during API requests
          if (isUpdating)
            const Padding(
              padding: EdgeInsets.only(top: 12),

              child: CircularProgressIndicator(),
            ),
        ],
      ),
    );
  }

  // Irrigation settings card

  Widget _buildSettingsCard(Map<String, dynamic> settings) {
    final threshold = settings['soilMoistureThreshold'] ?? '--';
    final duration = settings['pumpDurationSeconds'] ?? '--';
    final interval = settings['wateringIntervalMinutes'] ?? '--';

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Expanded(
                child: Text(
                  'Irrigation Settings',
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              TextButton.icon(
                onPressed: isUpdating
                    ? null
                    : () => showSettingsDialog(settings),
                icon: const Icon(Icons.edit, size: 18),
                label: const Text('Edit'),
              ),
            ],
          ),
          const SizedBox(height: 10),
          _settingRow('Moisture Threshold', '$threshold%'),
          _settingRow('Pump Duration', '$duration seconds'),
          _settingRow('Watering Interval', '$interval minutes'),
        ],
      ),
    );
  }


  // Individual settings row
  Widget _settingRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 7),

      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,

        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.grey,
            ),
          ),

          Text(
            value,
            style: const TextStyle(
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Future<void> saveIrrigationSettings({
    required int threshold,
    required int duration,
    required int interval,
  }) async {
    if (isUpdating) return;

    setState(() {
      isUpdating = true;
    });

    try {
      await ApiService.updateSettings(
        soilMoistureThreshold: threshold,
        pumpDurationSeconds: duration,
        wateringIntervalMinutes: interval,
      );

      await fetchDashboard();

      if (!mounted) return;

      if (errorMessage == null) {
        showMessage('Irrigation settings saved successfully');
      } else {
        showMessage(
          'Settings saved, but dashboard refresh failed.',
          isError: true,
        );
      }
    } catch (error) {
      showMessage(
        'Failed to save settings: $error',
        isError: true,
      );
    } finally {
      if (mounted) {
        setState(() {
          isUpdating = false;
        });
      }
    }
  }

  Future<void> showSettingsDialog(Map<String, dynamic> settings) async {
    int threshold =
        (settings['soilMoistureThreshold'] as num?)?.toInt() ?? 40;

    int duration =
        (settings['pumpDurationSeconds'] as num?)?.toInt() ?? 20;

    int interval =
        (settings['wateringIntervalMinutes'] as num?)?.toInt() ?? 15;

    await showDialog(
      context: context,
      builder: (dialogContext) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              title: const Text('Irrigation Settings'),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Soil Moisture Threshold: $threshold%'),
                    Slider(
                      value: threshold.toDouble(),
                      min: 10,
                      max: 90,
                      divisions: 80,
                      label: '$threshold%',
                      onChanged: (value) {
                        setDialogState(() {
                          threshold = value.round();
                        });
                      },
                    ),
                    const SizedBox(height: 12),

                    Text('Pump Duration: $duration seconds'),
                    Slider(
                      value: duration.toDouble(),
                      min: 5,
                      max: 120,
                      divisions: 23,
                      label: '$duration seconds',
                      onChanged: (value) {
                        setDialogState(() {
                          duration = value.round();
                        });
                      },
                    ),
                    const SizedBox(height: 12),

                    Text('Watering Interval: $interval minutes'),
                    Slider(
                      value: interval.toDouble(),
                      min: 5,
                      max: 180,
                      divisions: 35,
                      label: '$interval minutes',
                      onChanged: (value) {
                        setDialogState(() {
                          interval = value.round();
                        });
                      },
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(dialogContext),
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: () {
                    Navigator.pop(dialogContext);

                    saveIrrigationSettings(
                      threshold: threshold,
                      duration: duration,
                      interval: interval,
                    );
                  },
                  child: const Text('Save Settings'),
                ),
              ],
            );
          },
        );
      },
    );
  }


}
