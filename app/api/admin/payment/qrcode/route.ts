import { NextRequest } from 'next/server'
import { getDB } from '@/lib/db'
import { Env } from '@/lib/db'

// 上传并更新平台使用的支付二维码图片
export async function POST(request: NextRequest, { env }: { env: Env }) {
  // 验证API token
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.ADMIN_API_TOKEN}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    // 在实际实现中，这里会处理上传的图片文件
    // 由于这是一个演示，我们将使用模拟数据
    
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // 上传文件到 R2
    const r2Key = `payment-qrcodes/${Date.now()}-${file.name}`
    await env.R2_BUCKET.put(r2Key, file)
    
    const db = getDB(env)
    
    // 更新或创建设置
    const settingKey = 'payment_qr_code_key'
    const existing = await db.prepare(
      'SELECT id FROM app_settings WHERE key = ?'
    ).bind(settingKey).first()
    
    let result
    if (existing) {
      // 更新现有设置
      result = await db.prepare(`
        UPDATE app_settings 
        SET value = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE key = ?
      `).bind(r2Key, settingKey).run()
    } else {
      // 创建新设置
      const id = crypto.randomUUID()
      result = await db.prepare(`
        INSERT INTO app_settings 
        (id, key, value, description, created_at, updated_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(
        id, 
        settingKey, 
        r2Key, 
        '支付二维码图片在R2中的key'
      ).run()
    }
    
    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Failed to update QR code' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    return new Response(JSON.stringify({ 
      success: true, 
      r2Key,
      message: 'Payment QR code updated successfully' 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update QR code' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}