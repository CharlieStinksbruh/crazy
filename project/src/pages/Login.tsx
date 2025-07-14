import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, User, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showSecretForm, setShowSecretForm] = useState(false);
  const [newAccount, setNewAccount] = useState({
    username: '',
    email: '',
    password: '',
    balance: 1000,
    isAdmin: false
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('Attempting login with:', { usernameOrEmail, password });

    try {
      const success = login(usernameOrEmail, password);
      if (success) {
        console.log('Login successful, navigating to home');
        navigate('/');
      } else {
        setError('Invalid username/email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (username: string, pass: string) => {
    setError('');
    setIsLoading(true);
    
    console.log('Quick login attempt:', { username, pass });
    
    try {
      const success = login(username, pass);
      if (success) {
        console.log('Quick login successful');
        navigate('/');
      } else {
        setError('Quick login failed');
      }
    } catch (err) {
      console.error('Quick login error:', err);
      setError('Quick login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoClick = () => {
    setLogoClickCount(prev => prev + 1);
    if (logoClickCount >= 6) { // 7 clicks total to reveal
      setShowSecretForm(true);
    }
    
    // Reset counter after 3 seconds of no clicks
    setTimeout(() => {
      setLogoClickCount(0);
    }, 3000);
  };

  const createSecretAccount = () => {
    if (!newAccount.username || !newAccount.email || !newAccount.password) {
      setError('All fields are required for account creation');
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem('charlies-odds-users') || '[]');
      
      // Check if user already exists
      const existingUser = users.find((u: any) => 
        u.username.toLowerCase() === newAccount.username.toLowerCase() || 
        u.email.toLowerCase() === newAccount.email.toLowerCase()
      );
      
      if (existingUser) {
        setError('Username or email already exists');
        return;
      }

      const user = {
        id: `secret-${Date.now()}`,
        username: newAccount.username,
        email: newAccount.email,
        password: newAccount.password,
        balance: newAccount.balance,
        isAdmin: newAccount.isAdmin,
        createdAt: new Date().toISOString(),
        stats: { totalBets: 0, totalWins: 0, totalLosses: 0, biggestWin: 0, biggestLoss: 0 }
      };
      
      users.push(user);
      localStorage.setItem('charlies-odds-users', JSON.stringify(users));
      
      setError('');
      alert(`Account created successfully! Username: ${newAccount.username}, Password: ${newAccount.password}`);
      
      // Reset form
      setNewAccount({
        username: '',
        email: '',
        password: '',
        balance: 1000,
        isAdmin: false
      });
      setShowSecretForm(false);
      setLogoClickCount(0);
    } catch (err) {
      setError('Failed to create account');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-900">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div 
            className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-105 transition-transform"
            onClick={handleLogoClick}
            title={logoClickCount > 0 ? `${7 - logoClickCount} more clicks...` : ''}
          >
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to CharliesOdds</p>
        </div>

        {/* Secret Account Creation Form */}
        {showSecretForm && (
          <div className="bg-red-900 border border-red-600 rounded-xl p-6">
            <h3 className="text-white font-bold mb-4 text-center">🔒 Secret Account Creator</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Username"
                value={newAccount.username}
                onChange={(e) => setNewAccount(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
              />
              <input
                type="email"
                placeholder="Email"
                value={newAccount.email}
                onChange={(e) => setNewAccount(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
              />
              <input
                type="password"
                placeholder="Password"
                value={newAccount.password}
                onChange={(e) => setNewAccount(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
              />
              <input
                type="number"
                placeholder="Starting Balance"
                value={newAccount.balance}
                onChange={(e) => setNewAccount(prev => ({ ...prev, balance: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
              />
              <label className="flex items-center text-white text-sm">
                <input
                  type="checkbox"
                  checked={newAccount.isAdmin}
                  onChange={(e) => setNewAccount(prev => ({ ...prev, isAdmin: e.target.checked }))}
                  className="mr-2"
                />
                Admin Account
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={createSecretAccount}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm font-semibold"
                >
                  Create Account
                </button>
                <button
                  onClick={() => {
                    setShowSecretForm(false);
                    setLogoClickCount(0);
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username or Email
              </label>
              <input
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter username or email"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10"
                  placeholder="Enter password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-600 text-white p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-600 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <LogIn className="w-5 h-5 mr-2" />
              )}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-yellow-400 hover:text-yellow-300">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;