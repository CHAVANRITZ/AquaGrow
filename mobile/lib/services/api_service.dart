
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class ApiService {
  static final String _baseUrl = ApiConfig.baseUrl;
  static final String _deviceId = ApiConfig.deviceId;

  // GET: Fetch dashboard data
  static Future<Map<String, dynamic>> getDashboard() async {
    final url = Uri.parse('$_baseUrl/dashboard/$_deviceId');

    final response = await http
        .get(url)
        .timeout(ApiConfig.timeout);

    return _handleResponse(response);
  }

  // POST: Switch pump ON or OFF
  static Future<Map<String, dynamic>> controlPump(
    String action,
  ) async {
    final url = Uri.parse('$_baseUrl/devices/$_deviceId/pump');

    final response = await http
        .post(
          url,
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonEncode({
            'action': action,
            'mode': 'MANUAL',
            'reason': 'Manual control from AquaGrow mobile app',
          }),
        )
        .timeout(ApiConfig.timeout);

    return _handleResponse(response);
  }

  // PUT: Change Automatic or Manual mode
  static Future<Map<String, dynamic>> updateMode(
    bool autoMode,
  ) async {
    final url = Uri.parse(
      '$_baseUrl/devices/$_deviceId/settings',
    );

    final response = await http
        .put(
          url,
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonEncode({
            'autoMode': autoMode,
          }),
        )
        .timeout(ApiConfig.timeout);

    return _handleResponse(response);
  }

  // PUT: Update irrigation settings
  static Future<Map<String, dynamic>> updateSettings({
    required int soilMoistureThreshold,
    required int pumpDurationSeconds,
    required int wateringIntervalMinutes,
  }) async {
    final url = Uri.parse(
      '$_baseUrl/devices/$_deviceId/settings',
    );

    final response = await http
        .put(
          url,
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonEncode({
            'soilMoistureThreshold': soilMoistureThreshold,
            'pumpDurationSeconds': pumpDurationSeconds,
            'wateringIntervalMinutes': wateringIntervalMinutes,
          }),
        )
        .timeout(ApiConfig.timeout);

    return _handleResponse(response);
  }
  // GET: Fetch historical sensor readings
  static Future<List<Map<String, dynamic>>> getReadings() async {
    final url = Uri.parse(
      '$_baseUrl/devices/$_deviceId/readings',
    );

    final response = await http
        .get(url)
        .timeout(ApiConfig.timeout);

    final Map<String, dynamic> result =
        jsonDecode(response.body) as Map<String, dynamic>;

    if (response.statusCode >= 200 &&
        response.statusCode < 300 &&
        result['success'] == true) {
      final data = result['data'];

      if (data is List) {
        return data
            .map((item) => Map<String, dynamic>.from(item as Map))
            .toList();
      }

      return [];
    }

    throw Exception(
      result['message'] ?? 'Failed to fetch sensor history',
    );
  }

  // GET: Fetch pump activity history
  static Future<List<Map<String, dynamic>>> getPumpHistory() async {
    final url = Uri.parse(
      '$_baseUrl/devices/$_deviceId/pump/history',
    );

    final response = await http
        .get(url)
        .timeout(ApiConfig.timeout);

    final Map<String, dynamic> result =
        jsonDecode(response.body) as Map<String, dynamic>;

    if (response.statusCode >= 200 &&
        response.statusCode < 300 &&
        result['success'] == true) {
      final data = result['data'];

      if (data is List) {
        return data
            .map((item) => Map<String, dynamic>.from(item as Map))
            .toList();
      }

      return [];
    }

    throw Exception(
      result['message'] ?? 'Failed to fetch pump history',
    );
  }

  // Handle API responses
  static Map<String, dynamic> _handleResponse(
    http.Response response,
  ) {
    final Map<String, dynamic> result =
        jsonDecode(response.body) as Map<String, dynamic>;

    if (response.statusCode >= 200 &&
        response.statusCode < 300 &&
        result['success'] == true) {
      return Map<String, dynamic>.from(
        result['data'] as Map,
      );
    }

    throw Exception(
      result['message'] ?? 'API request failed',
    );
  }
}
