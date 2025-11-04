'use client'

import { useState } from 'react'
import { Send, CheckCircle, Loader2 } from 'lucide-react'

interface BrandVoiceToolProps {
  token: string
}

export default function BrandVoiceTool({ token }: BrandVoiceToolProps) {
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError('Please enter content to analyze')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/ai/brand-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content, platform })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      setResult(data.analysis)
    } catch (err: any) {
      setError(err.message || 'Failed to analyze brand voice')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Analyze Your Brand Voice</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="instagram">Instagram</option>
              <option value="twitter">Twitter/X</option>
              <option value="linkedin">LinkedIn</option>
              <option value="tiktok">TikTok</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Content to Analyze
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your content here to analyze brand voice consistency..."
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[200px]"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || !content.trim()}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Analyze Brand Voice
              </>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold">Analysis Results</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Brand Voice Score</p>
              <p className="text-3xl font-bold text-purple-400">{result.brandVoiceScore}%</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Consistency Level</p>
              <p className="text-xl font-semibold text-indigo-400">{result.consistencyLevel}</p>
            </div>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-300 mb-3">Tone Analysis</p>
            <div className="space-y-2">
              {Object.entries(result.toneAnalysis).map(([tone, score]: [string, any]) => (
                <div key={tone}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400 capitalize">{tone}</span>
                    <span className="text-white font-semibold">{score}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-lg">
            <p className="text-sm font-semibold text-indigo-400 mb-2">Voice Characteristics</p>
            <div className="flex flex-wrap gap-2">
              {result.voiceCharacteristics.map((char: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm">
                  {char}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
            <p className="text-sm font-semibold text-purple-400 mb-2">Recommendations</p>
            <ul className="space-y-2">
              {result.recommendations.map((rec: string, idx: number) => (
                <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}


