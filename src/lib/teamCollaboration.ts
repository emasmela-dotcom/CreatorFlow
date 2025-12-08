/**
 * Team Collaboration Service
 * Handles teams, members, permissions, and approval workflows
 */

import { db } from './db'

export interface Team {
  id?: number
  name: string
  ownerId: string
  description?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface TeamMember {
  id?: number
  teamId: number
  userId: string
  role: 'owner' | 'admin' | 'editor' | 'viewer' | 'member'
  permissions?: string[]
  joinedAt?: Date
}

export interface ContentApproval {
  id?: number
  teamId?: number
  postId: string
  userId: string
  status: 'pending' | 'approved' | 'rejected'
  approverId?: string
  comments?: string
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Create a new team
 */
export async function createTeam(
  ownerId: string,
  name: string,
  description?: string
): Promise<Team> {
  const result = await db.execute({
    sql: `
      INSERT INTO teams (name, owner_id, description, created_at, updated_at)
      VALUES (?, ?, ?, NOW(), NOW())
      RETURNING *
    `,
    args: [name, ownerId, description || null]
  })

  const team = result.rows[0] as any

  // Add owner as team member
  await db.execute({
    sql: `
      INSERT INTO team_members (team_id, user_id, role, joined_at)
      VALUES (?, ?, 'owner', NOW())
    `,
    args: [team.id, ownerId]
  })

  return {
    id: team.id,
    name: team.name,
    ownerId: team.owner_id,
    description: team.description,
    createdAt: team.created_at,
    updatedAt: team.updated_at
  }
}

/**
 * Get user's teams
 */
export async function getUserTeams(userId: string): Promise<Team[]> {
  const result = await db.execute({
    sql: `
      SELECT t.* FROM teams t
      INNER JOIN team_members tm ON t.id = tm.team_id
      WHERE tm.user_id = ?
      ORDER BY t.created_at DESC
    `,
    args: [userId]
  })

  return result.rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    ownerId: row.owner_id,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }))
}

/**
 * Get team members
 */
export async function getTeamMembers(teamId: number): Promise<TeamMember[]> {
  const result = await db.execute({
    sql: `
      SELECT * FROM team_members
      WHERE team_id = ?
      ORDER BY joined_at ASC
    `,
    args: [teamId]
  })

  return result.rows.map((row: any) => ({
    id: row.id,
    teamId: row.team_id,
    userId: row.user_id,
    role: row.role,
    permissions: row.permissions ? JSON.parse(row.permissions) : [],
    joinedAt: row.joined_at
  }))
}

/**
 * Add member to team
 */
export async function addTeamMember(
  teamId: number,
  userId: string,
  role: TeamMember['role'] = 'member',
  permissions?: string[]
): Promise<TeamMember> {
  const result = await db.execute({
    sql: `
      INSERT INTO team_members (team_id, user_id, role, permissions, joined_at)
      VALUES (?, ?, ?, ?, NOW())
      ON CONFLICT (team_id, user_id) DO UPDATE
      SET role = EXCLUDED.role,
          permissions = EXCLUDED.permissions
      RETURNING *
    `,
    args: [
      teamId,
      userId,
      role,
      permissions ? JSON.stringify(permissions) : null
    ]
  })

  const row = result.rows[0] as any
  return {
    id: row.id,
    teamId: row.team_id,
    userId: row.user_id,
    role: row.role,
    permissions: row.permissions ? JSON.parse(row.permissions) : [],
    joinedAt: row.joined_at
  }
}

/**
 * Check if user has permission in team
 */
export async function hasTeamPermission(
  userId: string,
  teamId: number,
  permission: string
): Promise<boolean> {
  const result = await db.execute({
    sql: `
      SELECT role, permissions FROM team_members
      WHERE team_id = ? AND user_id = ?
    `,
    args: [teamId, userId]
  })

  if (result.rows.length === 0) return false

  const member = result.rows[0] as any
  const role = member.role

  // Owner and admin have all permissions
  if (role === 'owner' || role === 'admin') return true

  // Check specific permissions
  const permissions = member.permissions ? JSON.parse(member.permissions) : []
  return permissions.includes(permission)
}

/**
 * Create content approval request
 */
export async function createApprovalRequest(
  postId: string,
  userId: string,
  teamId?: number
): Promise<ContentApproval> {
  const result = await db.execute({
    sql: `
      INSERT INTO content_approvals (team_id, post_id, user_id, status, created_at, updated_at)
      VALUES (?, ?, ?, 'pending', NOW(), NOW())
      RETURNING *
    `,
    args: [teamId || null, postId, userId]
  })

  const row = result.rows[0] as any
  return {
    id: row.id,
    teamId: row.team_id,
    postId: row.post_id,
    userId: row.user_id,
    status: row.status,
    approverId: row.approver_id,
    comments: row.comments,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

/**
 * Approve or reject content
 */
export async function updateApproval(
  approvalId: number,
  approverId: string,
  status: 'approved' | 'rejected',
  comments?: string
): Promise<ContentApproval> {
  const result = await db.execute({
    sql: `
      UPDATE content_approvals
      SET status = ?,
          approver_id = ?,
          comments = ?,
          updated_at = NOW()
      WHERE id = ?
      RETURNING *
    `,
    args: [status, approverId, comments || null, approvalId]
  })

  const row = result.rows[0] as any
  return {
    id: row.id,
    teamId: row.team_id,
    postId: row.post_id,
    userId: row.user_id,
    status: row.status,
    approverId: row.approver_id,
    comments: row.comments,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

/**
 * Log team activity
 */
export async function logTeamActivity(
  teamId: number | null,
  userId: string,
  action: string,
  resourceType?: string,
  resourceId?: string,
  details?: any
): Promise<void> {
  await db.execute({
    sql: `
      INSERT INTO team_activity_logs 
      (team_id, user_id, action, resource_type, resource_id, details, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `,
    args: [
      teamId,
      userId,
      action,
      resourceType || null,
      resourceId || null,
      details ? JSON.stringify(details) : null
    ]
  })
}

/**
 * Get team activity logs
 */
export async function getTeamActivityLogs(
  teamId: number,
  limit: number = 50
): Promise<any[]> {
  const result = await db.execute({
    sql: `
      SELECT * FROM team_activity_logs
      WHERE team_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `,
    args: [teamId, limit]
  })

  return result.rows.map((row: any) => ({
    id: row.id,
    teamId: row.team_id,
    userId: row.user_id,
    action: row.action,
    resourceType: row.resource_type,
    resourceId: row.resource_id,
    details: row.details ? JSON.parse(row.details) : null,
    createdAt: row.created_at
  }))
}

