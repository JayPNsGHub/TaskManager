import React, { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { Sparkles, Plus, Loader2 } from 'lucide-react'

interface SubtaskGeneratorProps {
  taskTitle: string
  taskId: string
  user: User | null
  onSubtaskAdded: (title: string, parentTaskId: string) => Promise<{ error: string | null }>
}

function SubtaskGenerator({ taskTitle, taskId, user, onSubtaskAdded }: SubtaskGeneratorProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savingSubtasks, setSavingSubtasks] = useState<Set<string>>(new Set())

  const generateSubtasks = async () => {
    if (!user) return

    setLoading(true)
    setError(null)
    setSuggestions([])

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-subtasks`
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskTitle: taskTitle,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate subtasks')
      }

      const data = await response.json()
      setSuggestions(data.subtasks || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate subtasks')
    } finally {
      setLoading(false)
    }
  }

  const saveSubtask = async (subtaskTitle: string) => {
    setSavingSubtasks(prev => new Set(prev).add(subtaskTitle))
    
    try {
      const { error } = await onSubtaskAdded(subtaskTitle, taskId)
      
      if (!error) {
        // Remove the saved subtask from suggestions
        setSuggestions(prev => prev.filter(s => s !== subtaskTitle))
      }
    } catch (err) {
      console.error('Failed to save subtask:', err)
    } finally {
      setSavingSubtasks(prev => {
        const newSet = new Set(prev)
        newSet.delete(subtaskTitle)
        return newSet
      })
    }
  }

  return (
    <div className="mt-4 space-y-3">
      {/* Generate Button */}
      <button
        onClick={generateSubtasks}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        {loading ? 'Generating...' : 'Generate Subtasks with AI'}
      </button>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Suggestions List */}
      {suggestions.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-3">AI Suggested Subtasks:</h4>
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
              <span className="text-sm text-gray-800 flex-1">{suggestion}</span>
              <button
                onClick={() => saveSubtask(suggestion)}
                disabled={savingSubtasks.has(suggestion)}
                className="ml-3 flex items-center gap-1 px-3 py-1 bg-light-blue-600 hover:bg-light-blue-700 text-white text-xs font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingSubtasks.has(suggestion) ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
                {savingSubtasks.has(suggestion) ? 'Saving...' : 'Save'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SubtaskGenerator