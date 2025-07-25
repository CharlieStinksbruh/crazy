import React from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Dice1, TrendingUp, Zap, Target, BarChart3, Play, 
  Shield, Code, Gamepad2, Users, Star, ChevronRight,
  Trophy, Gift, Sparkles, Clock, DollarSign, Lock,
  CheckCircle, ArrowRight, Flame, Crown, Rocket,
  Heart, ThumbsUp, Award, Coins, Gem, Lightbulb,
  RotateCcw
} from 'lucide-react';

const Home = () => {
  const { bets, stats } = useGame();
  const { user, formatCurrency } = useAuth();

  const games = [
    {
      name: 'Dice',
      path: '/dice',
      icon: <Dice1 className="w-6 h-6" />,
      description: 'Classic dice game with customizable win chances',
      color: 'from-blue-500 to-purple-600',
      popularity: '★★★★★',
      players: '2.1k'
    },
    {
      name: 'Limbo',
      path: '/limbo',
      icon: <TrendingUp className="w-6 h-6" />,
      description: 'Set your target multiplier and test your luck',
      color: 'from-green-500 to-teal-600',
      popularity: '★★★★☆',
      players: '1.8k'
    },
    {
      name: 'Crash',
      path: '/crash',
      icon: <Zap className="w-6 h-6" />,
      description: 'Watch the multiplier rise and cash out in time',
      color: 'from-red-500 to-pink-600',
      popularity: '★★★★★',
      players: '3.2k'
    },
    {
      name: 'Blackjack',
      path: '/blackjack',
      icon: <Target className="w-6 h-6" />,
      description: 'Classic card game with perfect strategy',
      color: 'from-gray-600 to-gray-800',
      popularity: '★★★★☆',
      players: '1.5k'
    },
    {
      name: 'Plinko',
      path: '/plinko',
      icon: <BarChart3 className="w-6 h-6" />,
      description: 'Drop balls through pegs for random multipliers',
      color: 'from-yellow-500 to-orange-600',
      popularity: '★★★☆☆',
      players: '987'
    },
    {
      name: 'Spin Wheel',
      path: '/spin-wheel',
      icon: <Play className="w-6 h-6" />,
      description: 'Spin the wheel for various multiplier rewards',
      color: 'from-purple-500 to-indigo-600',
      popularity: '★★★★☆',
      players: '1.3k'
    },
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: '100% Safe Demo',
      description: 'No real money involved. Perfect for learning and testing strategies without any financial risk.',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Provably Fair',
      description: 'Transparent algorithms and open-source code ensure every game result is completely fair.',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Advanced Auto-Betting',
      description: 'Sophisticated strategies including Martingale, Fibonacci, and custom betting patterns.',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Real-Time Analytics',
      description: 'Detailed statistics, profit graphs, and performance tracking for all your gaming sessions.',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community Driven',
      description: 'Suggest features, vote on improvements, and help shape the future of the platform.',
      color: 'from-red-400 to-rose-500'
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Educational Focus',
      description: 'Learn probability, game theory, and risk management in a safe environment.',
      color: 'from-indigo-400 to-purple-500'
    },
  ];

  const benefits = [
    { icon: <Gift className="w-5 h-5" />, text: '$1,000 Starting Balance' },
    { icon: <Clock className="w-5 h-5" />, text: 'Instant Account Creation' },
    { icon: <Shield className="w-5 h-5" />, text: 'No Real Money Risk' },
    { icon: <BarChart3 className="w-5 h-5" />, text: 'Advanced Analytics' },
    { icon: <Rocket className="w-5 h-5" />, text: 'Auto-Betting Strategies' },
    { icon: <Crown className="w-5 h-5" />, text: 'Premium Features Free' },
  ];

  const testimonials = [
    {
      name: 'Alex Rodriguez',
      role: 'Strategy Tester',
      avatar: 'A',
      rating: 5,
      text: "The auto-betting features are incredible! I've tested dozens of strategies without risking real money. The Martingale and Fibonacci systems work exactly as expected.",
      highlight: 'Auto-betting features are incredible!'
    },
    {
      name: 'Sarah Chen',
      role: 'Data Analyst',
      avatar: 'S',
      rating: 5,
      text: "The analytics dashboard is a game-changer. Real-time profit graphs, detailed statistics, and streak tracking help me understand my gaming patterns perfectly.",
      highlight: 'Analytics dashboard is a game-changer'
    },
    {
      name: 'Mike Thompson',
      role: 'Probability Student',
      avatar: 'M',
      rating: 5,
      text: "Perfect for learning probability and game theory. The provably fair system and transparent algorithms make this an excellent educational tool.",
      highlight: 'Perfect for learning probability'
    },
    {
      name: 'Emma Wilson',
      role: 'Casino Enthusiast',
      avatar: 'E',
      rating: 5,
      text: "All the excitement of casino games without the financial stress. The variety of games and realistic mechanics make this incredibly engaging.",
      highlight: 'All the excitement without stress'
    }
  ];

  const stats_display = [
    { label: 'Active Players', value: '12,847', icon: <Users className="w-5 h-5" /> },
    { label: 'Games Played', value: '2.3M+', icon: <Gamepad2 className="w-5 h-5" /> },
    { label: 'Strategies Tested', value: '45,692', icon: <Target className="w-5 h-5" /> },
    { label: 'Demo Balance Given', value: '$12.8M', icon: <DollarSign className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-0"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse z-0"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000 z-0"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000 z-0"></div>
          
          {/* Additional animated elements */}
          <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse delay-700 z-0"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse delay-1500 z-0"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Main Headline */}
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-yellow-400 font-semibold text-sm">The Ultimate Demo Casino Experience</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                Master Casino Games
                <br />
                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Risk-Free
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                Experience the thrill of casino gaming with <span className="text-yellow-400 font-semibold">advanced auto-betting</span>, 
                <span className="text-orange-400 font-semibold"> real-time analytics</span>, and 
                <span className="text-red-400 font-semibold"> provably fair algorithms</span> - all without spending a penny.
              </p>
            </div>

            {/* Benefits Bar */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-2">
                  <div className="text-yellow-400 mr-2">{benefit.icon}</div>
                  <span className="text-white text-sm font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {!user ? (
                <>
                  <Link
                    to="/register"
                    className="group relative bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                  >
                    <div className="flex items-center justify-center">
                      <Rocket className="w-6 h-6 mr-2 group-hover:animate-bounce" />
                      Start Playing Free
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                  </Link>
                  <Link
                    to="/login"
                    className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 border border-gray-600 hover:border-gray-500 flex items-center justify-center"
                  >
                    <Play className="w-6 h-6 mr-2" />
                    Demo Login
                  </Link>
                </>
              ) : (
                <Link
                  to="/dice"
                  className="group relative bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  <div className="flex items-center justify-center">
                    <Flame className="w-6 h-6 mr-2 group-hover:animate-pulse" />
                    Continue Playing
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                </Link>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats_display.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2 text-yellow-400">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Earn Balance Highlight Section */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-3xl mt-16 border border-gray-700 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Multiple Ways to <span className="text-yellow-400">Earn Balance</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                CharliesOdds offers various ways to earn virtual balance. Complete tasks, spin the wheel, 
                and level up to increase your playing funds - all without spending real money!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800/80 rounded-xl p-6 border border-gray-700 transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-3">Daily Bonuses</h3>
                <p className="text-gray-300 text-center mb-4">Claim daily rewards that increase as you level up. Higher levels mean bigger bonuses!</p>
                <div className="text-center">
                  <Link to="/earn-balance" className="inline-flex items-center text-yellow-400 hover:text-yellow-300">
                    Learn more <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
              
              <div className="bg-gray-800/80 rounded-xl p-6 border border-gray-700 transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-3">Daily Wheel Spin</h3>
                <p className="text-gray-300 text-center mb-4">Spin the wheel once per day for a chance to win up to $50 in virtual balance.</p>
                <div className="text-center">
                  <Link to="/earn-balance" className="inline-flex items-center text-yellow-400 hover:text-yellow-300">
                    Try your luck <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
              
              <div className="bg-gray-800/80 rounded-xl p-6 border border-gray-700 transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-3">Achievements</h3>
                <p className="text-gray-300 text-center mb-4">Complete achievements to earn rewards. Over 20 achievements with increasing rewards.</p>
                <div className="text-center">
                  <Link to="/profile" className="inline-flex items-center text-yellow-400 hover:text-yellow-300">
                    View achievements <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/earn-balance" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold py-3 px-8 rounded-xl transition-all duration-300 inline-flex items-center">
                <Coins className="w-5 h-5 mr-2" />
                Explore All Earning Methods
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Stats */}
        {user && (
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-8 mb-16 border border-gray-600 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user.username}! 🎉</h2>
              <p className="text-gray-300">Your gaming journey continues...</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center bg-gray-900/50 rounded-xl p-4">
                <div className="text-3xl font-bold text-yellow-400">{stats.totalBets}</div>
                <div className="text-gray-400 text-sm">Total Bets</div>
              </div>
              <div className="text-center bg-gray-900/50 rounded-xl p-4">
                <div className="text-3xl font-bold text-green-400">{stats.totalWins}</div>
                <div className="text-gray-400 text-sm">Wins</div>
              </div>
              <div className="text-center bg-gray-900/50 rounded-xl p-4">
                <div className="text-3xl font-bold text-blue-400">{formatCurrency(stats.totalWagered)}</div>
                <div className="text-gray-400 text-sm">Total Wagered</div>
              </div>
              <div className="text-center bg-gray-900/50 rounded-xl p-4">
                <div className="text-3xl font-bold text-purple-400">{stats.winRate.toFixed(1)}%</div>
                <div className="text-gray-400 text-sm">Win Rate</div>
              </div>
            </div>
          </div>
        )}

        {/* Games Showcase */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your <span className="text-yellow-400">Adventure</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Six unique games, each with advanced features and unlimited possibilities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game, index) => (
              <Link
                key={game.path}
                to={game.path}
                className="group relative bg-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-700 hover:border-gray-600 transition-all duration-500 hover:transform hover:scale-105 overflow-hidden min-h-[280px] flex flex-col"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${game.color} shadow-lg`}>
                      {game.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 text-xs sm:text-sm font-semibold">{game.popularity}</div>
                      <div className="text-gray-400 text-xs">{game.players} playing</div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base flex-grow">{game.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm text-gray-400 flex items-center">
                      <Play className="w-4 h-4 mr-1" />
                      Play Now
                    </span>
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-5 transform -skew-x-12 group-hover:translate-x-full transition-all duration-1000"></div>
              </Link>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose <span className="text-orange-400">CharliesOdds</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We've built the most advanced demo casino platform with features you won't find anywhere else
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105 min-h-[240px] flex flex-col">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base flex-grow">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              What Our <span className="text-green-400">Players</span> Say
            </h2>
            <p className="text-xl text-gray-300">Real feedback from our amazing community</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300 min-h-[200px] flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-gray-900 font-bold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                  <div className="ml-auto flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-gray-300 italic mb-4 leading-relaxed text-sm sm:text-base flex-grow">
                  "{testimonial.text}"
                </blockquote>
                <div className="text-yellow-400 font-semibold text-xs sm:text-sm mt-auto">
                  💡 "{testimonial.highlight}"
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Features Highlight */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-3xl p-12 border border-gray-600 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full opacity-5 transform translate-x-32 -translate-y-32"></div>
            <div className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-4xl font-bold text-white mb-6">
                    Advanced <span className="text-yellow-400">Auto-Betting</span> Strategies
                  </h3>
                  <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                    Test professional gambling strategies with our sophisticated auto-betting system. 
                    Martingale, Fibonacci, Labouchere, and custom patterns - all with real-time profit tracking.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                      <span className="text-white">Infinite betting mode with stop conditions</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                      <span className="text-white">Real-time profit graphs and statistics</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                      <span className="text-white">Custom win/loss behavior settings</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-gray-900 rounded-2xl p-6 border border-gray-600">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white font-semibold">Auto-Bet Active</span>
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Strategy:</span>
                        <span className="text-yellow-400">Martingale</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bets Remaining:</span>
                        <span className="text-white">∞</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Profit:</span>
                        <span className="text-green-400">+$247.50</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-400 to-yellow-400 h-2 rounded-full w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mb-20">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Ready to Master Casino Gaming?
              </h2>
              <p className="text-xl text-gray-800 mb-8 max-w-3xl mx-auto">
                Join thousands of players who are learning, testing, and perfecting their strategies 
                in the safest casino environment ever created.
              </p>
              {!user ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/register"
                    className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center group"
                  >
                    <Crown className="w-6 h-6 mr-2 group-hover:animate-bounce" />
                    Create Free Account
                  </Link>
                  <Link
                    to="/dice"
                    className="bg-white/20 hover:bg-white/30 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 border border-gray-900/20 flex items-center justify-center"
                  >
                    <Play className="w-6 h-6 mr-2" />
                    Try Demo First
                  </Link>
                </div>
              ) : (
                <Link
                  to="/analytics"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 inline-flex items-center group"
                >
                  <BarChart3 className="w-6 h-6 mr-2 group-hover:animate-pulse" />
                  View Your Analytics
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Trust & Safety */}
        <div className="text-center mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-2">100% Safe</h4>
              <p className="text-gray-400 text-sm">No real money gambling</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-2">Open Source</h4>
              <p className="text-gray-400 text-sm">Transparent & provably fair</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-white font-semibold mb-2">Community</h4>
              <p className="text-gray-400 text-sm">Built by players, for players</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;