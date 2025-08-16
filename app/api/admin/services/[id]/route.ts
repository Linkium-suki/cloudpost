import { NextRequest } from 'next/server'
import { getDB } from '@/lib/db'
import { Env } from '@/lib/db'
import { ValueAddedService } from '@/lib/models'

// 更新一个已有的增值服务
export async function PUT(request: NextRequest, { params, env }: { params: { id: string }, env: Env }) {
  // 验证API token
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.ADMIN_API_TOKEN}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const data: Partial<ValueAddedService> = await request.json()

    const db = getDB(env)
    
    // 构建动态更新语句
    const fields = []
    const values = []
    
    if (data.name !== undefined) {
      fields.push('name = ?')
      values.push(data.name)
    }
    
    if (data.name_en !== undefined) {
      fields.push('name_en = ?')
      values.push(data.name_en)
    }
    
    if (data.description !== undefined) {
      fields.push('description = ?')
      values.push(data.description)
    }
    
    if (data.description_en !== undefined) {
      fields.push('description_en = ?')
      values.push(data.description_en)
    }
    
    if (data.price !== undefined) {
      fields.push('price = ?')
      values.push(data.price)
    }
    
    if (data.is_active !== undefined) {
      fields.push('is_active = ?')
      values.push(data.is_active)
    }
    
    if (data.sort_order !== undefined) {
      fields.push('sort_order = ?')
      values.push(data.sort_order)
    }
    
    // 如果没有要更新的字段
    if (fields.length === 0) {
      return new Response(JSON.stringify({ error: 'No fields to update' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }
    
    // 添加更新时间和ID到参数
    fields.push('updated_at = CURRENT_TIMESTAMP')
    values.push(params.id)
    
    const result = await db.prepare(`
      UPDATE value_added_services 
      SET ${fields.join(', ')}
      WHERE id = ?
    `).bind(...values).run()
    
    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Failed to update service' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      })
    }
    
    // 如果更新影响了0行，说明服务不存在
    if (result.meta?.changes === 0) {
      return new Response(JSON.stringify({ error: 'Service not found' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 404,
      })
    }

    // 返回更新后的服务
    const service = await db.prepare(
      'SELECT * FROM value_added_services WHERE id = ?'
    ).bind(params.id).first<ValueAddedService>()

    return new Response(JSON.stringify(service), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update service' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}