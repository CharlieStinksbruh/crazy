import React from 'react';
import { Calendar, Plus, Bug, Zap, Shield, Palette } from 'lucide-react';

const Changelog = () => {
  const updates = [
    {
      version: '1.8.0',
      date: '2025-01-15',
      type: 'major',
      changes: [
        { type: 'feature', text: 'Fixed Limbo random number generation for truly random results' },
        { type: 'feature', text: 'Added comprehensive auto-betting features to all games' },
        { type: 'feature', text: 'Implemented infinite bet mode across all games' },
        { type: 'feature', text: 'Added instant bet options to skip animations' },
        { type: 'feature', text: 'Enhanced session statistics tracking for all games' },
        { type: 'feature', text: 'Added profit tracking and streak counters' },
        { type: 'improvement', text: 'Fixed layout jumping issues with WIN/LOSE messages' },
        { type: 'improvement', text: 'Enhanced random number generation using crypto.getRandomValues' },
        { type: 'improvement', text: 'Improved visual consistency across all games' },
        { type: 'fix', text: 'Fixed Suggestions page undefined variable errors' },
        { type: 'fix', text: 'Resolved duplicate variable declarations in Dice game' }
      ]
    },
    {
      version: '1.7.0',
      date: '2025-01-14',
      type: 'major',
      changes: [
        { type: 'feature', text: 'Completely redesigned Suggestions page with proper functionality' },
        { type: 'feature', text: 'Added voting system for community suggestions' },
        { type: 'feature', text: 'Implemented persistent storage for suggestions and votes' },
        { type: 'feature', text: 'Enhanced live profit graph with professional design' },
        { type: 'feature', text: 'Added multiplier-based betting system to Dice game' },
        { type: 'feature', text: 'Implemented advanced roll type switching with customizable conditions' },
        { type: 'improvement', text: 'Improved graph visualization with grid lines and proper scaling' },
        { type: 'improvement', text: 'Added quick preset buttons for common multipliers' },
        { type: 'improvement', text: 'Enhanced visual feedback throughout all interfaces' }
      ]
    },
    {
      version: '1.6.0',
      date: '2025-01-13',
      type: 'major',
      changes: [
        { type: 'feature', text: 'Redesigned dice game with simple arrow indicator' },
        { type: 'feature', text: 'Added comprehensive advanced autobet options' },
        { type: 'feature', text: 'Implemented Martingale, Fibonacci, and Labouchere strategies' },
        { type: 'feature', text: 'Added stop conditions and bet management controls' },
        { type: 'improvement', text: 'Enhanced navigation bar ordering and spacing' },
        { type: 'fix', text: 'Fixed dice randomization to use true random numbers' },
        { type: 'fix', text: 'Fixed balance deduction and profit calculations' }
      ]
    },
    {
      version: '1.5.0',
      date: '2025-01-10',
      type: 'major',
      changes: [
        { type: 'feature', text: 'Enhanced admin panel with comprehensive user management' },
        { type: 'feature', text: 'Added game customization options for all games' },
        { type: 'feature', text: 'Implemented site-wide configuration settings' },
        { type: 'feature', text: 'Added live profit graph with reset functionality' },
        { type: 'improvement', text: 'Increased starting balance to $1,000 for new users' },
        { type: 'improvement', text: 'Redesigned dice game with 3D visualization' }
      ]
    },
    {
      version: '1.4.0',
      date: '2025-01-05',
      type: 'minor',
      changes: [
        { type: 'feature', text: 'Added Plinko game with realistic physics' },
        { type: 'feature', text: 'Implemented Spin Wheel game with customizable segments' },
        { type: 'feature', text: 'Added user analytics dashboard' },
        { type: 'improvement', text: 'Enhanced mobile responsiveness across all games' }
      ]
    },
    {
      version: '1.3.0',
      date: '2024-12-28',
      type: 'minor',
      changes: [
        { type: 'feature', text: 'Added Blackjack game with dealer AI' },
        { type: 'feature', text: 'Implemented Crash game with multiplier betting' },
        { type: 'feature', text: 'Added user profile management' },
        { type: 'security', text: 'Enhanced authentication system' }
      ]
    },
    {
      version: '1.2.0',
      date: '2024-12-20',
      type: 'minor',
      changes: [
        { type: 'feature', text: 'Added Limbo game with unlimited multipliers' },
        { type: 'feature', text: 'Implemented live statistics tracking' },
        { type: 'improvement', text: 'Improved game loading performance' }
      ]
    },
    {
      version: '1.1.0',
      date: '2024-12-15',
      type: 'minor',
      changes: [
        { type: 'feature', text: 'Added Dice game with customizable win chances' },
        { type: 'feature', text: 'Implemented user registration and login' },
        { type: 'feature', text: 'Added balance management system' }
      ]
    },
    {
      version: '1.0.0',
      date: '2024-12-10',
      type: 'major',
      changes: [
        { type: 'feature', text: 'Initial release of CharliesOdds platform' },
        { type: 'feature', text: 'Basic user authentication system' },
        { type: 'feature', text: 'Responsive design with Tailwind CSS' }
      ]
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature':
        return <Plus className="w-4 h-4 text-green-500" />;
      case 'fix':
        return <Bug className="w-4 h-4 text-red-500" />;
      case 'improvement':
        return <Zap className="w-4 h-4 text-blue-500" />;
      case 'security':
        return <Shield className="w-4 h-4 text-purple-500" />;
      default:
        return <Palette className="w-4 h-4 text-gray-500" />;
    }
  };

  const getVersionBadgeColor = (type: string) => {
    switch (type) {
      case 'major':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'minor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'patch':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Changelog
          </h1>
          <p className="text-gray-400 text-lg">
            Track all updates, improvements, and new features added to CharliesOdds
          </p>
        </div>

        <div className="space-y-8">
          {updates.map((update, index) => (
            <div key={update.version} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getVersionBadgeColor(update.type)}`}>
                      v{update.version}
                    </span>
                    <span className="text-2xl font-bold text-white">
                      Version {update.version}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{update.date}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  {update.changes.map((change, changeIndex) => (
                    <div key={changeIndex} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getTypeIcon(change.type)}
                      </div>
                      <span className="text-gray-300 leading-relaxed">
                        {change.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-xl font-semibold mb-2 text-white">Stay Updated</h3>
            <p className="text-gray-400">
              We're constantly working on new features and improvements. Check back regularly for the latest updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Changelog;