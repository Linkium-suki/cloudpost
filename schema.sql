-- 邮寄请求主表
CREATE TABLE requests (
    id TEXT PRIMARY KEY, -- UUID
    type TEXT NOT NULL CHECK (type IN ('letter', 'postcard')), -- 请求类型：信件或明信片
    content TEXT, -- 信件内容或明信片描述
    image_key TEXT, -- 明信片图片在R2中的key
    sender_name TEXT,
    sender_address TEXT,
    sender_city TEXT,
    sender_state TEXT,
    sender_zip TEXT,
    sender_country TEXT DEFAULT 'CN',
    recipient_name TEXT,
    recipient_address TEXT,
    recipient_city TEXT,
    recipient_state TEXT,
    recipient_zip TEXT,
    recipient_country TEXT DEFAULT 'CN',
    value_added_services TEXT, -- JSON格式存储选择的增值服务
    total_amount REAL NOT NULL DEFAULT 0.00, -- 总金额
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')), -- 状态
    payment_qr_code_key TEXT, -- 支付二维码在R2中的key
    request_id TEXT UNIQUE, -- 支付时使用的请求ID
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 授权码表
CREATE TABLE authorization_codes (
    id TEXT PRIMARY KEY, -- UUID
    code TEXT UNIQUE NOT NULL, -- 授权码
    is_used BOOLEAN NOT NULL DEFAULT FALSE, -- 是否已使用
    used_at DATETIME, -- 使用时间
    expires_at DATETIME, -- 过期时间
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 游客使用记录表
CREATE TABLE guest_usage (
    id TEXT PRIMARY KEY, -- UUID
    ip_address TEXT NOT NULL, -- IP地址
    user_agent TEXT, -- 用户代理
    usage_count INTEGER NOT NULL DEFAULT 1, -- 使用次数
    last_used_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- 最后使用时间
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 增值服务表
CREATE TABLE value_added_services (
    id TEXT PRIMARY KEY, -- UUID
    name TEXT NOT NULL, -- 服务名称
    name_en TEXT, -- 英文服务名称
    description TEXT, -- 描述
    description_en TEXT, -- 英文描述
    price REAL NOT NULL DEFAULT 0.00, -- 价格
    is_active BOOLEAN NOT NULL DEFAULT TRUE, -- 是否启用
    sort_order INTEGER DEFAULT 0, -- 排序
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 应用设置表
CREATE TABLE app_settings (
    id TEXT PRIMARY KEY, -- UUID
    key TEXT UNIQUE NOT NULL, -- 设置键名
    value TEXT, -- 设置值
    description TEXT, -- 描述
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_request_id ON requests(request_id);
CREATE INDEX idx_guest_usage_ip ON guest_usage(ip_address);
CREATE INDEX idx_value_added_services_active ON value_added_services(is_active);
CREATE INDEX idx_app_settings_key ON app_settings(key);