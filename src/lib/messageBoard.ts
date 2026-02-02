/**
 * Message Board System
 * Handles posts, replies, and threads
 */

import { db } from './db'

export interface MessageBoardCategory {
  id?: number
  name: string
  description?: string
  icon?: string
  isActive: boolean
}

export interface MessageBoardPost {
  id?: number
  categoryId?: number
  userId: string
  title: string
  content: string
  isPinned: boolean
  isLocked: boolean
  viewCount: number
  replyCount: number
  createdAt?: string
  updatedAt?: string
  lastReplyAt?: string
  user?: {
    email: string
    fullName?: string
    avatarUrl?: string
  }
  category?: {
    name: string
    icon?: string
  }
}

export interface MessageBoardReply {
  id?: number
  postId: number
  userId: string
  content: string
  parentReplyId?: number
  createdAt?: string
  updatedAt?: string
  user?: {
    email: string
    fullName?: string
    avatarUrl?: string
  }
  reactions?: {
    like: number
    love: number
    helpful: number
    insightful: number
  }
}

/**
 * Get or create default categories
 */
export async function getDefaultCategories(): Promise<MessageBoardCategory[]> {
  try {
    const result = await db.execute({
      sql: `
        SELECT * FROM message_board_categories
        WHERE is_active = TRUE
        ORDER BY created_at ASC
      `
    })

    if (result.rows.length === 0) {
      // Create default categories
      const defaultCategories = [
        { name: 'General Discussion', description: 'General topics and discussions', icon: '💬' },
        { name: 'Help & Support', description: 'Get help from the community', icon: '❓' },
        { name: 'Feature Requests', description: 'Suggest new features', icon: '💡' },
        { name: 'Collaborations', description: 'Find collaboration opportunities', icon: '🤝' },
        { name: 'Success Stories', description: 'Share your wins', icon: '🎉' },
        { name: 'Tips & Tricks', description: 'Share tips and best practices', icon: '✨' }
      ]

      for (const category of defaultCategories) {
        await db.execute({
          sql: `
            INSERT INTO message_board_categories (name, description, icon, is_active)
            VALUES (?, ?, ?, TRUE)
          `,
          args: [category.name, category.description, category.icon]
        })
      }

      // Return created categories
      const newResult = await db.execute({
        sql: `
          SELECT * FROM message_board_categories
          WHERE is_active = TRUE
          ORDER BY created_at ASC
        `
      })

      return newResult.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        icon: row.icon,
        isActive: row.is_active
      }))
    }

    return result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      icon: row.icon,
      isActive: row.is_active
    }))
  } catch (error: any) {
    console.error('Error getting categories:', error)
    return []
  }
}

/**
 * Get posts (with pagination)
 */
export async function getPosts(
  categoryId?: number,
  limit: number = 20,
  offset: number = 0
): Promise<MessageBoardPost[]> {
  try {
    let sql = `
      SELECT 
        p.*,
        u.email,
        u.full_name,
        u.avatar_url,
        c.name as category_name,
        c.icon as category_icon
      FROM message_board_posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN message_board_categories c ON c.id = p.category_id
      WHERE 1=1
    `
    const args: any[] = []

    if (categoryId) {
      sql += ' AND p.category_id = ?'
      args.push(categoryId)
    }

    sql += ' ORDER BY p.is_pinned DESC, p.last_reply_at DESC NULLS LAST, p.created_at DESC LIMIT ? OFFSET ?'
    args.push(limit, offset)

    const result = await db.execute({ sql, args })

    return result.rows.map((row: any) => ({
      id: row.id,
      categoryId: row.category_id,
      userId: row.user_id,
      title: row.title,
      content: row.content,
      isPinned: row.is_pinned,
      isLocked: row.is_locked,
      viewCount: row.view_count,
      replyCount: row.reply_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastReplyAt: row.last_reply_at,
      user: {
        email: row.email,
        fullName: row.full_name || row.email?.split('@')[0] || 'Creator',
        avatarUrl: row.avatar_url
      },
      category: row.category_name ? {
        name: row.category_name,
        icon: row.category_icon
      } : undefined
    }))
  } catch (error: any) {
    console.error('Error getting posts:', error)
    return []
  }
}

/**
 * Get a single post with replies
 */
export async function getPost(postId: number): Promise<MessageBoardPost | null> {
  try {
    // Increment view count
    await db.execute({
      sql: `
        UPDATE message_board_posts
        SET view_count = view_count + 1
        WHERE id = ?
      `,
      args: [postId]
    })

    const result = await db.execute({
      sql: `
        SELECT 
          p.*,
          u.email,
          u.full_name,
          u.avatar_url,
          c.name as category_name,
          c.icon as category_icon
        FROM message_board_posts p
        JOIN users u ON u.id = p.user_id
        LEFT JOIN message_board_categories c ON c.id = p.category_id
        WHERE p.id = ?
      `,
      args: [postId]
    })

    if (result.rows.length === 0) {
      return null
    }

    const row = result.rows[0] as any
    return {
      id: row.id,
      categoryId: row.category_id,
      userId: row.user_id,
      title: row.title,
      content: row.content,
      isPinned: row.is_pinned,
      isLocked: row.is_locked,
      viewCount: row.view_count,
      replyCount: row.reply_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastReplyAt: row.last_reply_at,
      user: {
        email: row.email,
        fullName: row.full_name || row.email?.split('@')[0] || 'Creator',
        avatarUrl: row.avatar_url
      },
      category: row.category_name ? {
        name: row.category_name,
        icon: row.category_icon
      } : undefined
    }
  } catch (error: any) {
    console.error('Error getting post:', error)
    return null
  }
}

/**
 * Create a new post
 */
export async function createPost(
  userId: string,
  title: string,
  content: string,
  categoryId?: number
): Promise<number> {
  try {
    const result = await db.execute({
      sql: `
        INSERT INTO message_board_posts (category_id, user_id, title, content, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())
        RETURNING id
      `,
      args: [categoryId || null, userId, title.trim(), content.trim()]
    })

    return (result.rows[0] as any).id
  } catch (error: any) {
    console.error('Error creating post:', error)
    throw error
  }
}

/**
 * Get replies for a post
 */
export async function getReplies(postId: number): Promise<MessageBoardReply[]> {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          r.*,
          u.email,
          u.full_name,
          u.avatar_url
        FROM message_board_replies r
        JOIN users u ON u.id = r.user_id
        WHERE r.post_id = ?
          AND r.deleted_at IS NULL
        ORDER BY r.created_at ASC
      `,
      args: [postId]
    })

    const replies = result.rows.map((row: any) => ({
      id: row.id,
      postId: row.post_id,
      userId: row.user_id,
      content: row.content,
      parentReplyId: row.parent_reply_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      user: {
        email: row.email,
        fullName: row.full_name || row.email?.split('@')[0] || 'Creator',
        avatarUrl: row.avatar_url
      }
    }))

    // Get reactions for each reply
    for (const reply of replies) {
      const reactionsResult = await db.execute({
        sql: `
          SELECT reaction_type, COUNT(*) as count
          FROM post_reactions
          WHERE reply_id = ?
          GROUP BY reaction_type
        `,
        args: [reply.id]
      })

      const reactions: Record<string, number> = { like: 0, love: 0, helpful: 0, insightful: 0 }
      reactionsResult.rows.forEach((r: any) => {
        reactions[r.reaction_type] = parseInt(r.count || 0)
      })
      ;(reply as unknown as { reactions: Record<string, number> }).reactions = reactions
    }

    return replies
  } catch (error: any) {
    console.error('Error getting replies:', error)
    return []
  }
}

/**
 * Create a reply
 */
export async function createReply(
  postId: number,
  userId: string,
  content: string,
  parentReplyId?: number
): Promise<number> {
  try {
    const result = await db.execute({
      sql: `
        INSERT INTO message_board_replies (post_id, user_id, content, parent_reply_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())
        RETURNING id
      `,
      args: [postId, userId, content.trim(), parentReplyId || null]
    })

    const replyId = (result.rows[0] as any).id

    // Update post reply count and last_reply_at
    await db.execute({
      sql: `
        UPDATE message_board_posts
        SET 
          reply_count = reply_count + 1,
          last_reply_at = NOW(),
          updated_at = NOW()
        WHERE id = ?
      `,
      args: [postId]
    })

    return replyId
  } catch (error: any) {
    console.error('Error creating reply:', error)
    throw error
  }
}

/**
 * Add reaction to post or reply
 */
export async function addReaction(
  userId: string,
  postId?: number,
  replyId?: number,
  reactionType: 'like' | 'love' | 'helpful' | 'insightful' = 'like'
): Promise<void> {
  try {
    await db.execute({
      sql: `
        INSERT INTO post_reactions (post_id, reply_id, user_id, reaction_type, created_at)
        VALUES (?, ?, ?, ?, NOW())
        ON CONFLICT DO NOTHING
      `,
      args: [postId || null, replyId || null, userId, reactionType]
    })
  } catch (error: any) {
    console.error('Error adding reaction:', error)
    throw error
  }
}

/**
 * Remove reaction
 */
export async function removeReaction(
  userId: string,
  postId?: number,
  replyId?: number,
  reactionType?: string
): Promise<void> {
  try {
    let sql = `
      DELETE FROM post_reactions
      WHERE user_id = ?
    `
    const args: any[] = [userId]

    if (postId) {
      sql += ' AND post_id = ?'
      args.push(postId)
    }
    if (replyId) {
      sql += ' AND reply_id = ?'
      args.push(replyId)
    }
    if (reactionType) {
      sql += ' AND reaction_type = ?'
      args.push(reactionType)
    }

    await db.execute({ sql, args })
  } catch (error: any) {
    console.error('Error removing reaction:', error)
    throw error
  }
}

