import React from 'react';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, loading, signOut } = useAuth();
  const [currentPage, setCurrentPage] = React.useState<'home' | 'login' | 'signup' | 'dashboard'>('home');

  const handleLogin = () => {
    setCurrentPage('login');
  };

  const handleSignup = () => {
    setCurrentPage('signup');
  };

  const handleDashboard = () => {
    setCurrentPage('dashboard');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleLogout = () => {
    signOut();
    setCurrentPage('home');
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // If user is authenticated, show dashboard
  if (user && currentPage !== 'home') {
    return <Dashboard onLogout={handleLogout} user={user} />;
  }

  if (currentPage === 'login') {
    return <LoginPage onBack={handleBackToHome} onSuccess={handleDashboard} />;
  }

  if (currentPage === 'signup') {
    return <SignupPage onBack={handleBackToHome} onLogin={handleLogin} onSuccess={handleDashboard} />;
  }

  if (currentPage === 'dashboard') {
    return <Dashboard onLogout={handleLogout} user={user} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-blue-50 via-light-blue-100 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full text-center space-y-12">
        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 tracking-tight leading-tight">
            Welcome to My
            <span className="block text-light-blue-600 mt-2">Task Manager</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Organize your life, boost your productivity, and achieve your goals with our intuitive task management solution.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-3xl mx-auto">
          <button
            onClick={handleLogin}
            className="w-full sm:w-auto px-12 py-4 bg-light-blue-600 hover:bg-light-blue-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-light-blue-200 focus:ring-opacity-50"
          >
            Login
          </button>
          
          <button
            onClick={handleSignup}
            className="w-full sm:w-auto px-12 py-4 bg-white hover:bg-gray-50 text-light-blue-600 font-semibold text-lg border-2 border-light-blue-600 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-light-blue-200 focus:ring-opacity-50"
          >
            Signup
          </button>
          
          <button
            onClick={handleDashboard}
            className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-light-blue-500 to-light-blue-600 hover:from-light-blue-600 hover:to-light-blue-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-light-blue-200 focus:ring-opacity-50"
          >
            Go to Dashboard
          </button>
        </div>

        {/* Feature Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="w-12 h-12 bg-light-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-light-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Organize Tasks</h3>
            <p className="text-gray-600">Keep all your tasks organized in one place with easy categorization.</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="w-12 h-12 bg-light-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-light-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Boost Productivity</h3>
            <p className="text-gray-600">Track progress and stay motivated with our productivity features.</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="w-12 h-12 bg-light-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-light-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Achieve Goals</h3>
            <p className="text-gray-600">Turn your aspirations into achievements with structured goal tracking.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;