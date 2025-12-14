import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { getPosts, createPost, getPost } from '@/lib/messageBoard'
import { updateUserActivity } from '@/lib/activeUsers'

export const dynamic = 'force-dynamic'

/**
 * GET - Get posts
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!) : undefined
    const postId = searchParams.get('postId') ? parseInt(searchParams.get('postId')!) : undefined
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Update user activity
    await updateUserActivity(user.userId)

    if (postId) {
      // Get single post
      const post = await getPost(postId)
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, post })
    }

    // Get posts list
    const posts = await getPosts(categoryId, limit, offset)

    return NextResponse.json({
      success: true,
      posts,
      count: posts.length
    })
  } catch (error: any) {
    console.error('Posts error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get posts' },
      { status: 500 }
    )
  }
}

/**
 * POST - Create a new post
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, content, categoryId } = await request.json()

    if (!title || !title.trim() || !content || !content.trim()) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Update user activity
    await updateUserActivity(user.userId)

    const postId = await createPost(user.userId, title, content, categoryId)

    return NextResponse.json({
      success: true,
      postId
    })
  } catch (error: any) {
    console.error('Create post error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create post' },
      { status: 500 }
    )
  }
}

