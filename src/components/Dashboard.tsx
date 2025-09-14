import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';

interface DashboardProps {
  onLogout: () => void;
  user: User | null;
}

function Dashboard({ onLogout, user }: DashboardProps) {
  const [tasks, setTasks] = useState([
    'Finish homework',
    'Call John',
    'Buy groceries'
  ]);
  const [newTask, setNewTask] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, newTask.trim()]);
      setNewTask('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-blue-50 via-light-blue-100 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Dashboard Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8 sm:p-10">
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight">
              Welcome, {user?.user_metadata?.full_name || user?.email}!
            </h1>
            <p className="text-lg text-gray-600 mt-2">Here are your tasks</p>
          </div>

          {/* Task List */}
          <div className="mb-8">
            <ul className="space-y-4">
              {tasks.map((task, index) => (
                <li key={index} className="flex items-center text-lg text-gray-700">
                  <span className="w-8 h-8 bg-light-blue-100 text-light-blue-600 rounded-full flex items-center justify-center font-semibold text-sm mr-4">
                    {index + 1}
                  </span>
                  {task}
                </li>
              ))}
            </ul>
          </div>

          {/* Add New Task Form */}
          <form onSubmit={handleAddTask} className="mb-8">
            <div className="mb-4">
              <label htmlFor="newTask" className="block text-sm font-semibold text-gray-700 mb-2">
                New Task
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  id="newTask"
                  name="newTask"
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-light-blue-200 focus:border-light-blue-500 transition-all duration-200 text-lg"
                  placeholder="Enter a new task"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-light-blue-600 hover:bg-light-blue-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-light-blue-200 focus:ring-opacity-50"
                >
                  Add Task
                </button>
              </div>
            </div>
          </form>

          {/* Logout Button */}
          <div className="text-center pt-4">
            <button
              onClick={onLogout}
              className="px-12 py-4 bg-white hover:bg-gray-50 text-light-blue-600 font-semibold text-lg border-2 border-light-blue-600 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-light-blue-200 focus:ring-opacity-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;