import React, { useState } from 'react'
import { Task } from '../hooks/useTasks'
import { Plus } from 'lucide-react'

interface AddTaskFormProps {
  onAdd: (title: string, priority: Task['priority']) => Promise<{ error: string | null }>
}

function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('medium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    setError(null)
    
    const { error } = await onAdd(title.trim(), priority)
    
    if (error) {
      setError(error)
    } else {
      setTitle('')
      setPriority('medium')
    }
    
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Task</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-blue-500 focus:border-light-blue-500"
            placeholder="Enter task description"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task['priority'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-blue-500 focus:border-light-blue-500"
            disabled={loading}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-light-blue-600 hover:bg-light-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </div>
  )
}

export default AddTaskForm