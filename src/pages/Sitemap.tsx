import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Gamepad2, BarChart3, User, Settings, Calculator, Target, TrendingUp, Shield, Crown } from 'lucide-react';

const Sitemap = () => {
  const siteStructure = [
    {
      category: 'Main Pages',
      icon: <Home className="w-5 h-5" />,
      pages: [
        { name: 'Home', path: '/', description: 'Welcome to CharliesOdds demo casino' },
        { name: 'Login', path: '/login', description: 'Sign in to your account' },
        { name: 'Register', path: '/register', description: 'Create a new account' },
        { name: 'Profile', path: '/profile', description: 'Manage your account settings' },
        { name: 'Analytics', path: '/analytics', description: 'View your gaming statistics' },
        { name: 'Changelog', path: '/changelog', description: 'Latest updates and features' },
        { name: 'Suggestions', path: '/suggestions', description: 'Submit feedback and suggestions' },
        { name: 'Admin', path: '/admin', description: 'Admin panel (admin users only)' }
      ]
    },
    {
      category: 'Casino Games',
      icon: <Gamepad2 className="w-5 h-5" />,
      pages: [
        { name: 'Dice Game', path: '/dice', description: 'Classic dice game with customizable odds' },
        { name: 'Limbo', path: '/limbo', description: 'Set target multipliers and test your luck' },
        { name: 'Crash', path: '/crash', description: 'Watch multipliers rise and cash out in time' },
        { name: 'Blackjack', path: '/blackjack', description: 'Classic card game with perfect strategy' },
        { name: 'Plinko', path: '/plinko', description: 'Drop balls through pegs for random multipliers' },
        { name: 'Spin Wheel', path: '/spin-wheel', description: 'Spin for various multiplier rewards' }
      ]
    },
    {
      category: 'Strategy Guides & Tools',
      icon: <Calculator className="w-5 h-5" />,
      pages: [
        { name: 'Dice Probability Calculator', path: '/dice-probability-calculator', description: 'Calculate dice game odds and strategy scores' },
        { name: 'Crash Game Strategy', path: '/crash-game-strategy', description: 'Master crash game techniques and timing' },
        { name: 'Martingale Calculator', path: '/martingale-calculator', description: 'Analyze Martingale strategy risks and rewards' },
        { name: 'Blackjack Basic Strategy', path: '/blackjack-basic-strategy', description: 'Complete basic strategy charts and tips' },
        { name: 'Casino Odds Calculator', path: '/casino-odds-calculator', description: 'Compare house edge across all casino games' },
        { name: 'Plinko Strategy Guide', path: '/plinko-strategy', description: 'Multiplier analysis and risk management' }
      ]
    }
  ];

  const totalPages = siteStructure.reduce((total, category) => total + category.pages.length, 0);

  return (
    <div className="min-h-screen bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
            CharliesOdds Sitemap
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Complete navigation guide to all pages and features on CharliesOdds. 
            Explore our demo casino games, strategy guides, and analytical tools.
          </p>
          <div className="flex justify-center items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center">
              <Crown className="w-4 h-4 mr-2 text-yellow-400" />
              <span>{totalPages} Total Pages</span>
            </div>
            <div className="flex items-center">
              <Gamepad2 className="w-4 h-4 mr-2 text-green-400" />
              <span>6 Casino Games</span>
            </div>
            <div className="flex items-center">
              <Calculator className="w-4 h-4 mr-2 text-blue-400" />
              <span>6 Strategy Tools</span>
            </div>
          </div>
        </div>

        {/* Site Structure */}
        <div className="space-y-12">
          {siteStructure.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <div className="flex items-center mb-8">
                <div className="text-yellow-400 mr-3">
                  {category.icon}
                </div>
                <h2 className="text-2xl font-bold text-white">{category.category}</h2>
                <span className="ml-4 bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                  {category.pages.length} pages
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.pages.map((page, pageIndex) => (
                  <Link
                    key={pageIndex}
                    to={page.path}
                    className="group bg-gray-900 rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-all duration-300 hover:transform hover:scale-105"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
                        {page.name}
                      </h3>
                      <div className="text-gray-400 group-hover:text-yellow-400 transition-colors">
                        →
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                      {page.description}
                    </p>
                    <div className="mt-4 text-xs text-gray-500 font-mono">
                      {page.path}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
            <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">100% Safe Demo</h3>
            <p className="text-gray-300 text-sm">
              All games use virtual money. No real gambling or financial risk involved.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
            <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Educational Focus</h3>
            <p className="text-gray-300 text-sm">
              Learn probability, strategy, and risk management in a safe environment.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
            <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Advanced Analytics</h3>
            <p className="text-gray-300 text-sm">
              Comprehensive statistics and strategy analysis tools for serious players.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Explore CharliesOdds Today
            </h3>
            <p className="text-gray-800 mb-6 max-w-2xl mx-auto">
              Start with any page that interests you. All features are free and designed to help you 
              understand casino games and probability theory.
            </p>
            <Link
              to="/"
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;