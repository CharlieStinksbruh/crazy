import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Settings, BarChart3, Trophy, Coins, Calendar, 
  Edit, Save, X, Eye, EyeOff, Gift, Target, Gamepad2,
  Crown, Shield, Star, TrendingUp, DollarSign, Clock,
  Award, Zap, Heart, Users, CheckCircle, AlertCircle,
  Plus, ArrowRight, Flame, Gem, Lightbulb, Rocket
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';

const Profile = () => {
  const { 
    user, 
    formatCurrency, 
    setCurrency, 
    updateBalance, 
    claimDailyBonus, 
    getNextLevelRequirement, 
    getLevelRewards 
  } = useAuth();
  const { stats, bets } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [achievements, setAchievements] = useState<any[]>([]);
  const [dailyBonusClaimed, setDailyBonusClaimed] = useState(false);

  useEffect(() => {
    if (user) {
      setEditForm({
        username: user.username,
        email: user.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      loadAchievements();
      checkDailyBonus();
    }
  }, [user]);

  const checkDailyBonus = () => {
    if (!user) return;
    const today = new Date().toDateString();
    setDailyBonusClaimed(user.lastDailyBonus === today);
  };

  const handleClaimDailyBonus = () => {
    const bonusAmount = claimDailyBonus();
    if (bonusAmount > 0) {
      setDailyBonusClaimed(true);
    }
  };

  const loadAchievements = () => {
    if (!user) return;
    
    // Enhanced achievements system
    const userAchievements = [
      // Betting Achievements
      {
        id: 'first-bet',
        title: 'First Steps',
        description: 'Place your first bet',
        icon: <Target className="w-6 h-6" />,
        unlocked: stats.totalBets > 0,
        progress: Math.min(stats.totalBets, 1),
        maxProgress: 1,
        reward: 10,
        category: 'betting'
      },
      {
        id: 'hundred-bets',
        title: 'Century Club',
        description: 'Place 100 bets',
        icon: <Gamepad2 className="w-6 h-6" />,
        unlocked: stats.totalBets >= 100,
        progress: Math.min(stats.totalBets, 100),
        maxProgress: 100,
        reward: 50,
        category: 'betting'
      },
      {
        id: 'thousand-bets',
        title: 'Betting Veteran',
        description: 'Place 1,000 bets',
        icon: <Trophy className="w-6 h-6" />,
        unlocked: stats.totalBets >= 1000,
        progress: Math.min(stats.totalBets, 1000),
        maxProgress: 1000,
        reward: 200,
        category: 'betting'
      },
      {
        id: 'ten-thousand-bets',
        title: 'Legendary Gambler',
        description: 'Place 10,000 bets',
        icon: <Crown className="w-6 h-6" />,
        unlocked: stats.totalBets >= 10000,
        progress: Math.min(stats.totalBets, 10000),
        maxProgress: 10000,
        reward: 1000,
        category: 'betting'
      },
      
      // Winning Achievements
      {
        id: 'first-win',
        title: 'Beginner\'s Luck',
        description: 'Win your first bet',
        icon: <Star className="w-6 h-6" />,
        unlocked: stats.totalWins > 0,
        progress: Math.min(stats.totalWins, 1),
        maxProgress: 1,
        reward: 15,
        category: 'winning'
      },
      {
        id: 'fifty-wins',
        title: 'Lucky Streak',
        description: 'Win 50 bets',
        icon: <Flame className="w-6 h-6" />,
        unlocked: stats.totalWins >= 50,
        progress: Math.min(stats.totalWins, 50),
        maxProgress: 50,
        reward: 75,
        category: 'winning'
      },
      {
        id: 'high-roller',
        title: 'High Roller',
        description: 'Bet $100 or more in a single bet',
        icon: <DollarSign className="w-6 h-6" />,
        unlocked: false, // Would need to track max bet
        progress: 0,
        maxProgress: 1,
        reward: 50,
        category: 'betting'
      },
      
      // Profit Achievements
      {
        id: 'profitable',
        title: 'In the Green',
        description: 'Achieve $100 total profit',
        icon: <TrendingUp className="w-6 h-6" />,
        unlocked: (stats.totalWon - stats.totalWagered) >= 100,
        progress: Math.max(0, Math.min(stats.totalWon - stats.totalWagered, 100)),
        maxProgress: 100,
        reward: 100,
        category: 'profit'
      },
      {
        id: 'big-profit',
        title: 'Profit Master',
        description: 'Achieve $1,000 total profit',
        icon: <Gem className="w-6 h-6" />,
        unlocked: (stats.totalWon - stats.totalWagered) >= 1000,
        progress: Math.max(0, Math.min(stats.totalWon - stats.totalWagered, 1000)),
        maxProgress: 1000,
        reward: 500,
        category: 'profit'
      },
      
      // Level Achievements
      {
        id: 'level-5',
        title: 'Rising Star',
        description: 'Reach level 5',
        icon: <Rocket className="w-6 h-6" />,
        unlocked: user.level >= 5,
        progress: Math.min(user.level, 5),
        maxProgress: 5,
        reward: 100,
        category: 'level'
      },
      {
        id: 'level-10',
        title: 'Experienced Player',
        description: 'Reach level 10',
        icon: <Award className="w-6 h-6" />,
        unlocked: user.level >= 10,
        progress: Math.min(user.level, 10),
        maxProgress: 10,
        reward: 250,
        category: 'level'
      },
      {
        id: 'level-25',
        title: 'Elite Gambler',
        description: 'Reach level 25',
        icon: <Crown className="w-6 h-6" />,
        unlocked: user.level >= 25,
        progress: Math.min(user.level, 25),
        maxProgress: 25,
        reward: 1000,
        category: 'level'
      },
      
      // Special Achievements
      {
        id: 'daily-player',
        title: 'Daily Dedication',
        description: 'Claim daily bonus 7 days in a row',
        icon: <Calendar className="w-6 h-6" />,
        unlocked: false, // Would need streak tracking
        progress: 0,
        maxProgress: 7,
        reward: 200,
        category: 'special'
      },
      {
        id: 'strategy-master',
        title: 'Strategy Master',
        description: 'Use 5 different betting strategies',
        icon: <Lightbulb className="w-6 h-6" />,
        unlocked: false, // Would need strategy tracking
        progress: 0,
        maxProgress: 5,
        reward: 150,
        category: 'special'
      },
      {
        id: 'explorer',
        title: 'Game Explorer',
        description: 'Play all 6 available games',
        icon: <Gamepad2 className="w-6 h-6" />,
        unlocked: false, // Would need game tracking
        progress: 0,
        maxProgress: 6,
        reward: 100,
        category: 'special'
      }
    ];
    setAchievements(userAchievements);
  };

  const handleSaveProfile = () => {
    // In a real app, this would make an API call
    // For now, just update localStorage
    const users = JSON.parse(localStorage.getItem('charlies-odds-users') || '[]');
    const updatedUsers = users.map((u: any) => {
      if (u.id === user?.id) {
        return {
          ...u,
          username: editForm.username,
          email: editForm.email
        };
      }
      return u;
    });
    localStorage.setItem('charlies-odds-users', JSON.stringify(updatedUsers));
    setIsEditing(false);
  };

  const recentGames = bets.slice(0, 10);
  const favoriteGame = bets.length > 0 ? 
    bets.reduce((acc, bet) => {
      acc[bet.game] = (acc[bet.game] || 0) + 1;
      return acc;
    }, {} as any) : {};
  
  const mostPlayedGame = Object.keys(favoriteGame).length > 0 ? 
    Object.keys(favoriteGame).reduce((a, b) => favoriteGame[a] > favoriteGame[b] ? a : b) : 'None';

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'betting': return 'from-blue-500 to-cyan-500';
      case 'winning': return 'from-green-500 to-emerald-500';
      case 'profit': return 'from-yellow-500 to-orange-500';
      case 'level': return 'from-purple-500 to-pink-500';
      case 'special': return 'from-red-500 to-rose-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Please Log In</h1>
          <p className="text-gray-400 mb-6">You need to be logged in to view your profile.</p>
          <Link
            to="/login"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  const levelRewards = getLevelRewards(user.level);
  const nextLevelXP = getNextLevelRequirement();
  const progressPercentage = (user.experience / nextLevelXP) * 100;

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-2xl p-6 md:p-8 mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center relative">
                <User className="w-8 h-8 md:w-10 md:h-10 text-white" />
                <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {user.level}
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">{user.username}</h1>
                <p className="text-gray-400">{user.email}</p>
                <div className="flex items-center mt-2 space-x-4">
                  {user.isAdmin && (
                    <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs mr-2 flex items-center">
                      <Crown className="w-3 h-3 mr-1" />
                      Admin
                    </span>
                  )}
                  <span className="text-purple-400 font-semibold">
                    {levelRewards.title}
                  </span>
                </div>
                
                {/* Level Progress */}
                <div className="mt-3 max-w-xs">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Level {user.level}</span>
                    <span>{user.experience}/{nextLevelXP} XP</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-yellow-400">
                  {formatCurrency(user.balance)}
                </div>
                <div className="text-gray-400 text-sm">Current Balance</div>
              </div>
              
              {/* Daily Bonus */}
              <div className="text-center">
                <button
                  onClick={handleClaimDailyBonus}
                  disabled={dailyBonusClaimed}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    dailyBonusClaimed 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                  }`}
                >
                  <Gift className="w-4 h-4 inline mr-1" />
                  {dailyBonusClaimed ? 'Claimed Today' : `Claim ${formatCurrency(levelRewards.dailyBonus)}`}
                </button>
                <div className="text-gray-400 text-xs mt-1">Daily Bonus</div>
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <div className="bg-gray-800 rounded-2xl p-6 md:p-8 mb-8 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">Edit Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Currency Preference</label>
                <select
                  value={user.currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="USD">USD ($)</option>
                  <option value="BTC">Bitcoin (₿)</option>
                  <option value="ETH">Ethereum (Ξ)</option>
                  <option value="LTC">Litecoin (Ł)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSaveProfile}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-gray-800 rounded-2xl mb-8 border border-gray-700">
          <div className="flex flex-wrap border-b border-gray-700">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'stats', label: 'Statistics', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
              { id: 'history', label: 'Game History', icon: <Clock className="w-4 h-4" /> },
              { id: 'earn', label: 'Earn Balance', icon: <Gift className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 md:px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-yellow-400 border-b-2 border-yellow-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.icon}
                <span className="ml-2 hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gray-900 rounded-xl p-6 text-center">
                    <Gamepad2 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stats.totalBets}</div>
                    <div className="text-gray-400 text-sm">Total Bets</div>
                  </div>
                  <div className="bg-gray-900 rounded-xl p-6 text-center">
                    <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stats.totalWins}</div>
                    <div className="text-gray-400 text-sm">Total Wins</div>
                  </div>
                  <div className="bg-gray-900 rounded-xl p-6 text-center">
                    <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{formatCurrency(stats.totalWagered)}</div>
                    <div className="text-gray-400 text-sm">Total Wagered</div>
                  </div>
                  <div className="bg-gray-900 rounded-xl p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stats.winRate.toFixed(1)}%</div>
                    <div className="text-gray-400 text-sm">Win Rate</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-900 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Favorite Game:</span>
                        <span className="text-white">{mostPlayedGame}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Biggest Win:</span>
                        <span className="text-green-400">{formatCurrency(stats.biggestWin)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Profit:</span>
                        <span className={stats.totalWon - stats.totalWagered >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {formatCurrency(stats.totalWon - stats.totalWagered)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Level:</span>
                        <span className="text-purple-400">{user.level} ({levelRewards.title})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Daily Bonus:</span>
                        <span className="text-yellow-400">{formatCurrency(levelRewards.dailyBonus)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Level Progress</h3>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Level {user.level}</span>
                        <span className="text-gray-400">Level {user.level + 1}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="text-center text-sm text-gray-400">
                        {user.experience} / {nextLevelXP} XP ({progressPercentage.toFixed(1)}%)
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <h4 className="text-white font-semibold mb-2 flex items-center">
                        <Crown className="w-4 h-4 text-yellow-400 mr-2" />
                        Level {user.level} Benefits
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                          Daily Bonus: {formatCurrency(levelRewards.dailyBonus)}
                        </li>
                        <li className="flex items-center text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                          Title: {levelRewards.title}
                        </li>
                        {user.level >= 5 && (
                          <li className="flex items-center text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                            Bonus XP: +10% from all bets
                          </li>
                        )}
                        {user.level >= 10 && (
                          <li className="flex items-center text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                            Weekly Bonus: {formatCurrency(levelRewards.dailyBonus * 3)}
                          </li>
                        )}
                        {user.level >= 15 && (
                          <li className="flex items-center text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                            VIP Status: Exclusive rewards and features
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === 'stats' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-900 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Betting Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Bets:</span>
                        <span className="text-white">{stats.totalBets}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Wins:</span>
                        <span className="text-green-400">{stats.totalWins}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Losses:</span>
                        <span className="text-red-400">{stats.totalLosses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Win Rate:</span>
                        <span className="text-yellow-400">{stats.winRate.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Financial Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Wagered:</span>
                        <span className="text-white">{formatCurrency(stats.totalWagered)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Won:</span>
                        <span className="text-green-400">{formatCurrency(stats.totalWon)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Net Profit:</span>
                        <span className={stats.totalWon - stats.totalWagered >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {formatCurrency(stats.totalWon - stats.totalWagered)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Average Bet:</span>
                        <span className="text-white">
                          {formatCurrency(stats.totalBets > 0 ? stats.totalWagered / stats.totalBets : 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Game Distribution</h3>
                    <div className="space-y-3">
                      {Object.entries(favoriteGame).length > 0 ? (
                        Object.entries(favoriteGame)
                          .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
                          .map(([game, count], index) => (
                            <div key={game} className="flex justify-between items-center">
                              <span className="text-gray-400">{game}:</span>
                              <div className="flex items-center">
                                <span className="text-white mr-2">{count as number}</span>
                                <div className="w-20 bg-gray-700 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      index === 0 ? 'bg-yellow-400' : 
                                      index === 1 ? 'bg-blue-400' : 
                                      'bg-purple-400'
                                    }`}
                                    style={{ width: `${Math.min(100, ((count as number) / stats.totalBets) * 100)}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="text-gray-400 text-center py-4">No games played yet</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Betting History</h3>
                  
                  {stats.totalBets > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                          <div className="text-xl font-bold text-white">{stats.totalBets}</div>
                          <div className="text-xs text-gray-400">Total Bets</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                          <div className="text-xl font-bold text-green-400">{stats.totalWins}</div>
                          <div className="text-xs text-gray-400">Wins</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                          <div className="text-xl font-bold text-red-400">{stats.totalLosses}</div>
                          <div className="text-xs text-gray-400">Losses</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                          <div className="text-xl font-bold text-yellow-400">{stats.winRate.toFixed(1)}%</div>
                          <div className="text-xs text-gray-400">Win Rate</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-white font-semibold mb-3">Profit/Loss Over Time</h4>
                        <div className="h-40 bg-gray-900 rounded-lg flex items-end justify-between p-2">
                          {/* Simple profit visualization */}
                          <div className="flex-1 h-full flex items-end justify-around">
                            {Array.from({ length: 10 }).map((_, i) => {
                              const height = Math.random() * 80 + 10;
                              return (
                                <div 
                                  key={i} 
                                  className={`w-6 ${height > 50 ? 'bg-green-500' : 'bg-red-500'} rounded-t-sm`}
                                  style={{ height: `${height}%` }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Gamepad2 className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400">No betting history yet</p>
                      <p className="text-gray-500 text-sm">Start playing to see your stats</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Your Achievements</h2>
                  <p className="text-gray-400">Unlock rewards by completing challenges</p>
                </div>
                
                {/* Achievement Categories */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm"
                    onClick={() => {}}
                  >
                    All
                  </button>
                  <button 
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full text-sm"
                    onClick={() => {}}
                  >
                    Betting
                  </button>
                  <button 
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full text-sm"
                    onClick={() => {}}
                  >
                    Winning
                  </button>
                  <button 
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full text-sm"
                    onClick={() => {}}
                  >
                    Profit
                  </button>
                  <button 
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full text-sm"
                    onClick={() => {}}
                  >
                    Level
                  </button>
                  <button 
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full text-sm"
                    onClick={() => {}}
                  >
                    Special
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`bg-gray-900 rounded-xl p-6 border-2 transition-all ${
                        achievement.unlocked 
                          ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/10 to-orange-500/10' 
                          : 'border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${
                          achievement.unlocked ? 'bg-yellow-400 text-gray-900' : 'bg-gray-700 text-gray-400'
                        }`}>
                          {achievement.icon}
                        </div>
                        {achievement.unlocked && (
                          <div className="text-yellow-400 font-bold">+{formatCurrency(achievement.reward)}</div>
                        )}
                      </div>
                      
                      <h3 className={`text-lg font-bold mb-2 ${
                        achievement.unlocked ? 'text-yellow-400' : 'text-white'
                      }`}>
                        {achievement.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-4">{achievement.description}</p>
                      
                      {!achievement.unlocked && achievement.maxProgress > 1 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white">{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {achievement.unlocked && (
                        <div className="flex items-center text-green-400 text-sm">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completed
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Game History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Recent Game History</h2>
                
                {recentGames.length > 0 ? (
                  <div className="space-y-4">
                    {recentGames.map((bet) => {
                      const profit = bet.winAmount - bet.betAmount;
                      const isWin = profit > 0;
                      
                      return (
                        <div key={bet.id} className="bg-gray-900 rounded-xl p-4 md:p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                            <div className="flex items-center space-x-4">
                              <div className={`p-3 rounded-xl ${isWin ? 'bg-green-600' : 'bg-red-600'}`}>
                                <Gamepad2 className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-white">{bet.game}</h3>
                                <p className="text-gray-400 text-sm">
                                  {bet.timestamp.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
                              <div className="text-center md:text-right">
                                <div className="text-white font-semibold">Bet: {formatCurrency(bet.betAmount)}</div>
                                <div className="text-gray-400 text-sm">
                                  {bet.multiplier > 0 ? `${bet.multiplier.toFixed(2)}x` : 'No multiplier'}
                                </div>
                              </div>
                              
                              <div className="text-center md:text-right">
                                <div className={`text-lg font-bold ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                                  {isWin ? '+' : ''}{formatCurrency(profit)}
                                </div>
                                <div className="text-gray-400 text-sm">
                                  {isWin ? 'Win' : 'Loss'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No Games Played Yet</h3>
                    <p className="text-gray-500 mb-6">Start playing to see your game history here!</p>
                    <Link
                      to="/dice"
                      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                      Play Your First Game
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Earn Balance Tab */}
            {activeTab === 'earn' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">Earn Free Balance</h2>
                  <p className="text-gray-400 mb-8">Complete tasks and activities to earn virtual money for playing!</p>
                </div>

                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 md:p-8 text-center">
                  <Gift className="w-16 h-16 text-gray-900 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">How Earning Works</h3>
                  <p className="text-gray-800 mb-6 max-w-2xl mx-auto">
                    CharliesOdds is a demo platform where you can earn virtual balance through various activities. 
                    No real money is involved - it's all about learning and having fun!
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/20 rounded-xl p-4">
                      <Calendar className="w-8 h-8 text-gray-900 mx-auto mb-2" />
                      <h4 className="font-bold text-gray-900 mb-1">Daily Tasks</h4>
                      <p className="text-gray-800 text-sm">Login bonuses and daily activities</p>
                    </div>
                    <div className="bg-white/20 rounded-xl p-4">
                      <Gamepad2 className="w-8 h-8 text-gray-900 mx-auto mb-2" />
                      <h4 className="font-bold text-gray-900 mb-1">Gaming Challenges</h4>
                      <p className="text-gray-800 text-sm">Achieve milestones in games</p>
                    </div>
                    <div className="bg-white/20 rounded-xl p-4">
                      <Users className="w-8 h-8 text-gray-900 mx-auto mb-2" />
                      <h4 className="font-bold text-gray-900 mb-1">Community Tasks</h4>
                      <p className="text-gray-800 text-sm">Engage with platform features</p>
                    </div>
                    <div className="bg-white/20 rounded-xl p-4">
                      <Star className="w-8 h-8 text-gray-900 mx-auto mb-2" />
                      <h4 className="font-bold text-gray-900 mb-1">Special Rewards</h4>
                      <p className="text-gray-800 text-sm">Unique achievements and bonuses</p>
                    </div>
                  </div>

                  <Link
                    to="/earn-balance"
                    className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center"
                  >
                    <Coins className="w-6 h-6 mr-2" />
                    Start Earning Now
                  </Link>
                </div>

                {/* Level Benefits */}
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Crown className="w-6 h-6 text-yellow-400 mr-2" />
                    Level Benefits
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="py-3 text-left text-gray-300">Level</th>
                          <th className="py-3 text-left text-gray-300">Title</th>
                          <th className="py-3 text-left text-gray-300">Daily Bonus</th>
                          <th className="py-3 text-left text-gray-300">Special Benefits</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className={`border-b border-gray-700 ${user.level === 1 ? 'bg-gray-800/50' : ''}`}>
                          <td className="py-3 text-white">1</td>
                          <td className="py-3 text-white">Novice Gambler</td>
                          <td className="py-3 text-yellow-400">{formatCurrency(25)}</td>
                          <td className="py-3 text-gray-400">Basic features</td>
                        </tr>
                        <tr className={`border-b border-gray-700 ${user.level === 5 ? 'bg-gray-800/50' : ''}`}>
                          <td className="py-3 text-white">5</td>
                          <td className="py-3 text-white">Experienced Player</td>
                          <td className="py-3 text-yellow-400">{formatCurrency(45)}</td>
                          <td className="py-3 text-gray-400">+10% XP from bets</td>
                        </tr>
                        <tr className={`border-b border-gray-700 ${user.level === 10 ? 'bg-gray-800/50' : ''}`}>
                          <td className="py-3 text-white">10</td>
                          <td className="py-3 text-white">High Roller</td>
                          <td className="py-3 text-yellow-400">{formatCurrency(70)}</td>
                          <td className="py-3 text-gray-400">Weekly bonus ({formatCurrency(70 * 3)})</td>
                        </tr>
                        <tr className={`border-b border-gray-700 ${user.level === 15 ? 'bg-gray-800/50' : ''}`}>
                          <td className="py-3 text-white">15</td>
                          <td className="py-3 text-white">VIP Player</td>
                          <td className="py-3 text-yellow-400">{formatCurrency(95)}</td>
                          <td className="py-3 text-gray-400">VIP exclusive features</td>
                        </tr>
                        <tr className={`border-b border-gray-700 ${user.level === 25 ? 'bg-gray-800/50' : ''}`}>
                          <td className="py-3 text-white">25</td>
                          <td className="py-3 text-white">Elite Gambler</td>
                          <td className="py-3 text-yellow-400">{formatCurrency(145)}</td>
                          <td className="py-3 text-gray-400">Elite rewards & bonuses</td>
                        </tr>
                        <tr className={`${user.level === 50 ? 'bg-gray-800/50' : ''}`}>
                          <td className="py-3 text-white">50</td>
                          <td className="py-3 text-white">Luck Legend</td>
                          <td className="py-3 text-yellow-400">{formatCurrency(270)}</td>
                          <td className="py-3 text-gray-400">Legendary status & max benefits</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 bg-blue-900/20 border border-blue-600 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Lightbulb className="w-5 h-5 text-blue-400 mr-2" />
                      <span className="text-blue-400 font-bold">How to Level Up</span>
                    </div>
                    <p className="text-blue-300 text-sm">
                      Earn XP by placing bets (1 XP per $10 bet), completing achievements, and participating in daily activities. 
                      Higher levels unlock better daily bonuses and exclusive features!
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-900 rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Daily Wheel Spin</h3>
                    <p className="text-gray-400 text-sm mb-4">Spin once per day for $1-$50</p>
                    <div className="text-2xl font-bold text-yellow-400">$1-50</div>
                  </div>

                  <div className="bg-gray-900 rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Gaming Achievements</h3>
                    <p className="text-gray-400 text-sm mb-4">Complete game challenges</p>
                    <div className="text-2xl font-bold text-yellow-400">$10-200</div>
                  </div>

                  <div className="bg-gray-900 rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Community Tasks</h3>
                    <p className="text-gray-400 text-sm mb-4">Engage with the platform</p>
                    <div className="text-2xl font-bold text-yellow-400">$20-150</div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Link
                    to="/earn-balance"
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    View All Earning Opportunities
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;