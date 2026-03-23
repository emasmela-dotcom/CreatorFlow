import { randomUUID } from 'crypto'
import { db } from './db'

/**
 * Create a one-time snapshot for the active trial.
 * This is called right before the first content-changing write in trial.
 */
export async function ensureTrialSnapshot(userId: string): Promise<{ created: boolean; backupId?: string }> {
  const userResult = await db.execute({
    sql: 'SELECT trial_started_at, trial_end_at, subscription_tier, full_name, avatar_url FROM users WHERE id = ?',
    args: [userId],
  })

  if (userResult.rows.length === 0) {
    return { created: false }
  }

  const user = userResult.rows[0] as any
  if (!user.trial_started_at || !user.trial_end_at) {
    return { created: false }
  }

  const now = new Date()
  const trialEnd = new Date(user.trial_end_at as string)
  if (now > trialEnd) {
    return { created: false }
  }

  // Keep exactly one active backup for this trial; never overwrite it.
  const existingBackupResult = await db.execute({
    sql: 'SELECT id FROM project_backups WHERE user_id = ? AND is_restored = 0 ORDER BY created_at DESC LIMIT 1',
    args: [userId],
  })

  if (existingBackupResult.rows.length > 0) {
    return { created: false, backupId: existingBackupResult.rows[0].id as string }
  }

  const contentPostsResult = await db.execute({
    sql: 'SELECT * FROM content_posts WHERE user_id = ?',
    args: [userId],
  })

  const analyticsResult = await db.execute({
    sql: 'SELECT * FROM analytics WHERE user_id = ?',
    args: [userId],
  })

  const contentPosts = contentPostsResult.rows.map((row: any) => ({
    id: row.id as string,
    user_id: row.user_id as string,
    platform: row.platform as string,
    content: row.content as string,
    media_urls: JSON.parse((row.media_urls as string) || '[]'),
    scheduled_at: (row.scheduled_at as string | null) || null,
    published_at: (row.published_at as string | null) || null,
    status: row.status as string,
    engagement_metrics: row.engagement_metrics
      ? typeof row.engagement_metrics === 'string'
        ? JSON.parse(row.engagement_metrics as string)
        : row.engagement_metrics
      : null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  }))

  const analytics = analyticsResult.rows.map((row: any) => ({
    id: row.id as string,
    user_id: row.user_id as string,
    platform: row.platform as string,
    metric_type: row.metric_type as string,
    value: Number(row.value),
    date: row.date as string,
    created_at: row.created_at as string,
  }))

  const backupData = {
    content_posts: contentPosts,
    analytics,
    user_settings: {
      subscription_tier: (user.subscription_tier as string | null) || null,
      full_name: (user.full_name as string | null) || null,
      avatar_url: (user.avatar_url as string | null) || null,
    },
  }

  const backupId = randomUUID()
  const nowIso = now.toISOString()
  await db.execute({
    sql: `INSERT INTO project_backups (id, user_id, trial_started_at, backup_data, is_restored, created_at)
          VALUES (?, ?, ?, ?, 0, ?)`,
    args: [backupId, userId, nowIso, JSON.stringify(backupData), nowIso],
  })

  return { created: true, backupId }
}

