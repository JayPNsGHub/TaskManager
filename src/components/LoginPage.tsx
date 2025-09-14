import React, { useState } from 'react';

interface LoginPageProps {
  onBack: () => void;
}

function LoginPage({ onBack }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    // Handle login logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-blue-50 via-light-blue-100 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center text-light-blue-600 hover:text-light-blue-700 font-medium transition-colors duration-200 mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        {/* Login Form Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8 sm:p-10">
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight">
              Login
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Welcome back! Please sign in to your account.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-light-blue-200 focus:border-light-blue-500 transition-all duration-200 text-lg"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-light-blue-200 focus:border-light-blue-500 transition-all duration-200 text-lg"
                placeholder="Enter your password"
              />
            </div>

            {/* Login Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full px-6 py-4 bg-light-blue-600 hover:bg-light-blue-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-light-blue-200 focus:ring-opacity-50"
              >
                Login
              </button>
            </div>

            {/* Additional Links */}
            <div className="text-center pt-4 space-y-2">
              <a href="#" className="text-light-blue-600 hover:text-light-blue-700 font-medium transition-colors duration-200">
                Forgot your password?
              </a>
              <p className="text-gray-600">
                Don't have an account?{' '}
                <a href="#" className="text-light-blue-600 hover:text-light-blue-700 font-medium transition-colors duration-200">
                  Sign up here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;