# CloudPost AI Flutter 管理端

这是 CloudPost AI 平台的 Flutter 管理端应用，用于管理平台内容和用户请求。

## 功能特性

- 仪表盘统计信息查看
- 邮寄请求管理（查看、状态更新）
- 增值服务管理（创建、编辑、启用/禁用）
- 支付二维码管理

## 开发环境设置

### 前置要求

1. Flutter SDK (3.0 或更高版本)
2. Dart SDK
3. 支持Flutter的IDE (如 Android Studio, VS Code)

### 安装依赖

```bash
flutter pub get
```

### 配置环境

1. 复制 [.env.example](.env.example) 到 [.env](.env)
2. 在 [.env](.env) 文件中设置管理API的URL和认证Token

### 运行应用

```bash
flutter run
```

## 项目结构

```
lib/
├── models/          # 数据模型
├── services/        # API服务
├── screens/         # 页面组件
├── widgets/         # 通用组件
├── utils/           # 工具类
└── main.dart        # 应用入口
```

## API 认证

管理API通过Bearer Token进行保护。确保在 [.env](.env) 文件中正确设置了 `ADMIN_API_TOKEN`。

## 构建发布版本

### Android

```bash
flutter build apk
```

### iOS

```bash
flutter build ios
```

## 贡献

请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何为该项目做出贡献。