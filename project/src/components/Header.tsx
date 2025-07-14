import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, User, LogOut, Settings, BarChart3, 
  Gamepad2, Home, MessageSquare, Calendar, Gift,
  Crown, Shield, Zap, Target, TrendingUp, Play
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, formatCurrency } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const games = [
    { name: 'Dice', path: '/dice', icon: <Target className="w-4 h-4" /> },
    { name: 'Limbo', path: '/limbo', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Crash', path: '/crash', icon: <Zap className="w-4 h-4" /> },
    { name: 'Blackjack', path: '/blackjack', icon: <Target className="w-4 h-4" /> },
    { name: 'Plinko', path: '/plinko', icon: <BarChart3 className="w-4 h-4" /> },
    { name: 'Spin Wheel', path: '/spin-wheel', icon: <Play className="w-4 h-4" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-gray-800 border-b border-gray-700 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CO</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">CharliesOdds</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') ? 'text-yellow-400 bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            {/* Games Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                <Gamepad2 className="w-4 h-4" />
                <span>Games</span>
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {games.map((game) => (
                  <Link
                    key={game.path}
                    to={game.path}
                    className={`flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-700 transition-colors ${
                      isActive(game.path) ? 'text-yellow-400' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {game.icon}
                    <span>{game.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/earn-balance"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/earn-balance') ? 'text-yellow-400 bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Earn Balance</span>
            </Link>

            <Link
              to="/suggestions"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/suggestions') ? 'text-yellow-400 bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Suggestions</span>
            </Link>

            <Link
              to="/changelog"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/changelog') ? 'text-yellow-400 bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Changelog</span>
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-lg">
                  <span className="text-yellow-400 font-semibold">{formatCurrency(user.balance)}</span>
                </div>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-300 hover:text-white">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden sm:block">{user.username}</span>
                    {user.isAdmin && <Crown className="w-4 h-4 text-yellow-400" />}
                  </button>
                  <div className="absolute top-full right-0 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/analytics"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Analytics</span>
                    </Link>
                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-300 hover:text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-700 py-4">
            <div className="space-y-2">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/') ? 'text-yellow-400 bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              <div className="px-3 py-2">
                <div className="text-gray-400 text-sm font-medium mb-2">Games</div>
                <div className="space-y-1 ml-4">
                  {games.map((game) => (
                    <Link
                      key={game.path}
                      to={game.path}
                      className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive(game.path) ? 'text-yellow-400 bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {game.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to="/earn-balance"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/earn-balance') ? 'text-yellow-400 bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Earn Balance
              </Link>

              <Link
                to="/suggestions"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/suggestions') ? 'text-yellow-400 bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Suggestions
              </Link>

              <Link
                to="/changelog"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/changelog') ? 'text-yellow-400 bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Changelog
              </Link>

              {user ? (
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <div className="px-3 py-2 text-sm text-gray-400">
                    Balance: {formatCurrency(user.balance)}
                  </div>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/analytics"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Analytics
                  </Link>
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-700 pt-4 mt-4 space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;