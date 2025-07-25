import React, { useState, useEffect } from 'react';
import { Coins, Gift, Clock, Target, Users, Star, Trophy, Zap, CheckCircle, RotateCcw, Play, Calendar, Award, Heart, Gamepad2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  icon: string;
  category: 'daily' | 'gaming' | 'social' | 'special';
  completed: boolean;
  cooldown?: number; // in hours
  lastCompleted?: number;
}

const EarnBalance = () => {
  const { user, updateBalance, formatCurrency } = useAuth();
  const { bets, stats } = useGame();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [spinResult, setSpinResult] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastSpin, setLastSpin] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);

  // Icon mapping
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Calendar': <Calendar className="w-6 h-6" />,
      'RotateCcw': <RotateCcw className="w-6 h-6" />,
      'Play': <Play className="w-6 h-6" />,
      'Target': <Target className="w-6 h-6" />,
      'Zap': <Zap className="w-6 h-6" />,
      'Trophy': <Trophy className="w-6 h-6" />,
      'Star': <Star className="w-6 h-6" />,
      'Award': <Award className="w-6 h-6" />,
      'Gamepad2': <Gamepad2 className="w-6 h-6" />,
      'Users': <Users className="w-6 h-6" />,
      'Heart': <Heart className="w-6 h-6" />,
      'Coins': <Coins className="w-6 h-6" />,
      'Gift': <Gift className="w-6 h-6" />,
      'CheckCircle': <CheckCircle className="w-6 h-6" />
    };
    return iconMap[iconName] || <Star className="w-6 h-6" />;
  };

  // Initialize tasks
  useEffect(() => {
    const savedTasks = localStorage.getItem('charlies-odds-tasks');
    const savedLastSpin = localStorage.getItem('charlies-odds-last-spin');
    
    if (savedLastSpin) {
      setLastSpin(Number(savedLastSpin));
    }

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const defaultTasks: Task[] = [
        // Daily Tasks
        {
          id: 'daily-login',
          title: 'Daily Login Bonus',
          description: 'Log in to CharliesOdds every day',
          reward: 25,
          icon: 'Calendar',
          category: 'daily',
          completed: false,
          cooldown: 24
        },
        {
          id: 'daily-spin',
          title: 'Daily Wheel Spin',
          description: 'Spin the wheel once per day for free money',
          reward: 0, // Variable reward
          icon: 'RotateCcw',
          category: 'daily',
          completed: false,
          cooldown: 24
        },
        {
          id: 'daily-games',
          title: 'Play 10 Games',
          description: 'Play any 10 games across the platform',
          reward: 15,
          icon: 'Play',
          category: 'daily',
          completed: false,
          cooldown: 24
        },
        
        // Gaming Tasks
        {
          id: 'dice-master',
          title: 'Dice Master',
          description: 'Win 5 dice games in a row',
          reward: 50,
          icon: 'Target',
          category: 'gaming',
          completed: false
        },
        {
          id: 'crash-survivor',
          title: 'Crash Survivor',
          description: 'Cash out at 10x multiplier in Crash',
          reward: 75,
          icon: 'Zap',
          category: 'gaming',
          completed: false
        },
        {
          id: 'blackjack-pro',
          title: 'Blackjack Pro',
          description: 'Get 3 blackjacks in one session',
          reward: 40,
          icon: 'Trophy',
          category: 'gaming',
          completed: false
        },
        {
          id: 'plinko-lucky',
          title: 'Plinko Lucky',
          description: 'Hit a 1000x multiplier in Plinko',
          reward: 100,
          icon: 'Star',
          category: 'gaming',
          completed: false
        },
        {
          id: 'limbo-high',
          title: 'Limbo High Roller',
          description: 'Win with a 50x target multiplier',
          reward: 80,
          icon: 'Award',
          category: 'gaming',
          completed: false
        },
        {
          id: 'spin-winner',
          title: 'Spin Winner',
          description: 'Win 10 spins on the Spin Wheel',
          reward: 35,
          icon: 'RotateCcw',
          category: 'gaming',
          completed: false
        },
        {
          id: 'auto-bet-master',
          title: 'Auto-Bet Master',
          description: 'Run 100 auto-bets without going broke',
          reward: 60,
          icon: 'Gamepad2',
          category: 'gaming',
          completed: false
        },
        
        // Social Tasks
        {
          id: 'profile-complete',
          title: 'Complete Your Profile',
          description: 'Fill out all profile information',
          reward: 20,
          icon: 'Users',
          category: 'social',
          completed: false
        },
        {
          id: 'suggestion-submit',
          title: 'Submit a Suggestion',
          description: 'Help improve the platform with feedback',
          reward: 30,
          icon: 'Heart',
          category: 'social',
          completed: false
        },
        {
          id: 'strategy-test',
          title: 'Strategy Tester',
          description: 'Test 3 different betting strategies',
          reward: 45,
          icon: 'Target',
          category: 'social',
          completed: false
        },
        
        // Special Tasks
        {
          id: 'first-week',
          title: 'First Week Milestone',
          description: 'Play for 7 consecutive days',
          reward: 150,
          icon: 'Trophy',
          category: 'special',
          completed: false
        },
        {
          id: 'big-winner',
          title: 'Big Winner',
          description: 'Win $500 in a single session',
          reward: 200,
          icon: 'Coins',
          category: 'special',
          completed: false
        },
        {
          id: 'analytics-viewer',
          title: 'Analytics Enthusiast',
          description: 'View your analytics page 5 times',
          reward: 25,
          icon: 'Star',
          category: 'special',
          completed: false
        },
        {
          id: 'settings-saver',
          title: 'Settings Saver',
          description: 'Save 3 different game configurations',
          reward: 35,
          icon: 'Gift',
          category: 'special',
          completed: false
        },
        {
          id: 'balance-manager',
          title: 'Balance Manager',
          description: 'Maintain positive balance for 24 hours',
          reward: 75,
          icon: 'CheckCircle',
          category: 'special',
          completed: false
        },
        {
          id: 'explorer',
          title: 'Platform Explorer',
          description: 'Visit all 6 games and 5 strategy pages',
          reward: 90,
          icon: 'Zap',
          category: 'special',
          completed: false
        },
        {
          id: 'community-helper',
          title: 'Community Helper',
          description: 'Vote on 10 community suggestions',
          reward: 40,
          icon: 'Heart',
          category: 'special',
          completed: false
        }
      ];
      
      setTasks(defaultTasks);
      localStorage.setItem('charlies-odds-tasks', JSON.stringify(defaultTasks));
    }
  }, []);

  const canSpin = () => {
    if (!lastSpin) return true;
    const now = Date.now();
    const timeSinceLastSpin = now - lastSpin;
    const cooldownTime = 24 * 60 * 60 * 1000; // 24 hours
    return timeSinceLastSpin >= cooldownTime;
  };

  const getTimeUntilNextSpin = () => {
    if (!lastSpin) return null;
    const now = Date.now();
    const timeSinceLastSpin = now - lastSpin;
    const cooldownTime = 24 * 60 * 60 * 1000; // 24 hours
    const timeRemaining = cooldownTime - timeSinceLastSpin;
    
    if (timeRemaining <= 0) return null;
    
    const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
    const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours}h ${minutes}m`;
  };

  const spinWheel = () => {
    if (!canSpin() || !user) return;

    setIsSpinning(true);
    
    // Generate random reward between $1-$50
    const rewards = [1, 2, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    
    // Spin animation
    const spins = 5 + Math.random() * 3; // 5-8 full rotations
    const finalRotation = rotation + (spins * 360);
    setRotation(finalRotation);
    
    setTimeout(() => {
      setSpinResult(randomReward);
      updateBalance(randomReward);
      setLastSpin(Date.now());
      localStorage.setItem('charlies-odds-last-spin', Date.now().toString());
      setIsSpinning(false);
    }, 3000);
  };

  const completeTask = (taskId: string) => {
    if (!user) return;

    // Check if task can actually be completed
    const task = tasks.find(t => t.id === taskId);
    if (!task || !canCompleteTask(task)) return;
    
    // Validate task completion based on actual user data
    const completionData = getTaskCompletionData(task);
    
    if (!completionData.canComplete) {
      // Show message that task requirements aren't met
      alert(`You haven't completed the requirements for "${task.title}" yet. ${completionData.progressText}`);
      return;
    }
    
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId && !t.completed) {
        updateBalance(t.reward);
        return {
          ...t,
          completed: true,
          lastCompleted: Date.now()
        };
      }
      return t;
    });
    
    setTasks(updatedTasks);
    localStorage.setItem('charlies-odds-tasks', JSON.stringify(updatedTasks));
  };

  const getTaskCompletionData = (task: Task) => {
    if (!user) return { canComplete: false, progress: 0, total: 1, progressText: 'Login required' };
    
    let canComplete = false;
    let progress = 0;
    let total = 1;
    let progressText = '';
    
    switch (task.id) {
      case 'daily-login':
        // Check if user logged in today (always true if they're here)
        canComplete = true;
        progress = 1;
        total = 1;
        progressText = 'Completed by logging in today';
        break;
        
      case 'daily-games':
        // Check if user played 10 games today
        const today = new Date().toDateString();
        const todaysBets = bets.filter(bet => 
          new Date(bet.timestamp).toDateString() === today
        );
        progress = todaysBets.length;
        total = 10;
        canComplete = progress >= total;
        progressText = `Play ${total - progress} more games today`;
        break;
        
      case 'dice-master':
        // Check for 5 dice wins in a row
        const diceBets = bets.filter(bet => bet.game === 'Dice').slice(0, 10);
        let consecutiveWins = 0;
        let maxConsecutiveWins = 0;
        for (const bet of diceBets) {
          if (bet.winAmount > bet.betAmount) {
            consecutiveWins++;
            maxConsecutiveWins = Math.max(maxConsecutiveWins, consecutiveWins);
          } else {
            consecutiveWins = 0;
          }
        }
        progress = maxConsecutiveWins;
        total = 5;
        canComplete = progress >= total;
        progressText = `Get ${total - progress} more consecutive dice wins`;
        break;
        
      case 'crash-survivor':
        // Check for 10x cashout in crash
        const crashBets = bets.filter(bet => bet.game === 'Crash');
        const highMultiplierCrash = crashBets.filter(bet => bet.multiplier >= 10);
        progress = highMultiplierCrash.length > 0 ? 1 : 0;
        total = 1;
        canComplete = progress >= total;
        progressText = 'Cash out at 10x multiplier in Crash game';
        break;
        
      case 'blackjack-pro':
        // Check for 3 blackjacks in one session (simplified)
        const blackjackBets = bets.filter(bet => bet.game === 'Blackjack');
        const blackjacks = blackjackBets.filter(bet => bet.multiplier >= 2.5);
        progress = blackjacks.length;
        total = 3;
        canComplete = progress >= total;
        progressText = `Get ${total - progress} more blackjacks`;
        break;
        
      case 'plinko-lucky':
        // Check for 1000x in Plinko
        const plinkoBets = bets.filter(bet => bet.game === 'Plinko');
        const plinko1000x = plinkoBets.filter(bet => bet.multiplier >= 1000);
        progress = plinko1000x.length > 0 ? 1 : 0;
        total = 1;
        canComplete = progress >= total;
        progressText = 'Hit a 1000x multiplier in Plinko';
        break;
        
      case 'limbo-high':
        // Check for 50x win in Limbo
        const limboBets = bets.filter(bet => bet.game === 'Limbo');
        const limbo50x = limboBets.filter(bet => bet.multiplier >= 50);
        progress = limbo50x.length > 0 ? 1 : 0;
        total = 1;
        canComplete = progress >= total;
        progressText = 'Win with a 50x target multiplier in Limbo';
        break;
        
      case 'spin-winner':
        // Check for 10 wins on spin wheel
        const spinBets = bets.filter(bet => bet.game === 'Spin Wheel');
        const spinWins = spinBets.filter(bet => bet.winAmount > bet.betAmount);
        progress = spinWins.length;
        total = 10;
        canComplete = progress >= total;
        progressText = `Win ${total - progress} more spins on the Spin Wheel`;
        break;
        
      case 'auto-bet-master':
        // This would require tracking auto-bet sessions - for now, disable
        progress = 0;
        total = 100;
        canComplete = false;
        progressText = 'Feature coming soon';
        break;
        
      case 'profile-complete':
        // Check if user has filled profile (simplified - just check if they have username and email)
        const profileFields = [user.username, user.email].filter(Boolean);
        progress = profileFields.length;
        total = 2;
        canComplete = progress >= total;
        progressText = 'Complete your profile information';
        break;
        
      case 'suggestion-submit':
        // Check if user has submitted a suggestion
        const suggestions = JSON.parse(localStorage.getItem('charlies-odds-suggestions') || '[]');
        const userSuggestions = suggestions.filter((s: any) => s.author === user.username);
        progress = userSuggestions.length > 0 ? 1 : 0;
        total = 1;
        canComplete = progress >= total;
        progressText = 'Submit a suggestion on the Suggestions page';
        break;
        
      case 'strategy-test':
        // This would require tracking strategy usage - for now, disable
        progress = 0;
        total = 3;
        canComplete = false;
        progressText = 'Feature coming soon';
        break;
        
      case 'first-week':
        // Check if user has been active for 7 days (simplified)
        const accountAge = Date.now() - new Date(user.createdAt).getTime();
        const daysSinceCreation = accountAge / (1000 * 60 * 60 * 24);
        progress = Math.min(Math.floor(daysSinceCreation), 7);
        total = 7;
        canComplete = progress >= total && stats.totalBets >= 50;
        progressText = `${total - progress} more days of activity needed`;
        break;
        
      case 'big-winner':
        // Check for $500 win in single session (simplified - check biggest win)
        progress = Math.min(stats.biggestWin, 500);
        total = 500;
        canComplete = progress >= total;
        progressText = `Win $${total - progress} more in a single bet`;
        break;
        
      case 'analytics-viewer':
        // This would require tracking page views - for now, allow if they have some bets
        progress = Math.min(stats.totalBets, 5);
        total = 5;
        canComplete = progress >= total;
        progressText = `Place ${total - progress} more bets to unlock`;
        break;
        
      case 'settings-saver':
        // Check if user has saved settings
        const savedSettings = JSON.parse(localStorage.getItem('charlies-odds-saved-settings') || '[]');
        const userSettings = savedSettings.filter((s: any) => s.name && s.settings);
        progress = userSettings.length;
        total = 3;
        canComplete = progress >= total;
        progressText = `Save ${total - progress} more game configurations`;
        break;
        
      case 'balance-manager':
        // Check if user has positive balance (simplified)
        progress = user.balance > 1000 ? 1 : 0;
        total = 1;
        canComplete = progress >= total;
        progressText = 'Maintain balance above $1,000';
        break;
        
      case 'explorer':
        // Check if user has played multiple games
        const uniqueGames = new Set(bets.map(bet => bet.game));
        progress = uniqueGames.size;
        total = 4;
        canComplete = progress >= total;
        progressText = `Play ${total - progress} more different games`;
        break;
        
      case 'community-helper':
        // Check if user has voted on suggestions
        const allSuggestions = JSON.parse(localStorage.getItem('charlies-odds-suggestions') || '[]');
        const userVotes = allSuggestions.filter((s: any) => 
          s.userVotes && s.userVotes[user.id]
        );
        progress = userVotes.length;
        total = 5;
        canComplete = progress >= total;
        progressText = `Vote on ${total - progress} more suggestions`;
        break;
        
      default:
        progress = 0;
        total = 1;
        canComplete = false;
        progressText = 'Task not available';
    }
    
    return { canComplete, progress, total, progressText };
  };

  const canCompleteTask = (task: Task) => {
    if (task.completed) {
      if (task.cooldown) {
        if (!task.lastCompleted) return false;
        const now = Date.now();
        const timeSinceCompletion = now - task.lastCompleted;
        const cooldownTime = task.cooldown * 60 * 60 * 1000;
        return timeSinceCompletion >= cooldownTime;
      }
      return false; // Non-cooldown tasks can't be repeated
    }
    return true; // Task not completed yet
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'daily': return 'from-blue-500 to-cyan-500';
      case 'gaming': return 'from-green-500 to-emerald-500';
      case 'social': return 'from-purple-500 to-pink-500';
      case 'special': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const tasksByCategory = {
    daily: tasks.filter(task => task.category === 'daily'),
    gaming: tasks.filter(task => task.category === 'gaming'),
    social: tasks.filter(task => task.category === 'social'),
    special: tasks.filter(task => task.category === 'special')
  };

  return (
    <div className="min-h-screen bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
            Earn Free Balance
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Complete tasks, spin the wheel, and earn free balance to play with. 
            No real money required - just engage with the platform!
          </p>
          {user && (
            <div className="bg-gray-800 rounded-xl p-6 max-w-md mx-auto">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {formatCurrency(user.balance)}
              </div>
              <div className="text-gray-400">Current Balance</div>
            </div>
          )}
        </div>

        {/* Daily Wheel Spin */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-12 border border-gray-700">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-center">
              <RotateCcw className="w-8 h-8 text-yellow-400 mr-3" />
              Daily Wheel Spin
            </h2>
            
            {/* Wheel */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="relative">
                <svg
                  width="200"
                  height="200"
                  className={`transition-transform duration-3000 ease-out`}
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  {/* Wheel segments */}
                  {[1, 2, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((amount, index) => {
                    const angle = (360 / 12) * index;
                    const nextAngle = (360 / 12) * (index + 1);
                    const startAngleRad = (angle * Math.PI) / 180;
                    const endAngleRad = (nextAngle * Math.PI) / 180;
                    
                    const x1 = 100 + 90 * Math.cos(startAngleRad);
                    const y1 = 100 + 90 * Math.sin(startAngleRad);
                    const x2 = 100 + 90 * Math.cos(endAngleRad);
                    const y2 = 100 + 90 * Math.sin(endAngleRad);
                    
                    const pathData = [
                      `M 100 100`,
                      `L ${x1} ${y1}`,
                      `A 90 90 0 0 1 ${x2} ${y2}`,
                      'Z'
                    ].join(' ');
                    
                    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];
                    const color = colors[index % colors.length];
                    
                    return (
                      <g key={index}>
                        <path
                          d={pathData}
                          fill={color}
                          stroke="#1f2937"
                          strokeWidth="2"
                        />
                        <text
                          x={100 + 60 * Math.cos((startAngleRad + endAngleRad) / 2)}
                          y={100 + 60 * Math.sin((startAngleRad + endAngleRad) / 2)}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          ${amount}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
                </div>
              </div>
            </div>
            
            {/* Spin Button */}
            <div className="space-y-4">
              {canSpin() ? (
                <button
                  onClick={spinWheel}
                  disabled={isSpinning || !user}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-600 text-gray-900 font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                >
                  {isSpinning ? 'Spinning...' : 'Spin for Free Money!'}
                </button>
              ) : (
                <div className="text-center">
                  <div className="bg-gray-700 text-white py-4 px-8 rounded-xl">
                    Next spin available in: {getTimeUntilNextSpin()}
                  </div>
                </div>
              )}
              
              {spinResult && (
                <div className="bg-green-600 text-white p-4 rounded-xl">
                  🎉 You won ${spinResult}! 🎉
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tasks by Category */}
        {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 capitalize flex items-center">
              {category === 'daily' && <Clock className="w-6 h-6 mr-2 text-blue-400" />}
              {category === 'gaming' && <Gamepad2 className="w-6 h-6 mr-2 text-green-400" />}
              {category === 'social' && <Users className="w-6 h-6 mr-2 text-purple-400" />}
              {category === 'special' && <Star className="w-6 h-6 mr-2 text-yellow-400" />}
              {category} Tasks
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryTasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-gray-800 rounded-xl p-6 border border-gray-700 ${
                    task.completed ? 'opacity-75' : 'hover:border-gray-600'
                  } transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${getCategoryColor(task.category)}`}>
                      <div className="text-white">
                        {getIcon(task.icon)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-400">
                        {task.id === 'daily-spin' ? '$1-50' : `$${task.reward}`}
                      </div>
                      <div className="text-xs text-gray-400">Reward</div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2">{task.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{task.description}</p>
                  
                  {/* Progress Bar */}
                  {!task.completed && (() => {
                    const completionData = getTaskCompletionData(task);
                    return (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{completionData.progress}/{completionData.total}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((completionData.progress / completionData.total) * 100, 100)}%` }}
                          />
                        </div>
                        {!completionData.canComplete && (
                          <p className="text-xs text-gray-400 mt-1">{completionData.progressText}</p>
                        )}
                      </div>
                    );
                  })()}
                  
                  <div className="flex items-center justify-between">
                    {task.completed ? (
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    ) : (() => {
                      const completionData = getTaskCompletionData(task);
                      const taskCanComplete = canCompleteTask(task);
                      
                      return (
                      <button
                        onClick={() => completeTask(task.id)}
                        disabled={!user || !completionData.canComplete || !taskCanComplete || task.id === 'auto-bet-master' || task.id === 'strategy-test'}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                      >
                        {task.id === 'auto-bet-master' || task.id === 'strategy-test' ? 'Coming Soon' : 'Complete Task'}
                      </button>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Info Section */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-200 mb-6 max-w-3xl mx-auto">
            CharliesOdds is a demo platform where you can learn and practice casino games without real money. 
            Complete tasks to earn virtual balance and explore all our features!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="text-center">
              <Clock className="w-12 h-12 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">Daily Tasks</h3>
              <p className="text-gray-300 text-sm">Login bonuses and daily activities</p>
            </div>
            <div className="text-center">
              <Gamepad2 className="w-12 h-12 text-green-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">Gaming Challenges</h3>
              <p className="text-gray-300 text-sm">Achieve milestones in our games</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">Community Tasks</h3>
              <p className="text-gray-300 text-sm">Engage with the platform features</p>
            </div>
            <div className="text-center">
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">Special Rewards</h3>
              <p className="text-gray-300 text-sm">Unique achievements and bonuses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarnBalance;