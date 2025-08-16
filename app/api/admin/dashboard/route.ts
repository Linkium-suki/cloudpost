import { NextRequest } from 'next/server'
import { getDB } from '@/lib/db'
import { Env } from '@/lib/db'

// 获取仪表盘统计数据
export async function GET(request: NextRequest, { env }: { env: Env }) {
  // 验证API token
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.ADMIN_API_TOKEN}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const db = getDB(env)
    
    // 获取统计信息
    const totalRequests = await db.prepare('SELECT COUNT(*) as count FROM requests').first()
    const pendingRequests = await db.prepare('SELECT COUNT(*) as count FROM requests WHERE status = ?').bind('pending').first()
    const paidRequests = await db.prepare('SELECT COUNT(*) as count FROM requests WHERE status = ?').bind('paid').first()
    
    // 获取总收入估算
    const totalRevenueResult = await db.prepare('SELECT SUM(total_amount) as total FROM requests WHERE status != ?').bind('cancelled').first()
    const totalRevenue = totalRevenueResult?.total || 0

    const data = {
      totalRequests: totalRequests?.count || 0,
      pendingRequests: pendingRequests?.count || 0,
      paidRequests: paidRequests?.count || 0,
      totalRevenue: parseFloat(totalRevenue as string) || 0,
    }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch dashboard data' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}