import React, { useState } from 'react'
import { Task } from '../hooks/useTasks'
import { User } from '@supabase/supabase-js'
import { useSubtasks } from '../hooks/useSubtasks'
import { Trash2, Edit3, Check, X } from 'lucide-react'
import SubtaskGenerator from './SubtaskGenerator'
import SubtaskList from './SubtaskList'

interface TaskItemProps {
  task: Task
  user: User | null
  onUpdate: (id: string, updates: Partial<Pick<Task, 'title' | 'priority' | 'status'>>) => Promise<{ error: string | null }>
  onDelete: (id: string) => Promise<{ error: string | null }>
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  urgent: 'bg-red-100 text-red-800 border-red-200',
}

const statusColors = {
  pending: 'bg-gray-100 text-gray-800 border-gray-200',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
  done: 'bg-green-100 text-green-800 border-green-200',
}

function TaskItem({ task, user, onUpdate, onDelete }: TaskItemProps) {
  const { addSubtask } = useSubtasks(user, task.id)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editPriority, setEditPriority] = useState(task.priority)
  const [editStatus, setEditStatus] = useState(task.status)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    const { error } = await onUpdate(task.id, {
      title: editTitle,
      priority: editPriority,
      status: editStatus,
    })
    
    if (!error) {
      setIsEditing(false)
    }
    setLoading(false)
  }

  const handleCancel = () => {
    setEditTitle(task.title)
    setEditPriority(task.priority)
    setEditStatus(task.status)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true)
      await onDelete(task.id)
      setLoading(false)
    }
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 space-y-4">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-blue-500 focus:border-light-blue-500"
          placeholder="Task title"
        />
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as Task['priority'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-blue-500 focus:border-light-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as Task['status'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-blue-500 focus:border-light-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !editTitle.trim()}
            className="px-4 py-2 bg-light-blue-600 hover:bg-light-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-medium ${task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {task.title}
          </h3>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[task.status]}`}>
              {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-light-blue-600 transition-colors duration-200 disabled:opacity-50"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Subtasks Section */}
      <SubtaskList taskId={task.id} user={user} />
      
      {/* AI Subtask Generator */}
      <SubtaskGenerator 
        taskTitle={task.title}
        taskId={task.id}
        user={user}
        onSubtaskAdded={addSubtask}
      />
    </div>
  )
}

export default TaskItem