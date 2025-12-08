'use client'

import React, { useState, useEffect } from 'react'
import { Users, Plus, UserPlus, CheckCircle, XCircle, Clock, Activity, Loader2 } from 'lucide-react'

interface Team {
  id: number
  name: string
  owner_id: string
  description: string | null
  created_at: string
}

interface TeamMember {
  id: number
  team_id: number
  user_id: string
  role: 'owner' | 'admin' | 'editor' | 'viewer' | 'member'
  permissions: string[]
  joined_at: string
}

interface TeamCollaborationProps {
  token: string
  userId: string
}

export default function TeamCollaboration({ token, userId }: TeamCollaborationProps) {
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [activity, setActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)

  const [newTeam, setNewTeam] = useState({
    name: '',
    description: ''
  })

  const [newMember, setNewMember] = useState({
    userId: '',
    role: 'member' as TeamMember['role']
  })

  useEffect(() => {
    loadTeams()
  }, [token])

  useEffect(() => {
    if (selectedTeam) {
      loadTeamDetails(selectedTeam)
    }
  }, [selectedTeam, token])

  const loadTeams = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/teams', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setTeams(data.teams || [])
        if (data.teams && data.teams.length > 0 && !selectedTeam) {
          setSelectedTeam(data.teams[0].id)
        }
      }
    } catch (err) {
      console.error('Failed to load teams:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadTeamDetails = async (teamId: number) => {
    try {
      const [membersRes, activityRes] = await Promise.all([
        fetch(`/api/teams?teamId=${teamId}&type=members`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/teams/activity?teamId=${teamId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      const membersData = await membersRes.json()
      if (membersData.success) {
        setMembers(membersData.members || [])
      }

      // Activity endpoint would need to be created
      // For now, just set empty
      setActivity([])
    } catch (err) {
      console.error('Failed to load team details:', err)
    }
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'create-team',
          ...newTeam
        })
      })
      const data = await response.json()
      if (data.success) {
        setShowCreateTeam(false)
        setNewTeam({ name: '', description: '' })
        loadTeams()
      }
    } catch (err) {
      console.error('Failed to create team:', err)
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTeam) return

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'add-member',
          teamId: selectedTeam,
          ...newMember
        })
      })
      const data = await response.json()
      if (data.success) {
        setShowAddMember(false)
        setNewMember({ userId: '', role: 'member' })
        loadTeamDetails(selectedTeam)
      }
    } catch (err) {
      console.error('Failed to add member:', err)
    }
  }

  const getRoleColor = (role: string) => {
    if (role === 'owner') return 'text-purple-400'
    if (role === 'admin') return 'text-blue-400'
    if (role === 'editor') return 'text-green-400'
    return 'text-gray-400'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Team Collaboration</h2>
          <p className="text-gray-400">
            Create teams, manage members, and collaborate on content
          </p>
        </div>
        <button
          onClick={() => setShowCreateTeam(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Team
        </button>
      </div>

      {showCreateTeam && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Create New Team</h3>
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Team Name</label>
              <input
                type="text"
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Description</label>
              <textarea
                value={newTeam.description}
                onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              >
                Create Team
              </button>
              <button
                type="button"
                onClick={() => setShowCreateTeam(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teams List */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Your Teams</h3>
            {teams.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                <p>No teams yet</p>
                <p className="text-sm">Create a team to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {teams.map(team => (
                  <button
                    key={team.id}
                    onClick={() => setSelectedTeam(team.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedTeam === team.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    <div className="font-medium">{team.name}</div>
                    {team.description && (
                      <div className="text-sm opacity-75 mt-1">{team.description}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Team Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedTeam ? (
            <>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Team Members</h3>
                  <button
                    onClick={() => setShowAddMember(true)}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 text-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add Member
                  </button>
                </div>

                {showAddMember && (
                  <div className="mb-4 p-4 bg-gray-700 rounded-lg">
                    <form onSubmit={handleAddMember} className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">User ID</label>
                        <input
                          type="text"
                          value={newMember.userId}
                          onChange={(e) => setNewMember({ ...newMember, userId: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                          placeholder="Enter user ID or email"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Role</label>
                        <select
                          value={newMember.role}
                          onChange={(e) => setNewMember({ ...newMember, role: e.target.value as any })}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                        >
                          <option value="member">Member</option>
                          <option value="viewer">Viewer</option>
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddMember(false)}
                          className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {members.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                    <p>No members yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {members.map(member => (
                      <div key={member.id} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{member.user_id}</div>
                          <div className={`text-sm ${getRoleColor(member.role)} capitalize`}>
                            {member.role}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Joined {new Date(member.joined_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                {activity.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Activity className="w-12 h-12 mx-auto mb-2 text-gray-600" />
                    <p>No activity yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activity.map((item, idx) => (
                      <div key={idx} className="bg-gray-700 rounded-lg p-3 text-sm text-gray-300">
                        {item.action} by {item.user_id}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center text-gray-400">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p>Select a team to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

