import { NextRequest } from 'next/server'
import { getDB } from '@/lib/db'
import { Env } from '@/lib/db'

// 更新特定请求的状态
export async function PUT(request: NextRequest, { params, env }: { params: { id: string }, env: Env }) {
  // 验证API token
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.ADMIN_API_TOKEN}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const { status } = await request.json()
    
    // 验证状态值
    const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return new Response(JSON.stringify({ error: 'Invalid status' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const db = getDB(env)
    
    // 更新请求状态
    const result = await db.prepare(
      'UPDATE requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(status, params.id).run()
    
    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Failed to update request' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      })
    }
    
    // 如果更新影响了0行，说明请求不存在
    if (result.meta?.changes === 0) {
      return new Response(JSON.stringify({ error: 'Request not found' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 404,
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update request' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}