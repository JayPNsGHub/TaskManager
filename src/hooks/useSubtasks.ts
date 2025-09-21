import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { User } from '@supabase/supabase-js'

export interface Subtask {
  id: string
  title: string
  parent_task_id: string
  user_id: string
  status: 'pending' | 'in-progress' | 'done'
  order_index: number
  created_at: string
  updated_at: string
}

export function useSubtasks(user: User | null, parentTaskId: string | null) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch subtasks for a specific parent task
  const fetchSubtasks = async () => {
    if (!user || !parentTaskId) {
      setSubtasks([])
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('subtasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('parent_task_id', parentTaskId)
        .order('order_index', { ascending: true })

      if (error) throw error
      setSubtasks(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Add new subtask
  const addSubtask = async (title: string, parentTaskId: string) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      // Get the highest order_index for this parent task
      const { data: existingSubtasks } = await supabase
        .from('subtasks')
        .select('order_index')
        .eq('parent_task_id', parentTaskId)
        .eq('user_id', user.id)
        .order('order_index', { ascending: false })
        .limit(1)

      const nextOrderIndex = existingSubtasks && existingSubtasks.length > 0 
        ? existingSubtasks[0].order_index + 1 
        : 0

      const { data, error } = await supabase
        .from('subtasks')
        .insert([
          {
            title,
            parent_task_id: parentTaskId,
            user_id: user.id,
            status: 'pending' as const,
            order_index: nextOrderIndex,
          },
        ])
        .select()
        .single()

      if (error) throw error
      
      setSubtasks(prev => [...prev, data])
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add subtask'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  // Update subtask
  const updateSubtask = async (id: string, updates: Partial<Pick<Subtask, 'title' | 'status'>>) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      const { data, error } = await supabase
        .from('subtasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      setSubtasks(prev => prev.map(subtask => subtask.id === id ? data : subtask))
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update subtask'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  // Update subtask order
  const updateSubtaskOrder = async (subtaskId: string, newOrderIndex: number) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      const { data, error } = await supabase
        .from('subtasks')
        .update({ order_index: newOrderIndex, updated_at: new Date().toISOString() })
        .eq('id', subtaskId)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      setSubtasks(prev => prev.map(subtask => subtask.id === subtaskId ? data : subtask))
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update subtask order'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  // Delete subtask
  const deleteSubtask = async (id: string) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      const { error } = await supabase
        .from('subtasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setSubtasks(prev => prev.filter(subtask => subtask.id !== id))
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete subtask'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  useEffect(() => {
    fetchSubtasks()
  }, [user, parentTaskId])

  return {
    subtasks,
    loading,
    error,
    addSubtask,
    updateSubtask,
    updateSubtaskOrder,
    deleteSubtask,
    refetch: fetchSubtasks,
  }
}