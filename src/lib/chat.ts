/**
 * Real-Time Chat System
 * Handles chat channels and messages
 */

import { db } from './db'

export interface ChatChannel {
  id?: number
  name: string
  description?: string
  channelType: 'public' | 'private' | 'direct'
  createdBy?: string
  isActive: boolean
}

export interface ChatMessage {
  id?: number
  channelId: number
  userId: string
  message: string
  messageType: 'text' | 'system' | 'announcement'
  createdAt?: string
  user?: {
    email: string
    fullName?: string
    avatarUrl?: string
  }
}

/**
 * Get or create default channels
 */
export async function getDefaultChannels(): Promise<ChatChannel[]> {
  try {
    const result = await db.execute({
      sql: `
        SELECT * FROM chat_channels
        WHERE channel_type = 'public' AND is_active = TRUE
        ORDER BY created_at ASC
      `
    })

    if (result.rows.length === 0) {
      // Create default channels
      const defaultChannels = [
        { name: 'General', description: 'General discussion for all creators', channelType: 'public' },
        { name: 'Help & Support', description: 'Get help and support from the community', channelType: 'public' },
        { name: 'Feedback & Ideas', description: 'Share feedback and ideas for CreatorFlow', channelType: 'public' },
        { name: 'Collaborations', description: 'Find collaboration opportunities', channelType: 'public' },
        { name: 'Instagram Creators', description: 'For Instagram creators', channelType: 'public' },
        { name: 'TikTok Creators', description: 'For TikTok creators', channelType: 'public' },
        { name: 'YouTube Creators', description: 'For YouTube creators', channelType: 'public' }
      ]

      for (const channel of defaultChannels) {
        await db.execute({
          sql: `
            INSERT INTO chat_channels (name, description, channel_type, is_active)
            VALUES (?, ?, ?, TRUE)
          `,
          args: [channel.name, channel.description, channel.channelType]
        })
      }

      // Return created channels
      const newResult = await db.execute({
        sql: `
          SELECT * FROM chat_channels
          WHERE channel_type = 'public' AND is_active = TRUE
          ORDER BY created_at ASC
        `
      })

      return newResult.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        channelType: row.channel_type,
        createdBy: row.created_by,
        isActive: row.is_active
      }))
    }

    return result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      channelType: row.channel_type,
      createdBy: row.created_by,
      isActive: row.is_active
    }))
  } catch (error: any) {
    console.error('Error getting channels:', error)
    return []
  }
}

/**
 * Get messages for a channel
 */
export async function getChannelMessages(channelId: number, limit: number = 50): Promise<ChatMessage[]> {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          cm.*,
          u.email,
          u.full_name,
          u.avatar_url
        FROM chat_messages cm
        JOIN users u ON u.id = cm.user_id
        WHERE cm.channel_id = ?
          AND cm.deleted_at IS NULL
        ORDER BY cm.created_at DESC
        LIMIT ?
      `,
      args: [channelId, limit]
    })

    const messages = result.rows.map((row: any) => ({
      id: row.id,
      channelId: row.channel_id,
      userId: row.user_id,
      message: row.message,
      messageType: row.message_type,
      createdAt: row.created_at,
      user: {
        email: row.email,
        fullName: row.full_name || row.email?.split('@')[0] || 'Creator',
        avatarUrl: row.avatar_url
      }
    }))

    // Reverse to show oldest first
    return messages.reverse()
  } catch (error: any) {
    console.error('Error getting channel messages:', error)
    return []
  }
}

/**
 * Send a message to a channel
 */
export async function sendMessage(
  channelId: number,
  userId: string,
  message: string,
  messageType: 'text' | 'system' | 'announcement' = 'text'
): Promise<number> {
  try {
    const result = await db.execute({
      sql: `
        INSERT INTO chat_messages (channel_id, user_id, message, message_type, created_at)
        VALUES (?, ?, ?, ?, NOW())
        RETURNING id
      `,
      args: [channelId, userId, message.trim(), messageType]
    })

    return (result.rows[0] as any).id
  } catch (error: any) {
    console.error('Error sending message:', error)
    throw error
  }
}

/**
 * Create a new channel
 */
export async function createChannel(
  name: string,
  description: string,
  createdBy: string,
  channelType: 'public' | 'private' = 'public'
): Promise<number> {
  try {
    const result = await db.execute({
      sql: `
        INSERT INTO chat_channels (name, description, channel_type, created_by, is_active)
        VALUES (?, ?, ?, ?, TRUE)
        RETURNING id
      `,
      args: [name, description, channelType, createdBy]
    })

    return (result.rows[0] as any).id
  } catch (error: any) {
    console.error('Error creating channel:', error)
    throw error
  }
}

