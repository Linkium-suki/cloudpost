# CloudPost AI - AI增强型实体信件邮寄服务平台

CloudPost AI 是一个在线平台，让用户可以通过AI辅助，轻松创作并邮寄实体信件或明信片。整个平台设计为可以完全在**Cloudflare的免费服务套餐**内高效、稳定地运行。

## 核心功能

### 用户端平台 (一体化Web应用)

- **不分离架构**: 使用Next.js App Router构建，将服务端逻辑通过Server Actions与前端UI组件紧密集成
- **响应式设计**: 在桌面和移动设备上都有良好的浏览和操作体验
- **创作向导**: 分步式流程引导用户完成信件/明信片创作
- **AI服务集成**: 
  - 文本生成: 智谱 AI GLM-4.5-flash (流式响应)
  - 图像生成: 阿里云通义万相 v2.2 (异步任务)
- **访问与限制**: 
  - 游客使用次数限制
  - Cloudflare Turnstile人机验证
  - 授权码系统解锁高级功能
- **用户体验增强**: 草稿自动保存到localStorage

### 管理后台 (为Flutter应用提供API)

提供一套受保护的、无状态的RESTful API，用于管理平台内容。

## 技术栈

- **前端**: Next.js 14 (App Router) + React Server Components
- **后端**: Next.js API Routes + Server Actions
- **数据库**: Cloudflare D1 (SQLite)
- **存储**: Cloudflare R2 (对象存储)
- **认证**: Cloudflare Access + Bearer Token
- **AI服务**: 
  - 智谱 AI GLM-4.5-flash (文本生成)
  - 阿里云通义万相 v2.2 (图像生成)
- **部署**: Cloudflare Pages

## 项目结构

```
.
├── app/                  # Next.js App Router 应用
├── components/           # React 组件
├── lib/                  # 核心库和工具函数
├── public/               # 静态资源
├── client-flutter/       # Flutter 管理端应用
├── docs/                 # 文档
├── .github/workflows/    # CI/CD 配置
└── ...
```

## 数据模型

- `requests` - 邮寄请求主表
- `authorization_codes` - 授权码表
- `guest_usage` - 游客使用记录表
- `value_added_services` - 增值服务表
- `app_settings` - 应用设置表

## 开发与部署

详细部署说明请参阅 [部署指南](docs/deployment.md)。

## 环境变量

详细环境变量配置请参阅 [.env.example](.env.example)。