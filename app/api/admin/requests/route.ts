import { NextRequest } from 'next/server'
import { getDB } from '@/lib/db'
import { Env } from '@/lib/db'

// 获取所有邮寄请求
export async function GET(request: NextRequest, { env }: { env: Env }) {
  // 验证API token
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.ADMIN_API_TOKEN}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const db = getDB(env)
    
    // 获取查询参数
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const status = url.searchParams.get('status')
    const search = url.searchParams.get('search')
    
    // 构建查询
    let query = 'SELECT * FROM requests'
    const params: any[] = []
    
    if (status) {
      query += ' WHERE status = ?'
      params.push(status)
    }
    
    if (search) {
      query += status ? ' AND' : ' WHERE'
      query += ' (sender_name LIKE ? OR recipient_name LIKE ? OR request_id LIKE ?)'
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, (page - 1) * limit)
    
    const result = await db.prepare(query).bind(...params).all()
    
    // 获取总数
    let countQuery = 'SELECT COUNT(*) as count FROM requests'
    const countParams = []
    
    if (status) {
      countQuery += ' WHERE status = ?'
      countParams.push(status)
    }
    
    if (search) {
      countQuery += status ? ' AND' : ' WHERE'
      countQuery += ' (sender_name LIKE ? OR recipient_name LIKE ? OR request_id LIKE ?)'
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }
    
    const countResult = await db.prepare(countQuery).bind(...countParams).first()
    
    const data = {
      requests: result.results,
      pagination: {
        page,
        limit,
        total: countResult?.count || 0,
        totalPages: Math.ceil((countResult?.count || 0) / limit),
      },
    }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch requests' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}