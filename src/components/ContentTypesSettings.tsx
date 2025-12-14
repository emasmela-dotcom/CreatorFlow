'use client'

import { useState, useEffect } from 'react'
import { Tag, Check } from 'lucide-react'
import { CONTENT_TYPES } from '@/lib/userProfile'

interface ContentTypesSettingsProps {
  token: string
}

export default function ContentTypesSettings({ token }: ContentTypesSettingsProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadContentTypes()
  }, [])

  const loadContentTypes = async () => {
    try {
      const res = await fetch('/api/user/profile/content-types', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setSelectedTypes(data.contentTypes || [])
      }
    } catch (error) {
      console.error('Error loading content types:', error)
    }
  }

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type))
    } else if (selectedTypes.length < 3) {
      setSelectedTypes([...selectedTypes, type])
    }
  }

  const saveContentTypes = async () => {
    setLoading(true)
    setSaved(false)
    try {
      const res = await fetch('/api/user/profile/content-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ contentTypes: selectedTypes })
      })
      const data = await res.json()
      if (data.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Error saving content types:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-bold text-white">Content Types</h3>
      </div>
      <p className="text-sm text-gray-400 mb-4">
        Select up to 3 content types you create. This helps other creators see what you do!
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
        {CONTENT_TYPES.map((type) => {
          const isSelected = selectedTypes.includes(type)
          const canSelect = isSelected || selectedTypes.length < 3
          
          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              disabled={!canSelect}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-purple-600 text-white'
                  : canSelect
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{type}</span>
                {isSelected && <Check className="w-4 h-4" />}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          {selectedTypes.length}/3 selected
        </div>
        <button
          onClick={saveContentTypes}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-white transition-colors ${
            saved
              ? 'bg-green-600'
              : 'bg-purple-600 hover:bg-purple-700'
          } disabled:opacity-50`}
        >
          {saved ? '✓ Saved!' : loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
