# 部署指南

本文档将指导您如何在 Cloudflare 生态系统中部署 CloudPost AI 应用。

## 前置要求

1. Cloudflare 账户（免费套餐即可）
2. 已安装 Node.js (推荐 v18 或更高版本)
3. 已安装 Wrangler CLI: `npm install -g wrangler`

## 部署步骤

### 1. 创建 Cloudflare 资源

#### D1 数据库
```bash
# 创建新的 D1 数据库
wrangler d1 create cloudpost-ai-db

# 记录返回的 database_id 和 database_name，稍后会用到
```

#### R2 存储桶
```bash
# 创建 R2 存储桶
wrangler r2 bucket create cloudpost-ai-storage
```

#### 设置环境变量
在 Cloudflare Dashboard 中，进入您的 Pages 项目，设置以下环境变量：
- `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY`
- `CLOUDFLARE_TURNSTILE_SECRET_KEY`
- `ZHIPUAI_API_KEY`
- `ALIYUN_ACCESS_KEY_ID`
- `ALIYUN_ACCESS_KEY_SECRET`
- `ALIYUN_DASHSCOPE_API_KEY`
- `ADMIN_API_TOKEN`

### 2. 初始化数据库

使用 [schema.sql](../schema.sql) 文件初始化数据库表结构：

```bash
# 将 schema.sql 内容复制到 D1 数据库
wrangler d1 execute cloudpost-ai-db --file=schema.sql
```

### 3. 部署到 Cloudflare Pages

#### 方法一：通过 GitHub Actions (推荐)

1. 将代码推送到 GitHub 仓库
2. 在 Cloudflare Pages 中创建新项目，连接到您的 GitHub 仓库
3. 设置以下构建配置：
   - 构建命令: `next build`
   - 构建输出目录: `.next`
   - 根目录: `/`
4. 添加环境变量（见上文）
5. 在"函数"部分绑定：
   - D1 数据库：名称为 `DB`，选择您创建的数据库
   - R2 存储桶：名称为 `R2_BUCKET`，选择您创建的存储桶
6. 点击"保存并部署"

#### 方法二：手动部署

```bash
# 安装依赖
npm install

# 构建应用
npm run build

# 部署到 Pages
wrangler pages deploy dist/ --project-name=cloudpost-ai
```

### 4. 配置自定义域（可选）

在 Cloudflare Dashboard 中为您的 Pages 项目配置自定义域。

### 5. 配置 Turnstile

1. 在 Cloudflare Dashboard 中，转到 Turnstile
2. 创建新的站点，选择"非托管"模式
3. 复制 Site Key 和 Secret Key
4. 将它们分别设置为环境变量 `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` 和 `CLOUDFLARE_TURNSTILE_SECRET_KEY`

## 管理API访问

管理API通过Bearer Token进行保护。在请求头中添加：

```
Authorization: Bearer YOUR_ADMIN_API_TOKEN
```

## 故障排除

### 构建失败
- 确保所有环境变量都已正确设置
- 检查 `next.config.js` 配置是否正确

### 数据库连接问题
- 确保 D1 数据库已正确绑定到 Pages 项目
- 检查数据库名称和ID是否正确

### AI服务不工作
- 验证AI服务的API密钥是否正确配置
- 检查网络连接和API服务状态