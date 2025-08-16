// 数据模型定义

export type RequestType = 'letter' | 'postcard'

export type RequestStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export type ValueAddedService = {
  id: string
  name: string
  name_en?: string
  description?: string
  description_en?: string
  price: number
  is_active: boolean
  sort_order?: number
  created_at?: string
  updated_at?: string
}

export type MailRequest = {
  id: string
  type: RequestType
  content?: string
  image_key?: string
  sender_name?: string
  sender_address?: string
  sender_city?: string
  sender_state?: string
  sender_zip?: string
  sender_country?: string
  recipient_name?: string
  recipient_address?: string
  recipient_city?: string
  recipient_state?: string
  recipient_zip?: string
  recipient_country?: string
  value_added_services?: string // JSON格式存储选择的增值服务
  total_amount: number
  status: RequestStatus
  payment_qr_code_key?: string
  request_id?: string
  created_at?: string
  updated_at?: string
}

export type AuthorizationCode = {
  id: string
  code: string
  is_used: boolean
  used_at?: string
  expires_at?: string
  created_at?: string
}

export type GuestUsage = {
  id: string
  ip_address: string
  user_agent?: string
  usage_count: number
  last_used_at?: string
  created_at?: string
}

export type AppSetting = {
  id: string
  key: string
  value?: string
  description?: string
  created_at?: string
  updated_at?: string
}