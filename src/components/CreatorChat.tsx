'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageSquare, Send, Hash } from 'lucide-react'
import UserTooltip from './UserTooltip'

interface CreatorChatProps {
  token: string
}

interface Channel {
  id: number
  name: string
  description?: string
  channelType: string
}

interface ChatMessage {
  id: number
  channelId: number
  userId: string
  message: string
  messageType: string
  createdAt: string
  user?: {
    email: string
    fullName?: string
    avatarUrl?: string
  }
}

export default function CreatorChat({ token }: CreatorChatProps) {
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<number | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadChannels()
  }, [])

  useEffect(() => {
    if (selectedChannel) {
      loadMessages()
      const interval = setInterval(loadMessages, 5000) // Poll every 5 seconds
      return () => clearInterval(interval)
    }
  }, [selectedChannel])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadChannels = async () => {
    try {
      const res = await fetch('/api/chat/channels', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setChannels(data.channels || [])
        if (data.channels && data.channels.length > 0 && !selectedChannel) {
          setSelectedChannel(data.channels[0].id)
        }
      }
    } catch (error) {
      console.error('Error loading channels:', error)
    }
  }

  const loadMessages = async () => {
    if (!selectedChannel) return

    try {
      const res = await fetch(`/api/chat/messages?channelId=${selectedChannel}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedChannel) return

    setLoading(true)
    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          channelId: selectedChannel,
          message: newMessage
        })
      })
      const data = await res.json()
      if (data.success) {
        setNewMessage('')
        loadMessages() // Reload to get the new message
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold text-white">Creator Chat</h3>
        </div>
        <p className="text-sm text-gray-400">Connect and chat with other creators</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Channels Sidebar */}
        <div className="w-64 border-r border-gray-700 overflow-y-auto">
          <div className="p-3 space-y-1">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setSelectedChannel(channel.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedChannel === channel.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  <span className="font-medium">{channel.name}</span>
                </div>
                {channel.description && (
                  <div className="text-xs mt-1 opacity-75 truncate">{channel.description}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedChannel ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const displayName = msg.user?.fullName || msg.user?.email?.split('@')[0] || 'Creator'
                  return (
                    <div key={msg.id} className="flex gap-3">
                      {msg.user?.avatarUrl ? (
                        <img
                          src={msg.user.avatarUrl}
                          alt={displayName}
                          className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-semibold">
                            {displayName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <UserTooltip userId={msg.userId} token={token}>
                            <span className="font-semibold text-white hover:text-purple-400 cursor-pointer">
                              {displayName}
                            </span>
                          </UserTooltip>
                          <span className="text-xs text-gray-400">{formatTime(msg.createdAt)}</span>
                        </div>
                        <div className="text-gray-300 whitespace-pre-wrap">{msg.message}</div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !newMessage.trim()}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a channel to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
