import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ApiService extends ChangeNotifier {
  static final String _baseUrl = dotenv.env['ADMIN_API_BASE_URL'] ?? '';
  static final String _token = dotenv.env['ADMIN_API_TOKEN'] ?? '';

  Future<Map<String, dynamic>> _get(String endpoint) async {
    final url = '$_baseUrl$endpoint';
    try {
      final response = await http.get(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer $_token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to load data: ${response.statusCode}');
      }
    } catch (error) {
      throw Exception('Failed to connect to API: $error');
    }
  }

  Future<Map<String, dynamic>> _put(String endpoint, dynamic data) async {
    final url = '$_baseUrl$endpoint';
    try {
      final response = await http.put(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer $_token',
          'Content-Type': 'application/json',
        },
        body: json.encode(data),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to update data: ${response.statusCode}');
      }
    } catch (error) {
      throw Exception('Failed to connect to API: $error');
    }
  }

  Future<Map<String, dynamic>> _post(String endpoint, dynamic data) async {
    final url = '$_baseUrl$endpoint';
    try {
      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer $_token',
          'Content-Type': 'application/json',
        },
        body: json.encode(data),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to create data: ${response.statusCode}');
      }
    } catch (error) {
      throw Exception('Failed to connect to API: $error');
    }
  }

  // 获取仪表盘数据
  Future<Map<String, dynamic>> getDashboardData() async {
    return await _get('/dashboard');
  }

  // 获取邮寄请求列表
  Future<Map<String, dynamic>> getRequests({
    int page = 1,
    int limit = 10,
    String? status,
    String? search,
  }) async {
    var endpoint = '/requests?page=$page&limit=$limit';
    if (status != null) endpoint += '&status=$status';
    if (search != null) endpoint += '&search=$search';
    
    return await _get(endpoint);
  }

  // 更新请求状态
  Future<Map<String, dynamic>> updateRequestStatus(String id, String status) async {
    return await _put('/requests/$id', {'status': status});
  }

  // 获取增值服务列表
  Future<List<dynamic>> getServices() async {
    final result = await _get('/services');
    return result is List ? result : [];
  }

  // 创建增值服务
  Future<Map<String, dynamic>> createService(Map<String, dynamic> service) async {
    return await _post('/services', service);
  }

  // 更新增值服务
  Future<Map<String, dynamic>> updateService(String id, Map<String, dynamic> service) async {
    return await _put('/services/$id', service);
  }
}