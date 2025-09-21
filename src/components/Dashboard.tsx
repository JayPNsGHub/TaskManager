import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useTasks } from '../hooks/useTasks';
import TaskItem from './TaskItem';
import AddTaskForm from './AddTaskForm';
import LoadingSpinner from './LoadingSpinner';

interface DashboardProps {
  onLogout: () => void;
  user: User | null;
}

function Dashboard({ onLogout, user }: DashboardProps) {
  const { tasks, loading, error, addTask, updateTask, deleteTask } = useTasks(user);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-blue-50 via-light-blue-100 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8 sm:p-10 text-center">
          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight">
              Welcome, {user?.user_metadata?.full_name || user?.email}!
            </h1>
            <p className="text-lg text-gray-600 mt-2">Manage your tasks efficiently</p>
          </div>

          {/* Task Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-light-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-light-blue-600">{tasks.length}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {tasks.filter(t => t.status === 'in-progress').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {tasks.filter(t => t.status === 'done').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="text-center">
            <button
              onClick={onLogout}
              className="px-12 py-4 bg-white hover:bg-gray-50 text-light-blue-600 font-semibold text-lg border-2 border-light-blue-600 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-light-blue-200 focus:ring-opacity-50"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Add Task Form */}
        <AddTaskForm onAdd={addTask} />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-center border border-white/30">
              <p className="text-gray-500 text-lg">No tasks yet. Add your first task above!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                user={user}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;