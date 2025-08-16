import { D1Database, R2Bucket } from '@cloudflare/workers-types'

// 通过 Cloudflare Pages 绑定的 D1 数据库和 R2 存储桶
export type Env = {
  DB: D1Database
  R2_BUCKET: R2Bucket
}

export async function getDB(env: Env): Promise<D1Database> {
  // 直接返回通过 Cloudflare 绑定的 D1 数据库
  return env.DB
}