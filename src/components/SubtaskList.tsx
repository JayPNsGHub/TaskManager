import React from 'react'
import { User } from '@supabase/supabase-js'
import { useSubtasks, Subtask } from '../hooks/useSubtasks'
import { Check, Circle } from 'lucide-react'

interface SubtaskListProps {
  taskId: string
  user: User | null
}

function SubtaskList({ taskId, user }: SubtaskListProps) {
  const { subtasks, updateSubtask } = useSubtasks(user, taskId)

  const toggleSubtaskStatus = async (subtask: Subtask) => {
    const newStatus = subtask.status === 'done' ? 'pending' : 'done'
    await updateSubtask(subtask.id, { status: newStatus })
  }

  if (subtasks.length === 0) {
    return null
  }

  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm font-medium text-gray-700">Subtasks:</h4>
      <div className="space-y-2">
        {subtasks.map((subtask) => (
          <div key={subtask.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
            <button
              onClick={() => toggleSubtaskStatus(subtask)}
              className="flex-shrink-0 text-gray-400 hover:text-light-blue-600 transition-colors duration-200"
            >
              {subtask.status === 'done' ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </button>
            <span className={`text-sm flex-1 ${
              subtask.status === 'done' 
                ? 'line-through text-gray-500' 
                : 'text-gray-800'
            }`}>
              {subtask.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubtaskList