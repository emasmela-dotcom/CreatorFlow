import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: 'starter' | 'pro' | 'agency' | null
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'starter' | 'pro' | 'agency' | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'starter' | 'pro' | 'agency' | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      content_posts: {
        Row: {
          id: string
          user_id: string
          platform: 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube'
          content: string
          media_urls: string[]
          scheduled_at: string | null
          published_at: string | null
          status: 'draft' | 'scheduled' | 'published' | 'failed'
          engagement_metrics: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube'
          content: string
          media_urls?: string[]
          scheduled_at?: string | null
          published_at?: string | null
          status?: 'draft' | 'scheduled' | 'published' | 'failed'
          engagement_metrics?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube'
          content?: string
          media_urls?: string[]
          scheduled_at?: string | null
          published_at?: string | null
          status?: 'draft' | 'scheduled' | 'published' | 'failed'
          engagement_metrics?: any
          created_at?: string
          updated_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          user_id: string
          platform: string
          metric_type: 'followers' | 'engagement' | 'reach' | 'impressions' | 'clicks'
          value: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          metric_type: 'followers' | 'engagement' | 'reach' | 'impressions' | 'clicks'
          value: number
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: string
          metric_type?: 'followers' | 'engagement' | 'reach' | 'impressions' | 'clicks'
          value?: number
          date?: string
          created_at?: string
        }
      }
    }
  }
}
