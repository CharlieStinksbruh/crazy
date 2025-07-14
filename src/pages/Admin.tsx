import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, Settings, BarChart3, DollarSign, Crown, Trash2, Edit, Plus, Search,
  MessageSquare, Reply, Eye, EyeOff, Save, X, CheckCircle, AlertTriangle, Gamepad2, Gift, Globe,
  ToggleLeft, ToggleRight, Coins, Target, TrendingUp, Zap, RotateCcw, Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  isAdmin: boolean;
  createdAt: string;
  stats: {
    totalBets: number;
    totalWins: number;
    totalLosses: number;
    biggestWin: number;
    biggestLoss: number;
  };
}

interface Suggestion {
  id: number;
  text: string;
  category: string;
  priority: string;
  author: string;
  timestamp: string;
  status: string;
  upvotes: number;
  downvotes: number;
  userVotes: { [userId: string]: 'up' | 'down' };
  adminResponses?: Array<{
    id: string;
    author: string;
    text: string;
    timestamp: string;
  }>;
}

interface GameSettings {
  enabled: boolean;
  minBet: number;
  maxBet: number;
  houseEdge: number;
  customSettings?: any;
}

interface EarnBalanceTask {
  id: string;
  title: string;
  description: string;
  reward: number;
  category: string;
  enabled: boolean;
}

interface SeoSettings {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  twitterCard: string;
}

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [gameSettings, setGameSettings] = useState<{[key: string]: GameSettings}>({});
  const [earnBalanceTasks, setEarnBalanceTasks] = useState<EarnBalanceTask[]>([]);
  const [seoSettings, setSeoSettings] = useState<SeoSettings>({
    title: 'CharliesOdds - Demo Casino Platform',
    description: 'Experience the thrill of casino gaming with advanced auto-betting, real-time analytics, and provably fair algorithms - all without spending a penny.',
    keywords: 'demo casino, free casino games, gambling simulator, betting strategies, risk-free gambling',
    ogImage: 'https://example.com/og-image.jpg',
    twitterCard: 'summary_large_image'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [selectedTask, setSelectedTask] = useState<EarnBalanceTask | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    balance: 0,
    isAdmin: false
  });

  useEffect(() => {
    loadUsers();
    loadSuggestions();
    loadGameSettings();
    loadEarnBalanceTasks();
    loadSeoSettings();
  }, []);

  const loadUsers = () => {
    const savedUsers = localStorage.getItem('charlies-odds-users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  };

  const loadSuggestions = () => {
    const savedSuggestions = localStorage.getItem('charlies-odds-suggestions');
    if (savedSuggestions) {
      setSuggestions(JSON.parse(savedSuggestions));
    }
  };

  const loadGameSettings = () => {
    const savedSettings = localStorage.getItem('charlies-odds-admin-game-settings');
    if (savedSettings) {
      setGameSettings(JSON.parse(savedSettings));
    } else {
      // Default game settings
      const defaultSettings = {
        dice: { enabled: true, minBet: 0.01, maxBet: 1000, houseEdge: 1 },
        limbo: { enabled: true, minBet: 0.01, maxBet: 1000, houseEdge: 1 },
        crash: { enabled: true, minBet: 0.01, maxBet: 1000, houseEdge: 1 },
        blackjack: { enabled: true, minBet: 0.01, maxBet: 1000, houseEdge: 0.5 },
        plinko: { enabled: true, minBet: 0.01, maxBet: 1000, houseEdge: 2 },
        'spin-wheel': { enabled: true, minBet: 0.01, maxBet: 1000, houseEdge: 2 }
      };
      setGameSettings(defaultSettings);
      localStorage.setItem('charlies-odds-admin-game-settings', JSON.stringify(defaultSettings));
    }
  };

  const loadEarnBalanceTasks = () => {
    const savedTasks = localStorage.getItem('charlies-odds-admin-earn-tasks');
    if (savedTasks) {
      setEarnBalanceTasks(JSON.parse(savedTasks));
    } else {
      // Default earn balance tasks
      const defaultTasks = [
        { id: 'daily-login', title: 'Daily Login Bonus', description: 'Log in every day', reward: 25, category: 'daily', enabled: true },
        { id: 'daily-spin', title: 'Daily Wheel Spin', description: 'Spin the wheel once per day', reward: 0, category: 'daily', enabled: true },
        { id: 'play-games', title: 'Play 10 Games', description: 'Play any 10 games', reward: 15, category: 'daily', enabled: true },
        { id: 'dice-master', title: 'Dice Master', description: 'Win 5 dice games in a row', reward: 50, category: 'gaming', enabled: true },
        { id: 'crash-survivor', title: 'Crash Survivor', description: 'Cash out at 10x multiplier', reward: 75, category: 'gaming', enabled: true }
      ];
      setEarnBalanceTasks(defaultTasks);
      localStorage.setItem('charlies-odds-admin-earn-tasks', JSON.stringify(defaultTasks));
    }
  };

  const loadSeoSettings = () => {
    const savedSeoSettings = localStorage.getItem('charlies-odds-seo-settings');
    if (savedSeoSettings) {
      setSeoSettings(JSON.parse(savedSeoSettings));
    }
  };

  const saveUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('charlies-odds-users', JSON.stringify(updatedUsers));
  };

  const saveSuggestions = (updatedSuggestions: Suggestion[]) => {
    setSuggestions(updatedSuggestions);
    localStorage.setItem('charlies-odds-suggestions', JSON.stringify(updatedSuggestions));
  };

  const saveGameSettings = () => {
    localStorage.setItem('charlies-odds-admin-game-settings', JSON.stringify(gameSettings));
  };

  const saveEarnBalanceTasks = () => {
    localStorage.setItem('charlies-odds-admin-earn-tasks', JSON.stringify(earnBalanceTasks));
  };

  const saveSeoSettings = () => {
    localStorage.setItem('charlies-odds-seo-settings', JSON.stringify(seoSettings));
    
    // Update actual meta tags
    document.title = seoSettings.title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', seoSettings.description);
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', seoSettings.keywords);
    
    // Update Open Graph meta tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', seoSettings.title);
    
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', seoSettings.description);
    
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute('content', seoSettings.ogImage);
    
    // Update Twitter Card meta tags
    let twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (!twitterCard) {
      twitterCard = document.createElement('meta');
      twitterCard.setAttribute('name', 'twitter:card');
      document.head.appendChild(twitterCard);
    }
    twitterCard.setAttribute('content', seoSettings.twitterCard);
    
    alert('SEO settings updated and applied to the website!');
  };

  const deleteUser = (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    const updatedUsers = users.filter(u => u.id !== userId);
    saveUsers(updatedUsers);
  };

  const editUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      balance: user.balance,
      isAdmin: user.isAdmin
    });
    setShowEditModal(true);
  };

  const saveUserChanges = () => {
    if (!selectedUser) return;
    const updatedUsers = users.map(u => 
      u.id === selectedUser.id 
        ? { ...u, ...editForm }
        : u
    );
    saveUsers(updatedUsers);
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const addBalance = (userId: string, amount: number) => {
    const updatedUsers = users.map(u => 
      u.id === userId 
        ? { ...u, balance: u.balance + amount }
        : u
    );
    saveUsers(updatedUsers);
  };

  const updateSuggestionStatus = (suggestionId: number, newStatus: string) => {
    const updatedSuggestions = suggestions.map(s =>
      s.id === suggestionId ? { ...s, status: newStatus } : s
    );
    saveSuggestions(updatedSuggestions);
  };

  const addSuggestionReply = () => {
    if (!selectedSuggestion || !replyText.trim()) return;

    const newReply = {
      crash: { enabled: true, minBet: 0.01, maxBet: 1000, houseEdge: 1.5 },
      author: user?.username || 'Admin',
      plinko: { enabled: true, minBet: 0.01, maxBet: 1000, houseEdge: 2.5 },
      'spin-wheel': { enabled: true, minBet: 0.01, maxBet: 1000, houseEdge: 2.2 }
    };

    const updatedSuggestions = suggestions.map(s =>
      s.id === selectedSuggestion.id
        ? {
            ...s,
            adminResponses: [...(s.adminResponses || []), newReply]
          }
        : s
    );

    saveSuggestions(updatedSuggestions);
    setReplyText('');
    setShowSuggestionModal(false);
    setSelectedSuggestion(null);
  };

  const updateGameSetting = (game: string, setting: string, value: any) => {
    setGameSettings(prev => ({
      ...prev,
      [game]: {
        ...prev[game],
        [setting]: value
      }
    }));
  };

  const updateEarnBalanceTask = (taskId: string, updates: Partial<EarnBalanceTask>) => {
    setEarnBalanceTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  const addNewTask = () => {
    if (!selectedTask) return;
    
    const newTask = {
      ...selectedTask,
      id: `task-${Date.now()}`
    };
    
    const updatedTasks = [...earnBalanceTasks, newTask];
    setEarnBalanceTasks(updatedTasks);
    localStorage.setItem('charlies-odds-admin-earn-tasks', JSON.stringify(updatedTasks));
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const deleteTask = (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    const updatedTasks = earnBalanceTasks.filter(task => task.id !== taskId);
    setEarnBalanceTasks(updatedTasks);
    localStorage.setItem('charlies-odds-admin-earn-tasks', JSON.stringify(updatedTasks));
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user?.isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const totalUsers = users.length;
  const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);
  const totalBets = users.reduce((sum, u) => sum + u.stats.totalBets, 0);
  const adminUsers = users.filter(u => u.isAdmin).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <Crown className="w-8 h-8 text-yellow-400 mr-3" />
          Admin Dashboard
        </h1>
        <p className="text-gray-400">Manage users, games, suggestions, and platform settings</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Balance</p>
              <p className="text-2xl font-bold text-white">${totalBalance.toFixed(0)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Bets</p>
              <p className="text-2xl font-bold text-white">{totalBets}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Admin Users</p>
              <p className="text-2xl font-bold text-white">{adminUsers}</p>
            </div>
            <Shield className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 rounded-lg mb-8 border border-gray-700">
        <div className="flex flex-wrap border-b border-gray-700">
          {[
            { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
            { id: 'suggestions', label: 'Suggestions', icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'games', label: 'Games', icon: <Gamepad2 className="w-4 h-4" /> },
            { id: 'earn-balance', label: 'Earn Tasks', icon: <Coins className="w-4 h-4" /> },
            { id: 'seo', label: 'SEO Settings', icon: <Globe className="w-4 h-4" /> }
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

        <div className="p-6">
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
                <h2 className="text-xl font-bold text-white">User Management</h2>
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-64"
                  />
                </div>
              </div>

              {/* Mobile-friendly user list */}
              <div className="space-y-4 md:hidden">
                {filteredUsers.map((u) => (
                  <div key={u.id} className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center">
                          <span className="text-white font-semibold">{u.username}</span>
                          {u.isAdmin && <Crown className="w-4 h-4 text-yellow-400 ml-2" />}
                        </div>
                        <div className="text-gray-400 text-sm">{u.email}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold">${u.balance.toFixed(2)}</div>
                        <div className="text-gray-400 text-xs">{u.stats.totalBets} bets</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4 space-x-2">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editUser(u)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => addBalance(u.id, 100)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        +$100
                      </button>
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm"
                        disabled={u.id === user.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left text-gray-300 py-3">User</th>
                      <th className="text-left text-gray-300 py-3">Email</th>
                      <th className="text-left text-gray-300 py-3">Balance</th>
                      <th className="text-left text-gray-300 py-3">Bets</th>
                      <th className="text-left text-gray-300 py-3">Role</th>
                      <th className="text-left text-gray-300 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-gray-700 hover:bg-gray-700">
                        <td className="py-3 text-white">{u.username}</td>
                        <td className="py-3 text-gray-300">{u.email}</td>
                        <td className="py-3 text-green-400 font-semibold">${u.balance.toFixed(2)}</td>
                        <td className="py-3 text-gray-300">{u.stats.totalBets}</td>
                        <td className="py-3">
                          {u.isAdmin ? (
                            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs flex items-center w-fit">
                              <Crown className="w-3 h-3 mr-1" />
                              Admin
                            </span>
                          ) : (
                            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">User</span>
                          )}
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editUser(u)}
                              className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-sm flex items-center"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => addBalance(u.id, 100)}
                              className="bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded text-sm flex items-center"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              +$100
                            </button>
                            <button
                              onClick={() => deleteUser(u.id)}
                              className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded text-sm"
                              disabled={u.id === user.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Suggestions Tab */}
          {activeTab === 'suggestions' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">Suggestion Management</h2>
              
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="bg-gray-900 rounded-lg p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-sm text-gray-400 capitalize">{suggestion.category}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            suggestion.status === 'open' ? 'bg-gray-600 text-white' :
                            suggestion.status === 'under-review' ? 'bg-yellow-600 text-white' :
                            suggestion.status === 'planned' ? 'bg-blue-600 text-white' :
                            suggestion.status === 'in-progress' ? 'bg-purple-600 text-white' :
                            suggestion.status === 'completed' ? 'bg-green-600 text-white' :
                            'bg-red-600 text-white'
                          }`}>
                            {suggestion.status.replace('-', ' ')}
                          </span>
                        </div>
                        
                        <h3 className="text-white font-semibold mb-2">Suggestion #{suggestion.id}</h3>
                        <p className="text-gray-300 mb-4">{suggestion.text}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>By: {suggestion.author}</span>
                          <span>{new Date(suggestion.timestamp).toLocaleDateString()}</span>
                          <span>👍 {suggestion.upvotes}</span>
                          <span>👎 {suggestion.downvotes}</span>
                        </div>

                        {suggestion.adminResponses && suggestion.adminResponses.length > 0 && (
                          <div className="mt-4 bg-gray-800 rounded-lg p-4">
                            <h4 className="text-yellow-400 font-semibold mb-2">Admin Responses:</h4>
                            {suggestion.adminResponses.map((response) => (
                              <div key={response.id} className="mb-2 last:mb-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-yellow-400 font-semibold text-sm">{response.author}</span>
                                  <span className="text-gray-400 text-xs">
                                    {new Date(response.timestamp).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-gray-200 text-sm">{response.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2 lg:ml-4">
                        <select
                          value={suggestion.status}
                          onChange={(e) => updateSuggestionStatus(suggestion.id, e.target.value)}
                          className="bg-gray-700 border border-gray-600 rounded text-white text-sm px-3 py-2"
                        >
                          <option value="open">Open</option>
                          <option value="under-review">Under Review</option>
                          <option value="planned">Planned</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        
                        <button
                          onClick={() => {
                            setSelectedSuggestion(suggestion);
                            setShowSuggestionModal(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center justify-center"
                        >
                          <Reply className="w-4 h-4 mr-1" />
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Games Tab */}
          {activeTab === 'games' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Game Management</h2>
                <div className="text-sm text-gray-400">
                  Configure game settings and availability
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(gameSettings).map(([gameName, settings]) => (
                  <div key={gameName} className="bg-gray-900 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white capitalize">{gameName.replace('-', ' ')}</h3>
                      <button
                        onClick={() => updateGameSetting(gameName, 'enabled', !settings.enabled)}
                        className={`flex items-center ${settings.enabled ? 'text-green-400' : 'text-red-400'}`}
                      >
                        {settings.enabled ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                        <span className="ml-2 text-sm">{settings.enabled ? 'Enabled' : 'Disabled'}</span>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Minimum Bet ($)
                        </label>
                        <input
                          type="number"
                          value={settings.minBet}
                          onChange={(e) => updateGameSetting(gameName, 'minBet', Number(e.target.value))}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                          min="0.01"
                          step="0.01"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Maximum Bet ($)
                        </label>
                        <input
                          type="number"
                          value={settings.maxBet}
                          onChange={(e) => updateGameSetting(gameName, 'maxBet', Number(e.target.value))}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                          min="1"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          House Edge (%)
                        </label>
                        <input
                          type="number"
                          value={settings.houseEdge}
                          onChange={(e) => updateGameSetting(gameName, 'houseEdge', Number(e.target.value))}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                          min="0"
                          max="50"
                          step="0.1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={saveGameSettings}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Game Settings
                </button>
              </div>
            </div>
          )}

          {/* Earn Balance Tab */}
          {activeTab === 'earn-balance' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Earn Balance Task Management</h2>
                <button
                  onClick={() => {
                    setSelectedTask({
                      id: '',
                      title: '',
                      description: '',
                      reward: 25,
                      category: 'daily',
                      enabled: true
                    });
                    setShowTaskModal(true);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Task
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {earnBalanceTasks.map((task) => (
                  <div key={task.id} className="bg-gray-900 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white">{task.title}</h3>
                      <button
                        onClick={() => updateEarnBalanceTask(task.id, { enabled: !task.enabled })}
                        className={`flex items-center ${task.enabled ? 'text-green-400' : 'text-red-400'}`}
                      >
                        {task.enabled ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                        <span className="ml-2 text-sm">{task.enabled ? 'Enabled' : 'Disabled'}</span>
                      </button>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-4">{task.description}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Reward Amount ($)
                        </label>
                        <input
                          type="number"
                          value={task.reward}
                          onChange={(e) => updateEarnBalanceTask(task.id, { reward: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Category
                        </label>
                        <select
                          value={task.category}
                          onChange={(e) => updateEarnBalanceTask(task.id, { category: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                        >
                          <option value="daily">Daily</option>
                          <option value="gaming">Gaming</option>
                          <option value="social">Social</option>
                          <option value="special">Special</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={saveEarnBalanceTasks}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Task Settings
                </button>
              </div>
            </div>
          )}
          
          {/* SEO Settings Tab */}
          {activeTab === 'seo' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">SEO Settings</h2>
                <div className="text-sm text-gray-400">
                  Configure website metadata for search engines
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 mb-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Globe className="w-5 h-5 text-blue-400 mr-2" />
                  Website Metadata
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Website Title
                    </label>
                    <input
                      type="text"
                      value={seoSettings.title}
                      onChange={(e) => setSeoSettings(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="CharliesOdds - Demo Casino Platform"
                    />
                    <p className="text-xs text-gray-400 mt-1">This appears in browser tabs and search results</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={seoSettings.description}
                      onChange={(e) => setSeoSettings(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 h-20 resize-none"
                      placeholder="Brief description of the website for search engines"
                    />
                    <p className="text-xs text-gray-400 mt-1">Aim for 150-160 characters for optimal display in search results</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Meta Keywords
                    </label>
                    <input
                      type="text"
                      value={seoSettings.keywords}
                      onChange={(e) => setSeoSettings(prev => ({ ...prev, keywords: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="demo casino, free casino games, gambling simulator"
                    />
                    <p className="text-xs text-gray-400 mt-1">Comma-separated keywords relevant to your site</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 mb-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzYjgyZjYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1mYWNlYm9vayI+PHBhdGggZD0iTTE4IDJoLTNhNSA1IDAgMCAwLTUgNXYzSDd2NGgzdjhoNHYtOGgzYTEgMSAwIDAgMCAxLTFWMTBoLTR2LTNoNFYyeiIvPjwvc3ZnPg==" alt="Facebook" className="w-5 h-5 mr-2" />
                  Social Media Cards
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Open Graph Image URL
                    </label>
                    <input
                      type="text"
                      value={seoSettings.ogImage}
                      onChange={(e) => setSeoSettings(prev => ({ ...prev, ogImage: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="https://example.com/og-image.jpg"
                    />
                    <p className="text-xs text-gray-400 mt-1">Image that appears when sharing on social media (1200×630 pixels recommended)</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Twitter Card Type
                    </label>
                    <select
                      value={seoSettings.twitterCard}
                      onChange={(e) => setSeoSettings(prev => ({ ...prev, twitterCard: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="summary">Summary</option>
                      <option value="summary_large_image">Summary with Large Image</option>
                      <option value="app">App</option>
                      <option value="player">Player</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-1">Determines how your content appears when shared on Twitter</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={saveSeoSettings}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save & Apply SEO Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Edit User</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Balance</label>
                <input
                  type="number"
                  value={editForm.balance}
                  onChange={(e) => setEditForm(prev => ({ ...prev, balance: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForm.isAdmin}
                    onChange={(e) => setEditForm(prev => ({ ...prev, isAdmin: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-white">Admin User</span>
                </label>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={saveUserChanges}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suggestion Reply Modal */}
      {showSuggestionModal && selectedSuggestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Reply to Suggestion #{selectedSuggestion.id}</h3>
            
            <div className="bg-gray-900 rounded-lg p-4 mb-4">
              <p className="text-gray-300">{selectedSuggestion.text}</p>
              <p className="text-gray-400 text-sm mt-2">By: {selectedSuggestion.author}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Reply</label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 h-32 resize-none"
                placeholder="Enter your reply..."
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={addSuggestionReply}
                disabled={!replyText.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Send Reply
              </button>
              <button
                onClick={() => {
                  setShowSuggestionModal(false);
                  setReplyText('');
                  setSelectedSuggestion(null);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Edit Modal */}
      {showTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">
              {selectedTask.id ? 'Edit Task' : 'Add New Task'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Task Title</label>
                <input
                  type="text"
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({...selectedTask, title: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={selectedTask.description}
                  onChange={(e) => setSelectedTask({...selectedTask, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 h-20 resize-none"
                  placeholder="Enter task description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Reward Amount ($)
                </label>
                <input
                  type="number"
                  value={selectedTask.reward}
                  onChange={(e) => setSelectedTask({...selectedTask, reward: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={selectedTask.category}
                  onChange={(e) => setSelectedTask({...selectedTask, category: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="daily">Daily</option>
                  <option value="gaming">Gaming</option>
                  <option value="social">Social</option>
                  <option value="special">Special</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTask.enabled}
                    onChange={(e) => setSelectedTask({...selectedTask, enabled: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-white">Enabled</span>
                </label>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={addNewTask}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {selectedTask.id ? 'Save Changes' : 'Add Task'}
              </button>
              <button
                onClick={() => {
                  setShowTaskModal(false);
                  setSelectedTask(null);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;