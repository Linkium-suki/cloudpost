import { NextRequest } from 'next/server'
import { getDB } from '@/lib/db'
import { Env } from '@/lib/db'
import { ValueAddedService } from '@/lib/models'

// 获取所有增值服务
export async function GET(request: NextRequest, { env }: { env: Env }) {
  // 验证API token
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.ADMIN_API_TOKEN}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const db = getDB(env)
    
    const result = await db.prepare(
      'SELECT * FROM value_added_services ORDER BY sort_order, created_at'
    ).all()

    return new Response(JSON.stringify(result.results), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch services' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}

// 创建新的增值服务
export async function POST(request: NextRequest, { env }: { env: Env }) {
  // 验证API token
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.ADMIN_API_TOKEN}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const data: ValueAddedService = await request.json()
    
    // 简单验证
    if (!data.name || data.price === undefined) {
      return new Response(JSON.stringify({ error: 'Name and price are required' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const db = getDB(env)
    
    // 插入新服务
    const id = crypto.randomUUID()
    const result = await db.prepare(`
      INSERT INTO value_added_services 
      (id, name, name_en, description, description_en, price, is_active, sort_order, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      id,
      data.name,
      data.name_en || null,
      data.description || null,
      data.description_en || null,
      data.price,
      data.is_active !== undefined ? data.is_active : true,
      data.sort_order || 0
    ).run()
    
    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Failed to create service' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    // 返回创建的服务
    const service = await db.prepare(
      'SELECT * FROM value_added_services WHERE id = ?'
    ).bind(id).first<ValueAddedService>()

    return new Response(JSON.stringify(service), {
      headers: { 'Content-Type': 'application/json' },
      status: 201,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create service' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}