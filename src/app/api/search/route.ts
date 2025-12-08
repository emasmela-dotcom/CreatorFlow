import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * Content Library Search API
 * Unified search across documents, templates, and hashtag sets
 */

/**
 * GET - Search across all content types
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') // 'all', 'documents', 'templates', 'hashtags'
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        success: true,
        results: {
          documents: [],
          templates: [],
          hashtagSets: []
        },
        total: 0
      })
    }

    const searchTerm = `%${query.trim()}%`
    const results: any = {
      documents: [],
      templates: [],
      hashtagSets: []
    }

    // Search documents
    if (!type || type === 'all' || type === 'documents') {
      try {
        const docsResult = await db.execute({
          sql: `
            SELECT id, title, content, category, tags, created_at, updated_at
            FROM documents
            WHERE user_id = ?
              AND (
                title ILIKE ? OR 
                content ILIKE ? OR 
                category ILIKE ? OR
                tags ILIKE ?
              )
            ORDER BY updated_at DESC
            LIMIT ?
          `,
          args: [user.userId, searchTerm, searchTerm, searchTerm, searchTerm, limit]
        })

        results.documents = docsResult.rows.map((doc: any) => ({
          id: doc.id,
          type: 'document',
          title: doc.title,
          content: doc.content?.substring(0, 200),
          category: doc.category,
          tags: doc.tags,
          createdAt: doc.created_at,
          updatedAt: doc.updated_at
        }))
      } catch (e: any) {
        console.error('Documents search error:', e.message)
      }
    }

    // Search templates
    if (!type || type === 'all' || type === 'templates') {
      try {
        const templatesResult = await db.execute({
          sql: `
            SELECT id, name, platform, content, category, description, created_at, updated_at
            FROM content_templates
            WHERE user_id = ?
              AND (
                name ILIKE ? OR 
                content ILIKE ? OR 
                category ILIKE ? OR
                description ILIKE ?
              )
            ORDER BY updated_at DESC
            LIMIT ?
          `,
          args: [user.userId, searchTerm, searchTerm, searchTerm, searchTerm, limit]
        })

        results.templates = templatesResult.rows.map((template: any) => ({
          id: template.id,
          type: 'template',
          name: template.name,
          platform: template.platform,
          content: template.content?.substring(0, 200),
          category: template.category,
          description: template.description,
          createdAt: template.created_at,
          updatedAt: template.updated_at
        }))
      } catch (e: any) {
        console.error('Templates search error:', e.message)
      }
    }

    // Search hashtag sets
    if (!type || type === 'all' || type === 'hashtags') {
      try {
        const hashtagsResult = await db.execute({
          sql: `
            SELECT id, name, platform, hashtags, description, created_at, updated_at
            FROM hashtag_sets
            WHERE user_id = ?
              AND (
                name ILIKE ? OR 
                description ILIKE ? OR
                hashtags::text ILIKE ?
              )
            ORDER BY updated_at DESC
            LIMIT ?
          `,
          args: [user.userId, searchTerm, searchTerm, searchTerm, limit]
        })

        results.hashtagSets = hashtagsResult.rows.map((set: any) => ({
          id: set.id,
          type: 'hashtagSet',
          name: set.name,
          platform: set.platform,
          hashtags: typeof set.hashtags === 'string' ? JSON.parse(set.hashtags || '[]') : set.hashtags,
          description: set.description,
          createdAt: set.created_at,
          updatedAt: set.updated_at
        }))
      } catch (e: any) {
        console.error('Hashtag sets search error:', e.message)
      }
    }

    const total = results.documents.length + results.templates.length + results.hashtagSets.length

    return NextResponse.json({
      success: true,
      query,
      results,
      total
    })
  } catch (error: any) {
    console.error('Search error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to search content' 
    }, { status: 500 })
  }
}


