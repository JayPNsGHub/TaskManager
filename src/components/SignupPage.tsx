import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface SignupPageProps {
  onBack: () => void;
  onLogin: () => void;
  onSuccess: () => void;
}

function SignupPage({ onBack, onLogin, onSuccess }: SignupPageProps) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signUp(email, password, name);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Auto-redirect to dashboard after successful signup
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }
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

        {/* Signup Form Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8 sm:p-10">
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight">
              Create Account
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Join us today! Please fill in your details to get started.
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-green-600 text-sm font-medium">
                  Account created successfully! Redirecting to dashboard...
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-light-blue-200 focus:border-light-blue-500 transition-all duration-200 text-lg"
                placeholder="Enter your full name"
                disabled={loading || success}
              />
            </div>

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
                disabled={loading || success}
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-light-blue-200 focus:border-light-blue-500 transition-all duration-200 text-lg"
                placeholder="Create a password"
                disabled={loading || success}
              />
            </div>

            {/* Signup Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || success}
                className="w-full px-6 py-4 bg-light-blue-600 hover:bg-light-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-light-blue-200 focus:ring-opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : success ? (
                  'Account created!'
                ) : (
                  'Signup'
                )}
              </button>
            </div>

            {/* Additional Links */}
            <div className="text-center pt-4">
              <p className="text-gray-600">
                Already have an account?{' '}
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    onLogin();
                  }}
                  className="text-light-blue-600 hover:text-light-blue-700 font-medium transition-colors duration-200"
                >
                  Login here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;