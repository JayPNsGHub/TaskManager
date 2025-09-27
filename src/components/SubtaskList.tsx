import React, { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useSubtasks, Subtask } from '../hooks/useSubtasks'
import { Check, Circle, GripVertical } from 'lucide-react'

interface SubtaskListProps {
  taskId: string
  user: User | null
}

function SubtaskList({ taskId, user }: SubtaskListProps) {
  const { subtasks, updateSubtask, updateSubtaskOrder } = useSubtasks(user, taskId)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [dragOverItem, setDragOverItem] = useState<string | null>(null)

  const toggleSubtaskStatus = async (subtask: Subtask) => {
    const newStatus = subtask.status === 'done' ? 'pending' : 'done'
    await updateSubtask(subtask.id, { status: newStatus })
  }

  const handleDragStart = (e: React.DragEvent, subtaskId: string) => {
    setDraggedItem(subtaskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, subtaskId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverItem(subtaskId)
  }

  const handleDragLeave = () => {
    setDragOverItem(null)
  }

  const handleDrop = async (e: React.DragEvent, targetSubtaskId: string) => {
    e.preventDefault()
    
    if (!draggedItem || draggedItem === targetSubtaskId) {
      setDraggedItem(null)
      setDragOverItem(null)
      return
    }

    const draggedIndex = subtasks.findIndex(s => s.id === draggedItem)
    const targetIndex = subtasks.findIndex(s => s.id === targetSubtaskId)
    
    if (draggedIndex === -1 || targetIndex === -1) return

    // Create new order
    const newSubtasks = [...subtasks]
    const [draggedSubtask] = newSubtasks.splice(draggedIndex, 1)
    newSubtasks.splice(targetIndex, 0, draggedSubtask)

    // Update order_index for all affected subtasks
    const updatePromises = newSubtasks.map((subtask, index) => 
      updateSubtaskOrder(subtask.id, index)
    )

    await Promise.all(updatePromises)
    
    setDraggedItem(null)
    setDragOverItem(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverItem(null)
  }

  if (subtasks.length === 0) {
    return null
  }

  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm font-medium text-gray-700">Subtasks:</h4>
      <div className="space-y-2">
        {subtasks.map((subtask) => (
          <div 
            key={subtask.id} 
            className={`flex items-center gap-3 bg-gray-50 rounded-lg p-3 transition-all duration-200 ${
              draggedItem === subtask.id ? 'opacity-50' : ''
            } ${
              dragOverItem === subtask.id ? 'bg-light-blue-50 border-2 border-light-blue-200' : ''
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, subtask.id)}
            onDragOver={(e) => handleDragOver(e, subtask.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, subtask.id)}
            onDragEnd={handleDragEnd}
          >
            <div className="flex-shrink-0 text-gray-400 cursor-grab active:cursor-grabbing">
              <GripVertical className="w-4 h-4" />
            </div>
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