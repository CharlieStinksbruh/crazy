import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Target, TrendingUp, CheckCircle, Star, Rocket, Crown, Calculator, Shield, Users, Zap } from 'lucide-react';

const PlinkoStrategy = () => {
  const strategies = [
    {
      name: 'Conservative Approach',
      description: 'Focus on center slots with moderate multipliers',
      multipliers: '1x - 5x',
      winRate: '70%',
      risk: 'Low',
      tips: [
        'Aim for center slots (1x-2x multipliers)',
        'Use consistent bet sizing',
        'Expect steady, small profits',
        'Good for beginners'
      ]
    },
    {
      name: 'Balanced Strategy',
      description: 'Mix of center and edge targeting',
      multipliers: '0.5x - 26x',
      winRate: '50%',
      risk: 'Medium',
      tips: [
        'Vary drop positions slightly',
        'Accept some losses for bigger wins',
        'Track your overall profit',
        'Adjust based on results'
      ]
    },
    {
      name: 'High Risk High Reward',
      description: 'Chase the edge multipliers',
      multipliers: '0.5x - 1000x',
      winRate: '30%',
      risk: 'High',
      tips: [
        'Target extreme edge slots',
        'Use smaller bet sizes',
        'Expect long losing streaks',
        'One big hit can change everything'
      ]
    }
  ];

  const multiplierDistribution = [
    { position: 'Far Left/Right', multiplier: '1000x', probability: '0.1%', color: 'text-red-400' },
    { position: 'Edge', multiplier: '130x', probability: '0.5%', color: 'text-orange-400' },
    { position: 'Near Edge', multiplier: '26x', probability: '2%', color: 'text-yellow-400' },
    { position: 'Outer', multiplier: '9x', probability: '8%', color: 'text-green-400' },
    { position: 'Mid-Outer', multiplier: '4x', probability: '15%', color: 'text-blue-400' },
    { position: 'Mid', multiplier: '2x', probability: '20%', color: 'text-purple-400' },
    { position: 'Center', multiplier: '1x', probability: '25%', color: 'text-gray-400' },
    { position: 'Low Center', multiplier: '0.5x', probability: '29.4%', color: 'text-red-300' }
  ];

  const tips = [
    {
      title: 'Understand the Physics',
      description: 'Plinko balls follow realistic physics. Each peg bounce is random, but patterns emerge over time.',
      icon: <Target className="w-6 h-6" />
    },
    {
      title: 'Bankroll Management',
      description: 'Never bet more than 1-2% of your total balance per drop. Plinko can be very volatile.',
      icon: <Shield className="w-6 h-6" />
    },
    {
      title: 'Track Your Results',
      description: 'Keep detailed records of which multipliers you hit and your overall profit/loss.',
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      title: 'Use Auto-Drop Wisely',
      description: 'Auto-drop can help remove emotion, but set clear stop-loss and profit targets.',
      icon: <Zap className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-900 via-orange-900 to-red-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Plinko Strategy Guide
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Master the art of Plinko with proven strategies, multiplier analysis, and risk management techniques. 
              Learn how to maximize your chances of hitting those massive edge multipliers.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="bg-gray-800 px-3 py-1 rounded-full">Plinko Strategy</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">Multiplier Analysis</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">Risk Management</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">Physics Understanding</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Strategy Overview */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Plinko Playing Strategies
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {strategies.map((strategy, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{strategy.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    strategy.risk === 'Low' ? 'bg-green-600 text-white' :
                    strategy.risk === 'Medium' ? 'bg-yellow-600 text-white' :
                    'bg-red-600 text-white'
                  }`}>
                    {strategy.risk} Risk
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm mb-4">{strategy.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-400">{strategy.multipliers}</div>
                    <div className="text-xs text-gray-400">Target Range</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">{strategy.winRate}</div>
                    <div className="text-xs text-gray-400">Profit Rate</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold text-sm mb-2">Strategy Tips:</h4>
                  <ul className="text-xs text-gray-300 space-y-1">
                    {strategy.tips.map((tip, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-400 mr-1 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Multiplier Distribution */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Multiplier Distribution Analysis
          </h2>
          
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Slot Probabilities</h3>
                <div className="space-y-3">
                  {multiplierDistribution.map((slot, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-900 rounded-lg p-3">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${slot.color.replace('text-', 'bg-')}`}></div>
                        <span className="text-white font-medium">{slot.position}</span>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${slot.color}`}>{slot.multiplier}</div>
                        <div className="text-xs text-gray-400">{slot.probability}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Expected Value Analysis</h3>
                <div className="bg-gray-900 rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Average Multiplier:</span>
                      <span className="text-yellow-400 font-bold">0.98x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">House Edge:</span>
                      <span className="text-red-400 font-bold">2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Volatility:</span>
                      <span className="text-orange-400 font-bold">Very High</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Max Multiplier:</span>
                      <span className="text-green-400 font-bold">1000x</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600 rounded-lg">
                    <p className="text-blue-200 text-sm">
                      <strong>Key Insight:</strong> While the house edge is only 2%, the extreme volatility means 
                      you can experience long losing streaks before hitting a big multiplier.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Expert Plinko Tips
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tips.map((tip, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex items-start">
                <div className="text-yellow-400 mr-4 mt-1">
                  {tip.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{tip.title}</h3>
                  <p className="text-gray-300 text-sm">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Strategies */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Advanced Plinko Techniques
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <BarChart3 className="w-6 h-6 text-blue-400 mr-2" />
                Martingale Adaptation
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Some players adapt the Martingale system for Plinko by doubling bets after losses. However, 
                this is extremely risky due to Plinko's high volatility.
              </p>
              <div className="bg-red-900/20 border border-red-600 rounded-lg p-3">
                <p className="text-red-200 text-xs">
                  <strong>Warning:</strong> Martingale with Plinko can lead to rapid bankroll depletion. 
                  Only attempt with very small base bets and large bankrolls.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Target className="w-6 h-6 text-green-400 mr-2" />
                Session Management
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Set clear session goals and limits. Plinko's volatility can lead to emotional decisions 
                if you don't have a structured approach.
              </p>
              <div className="space-y-2 text-xs text-gray-300">
                <div>• Set a loss limit (e.g., 20% of bankroll)</div>
                <div>• Set a profit target (e.g., 50% gain)</div>
                <div>• Take breaks every 100 drops</div>
                <div>• Never chase losses with bigger bets</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Master Plinko Strategy
          </h2>
          <p className="text-xl text-gray-800 mb-8 max-w-3xl mx-auto">
            Practice these Plinko strategies risk-free on CharliesOdds. Experience the thrill of chasing 
            1000x multipliers with virtual money and perfect your technique.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/plinko"
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <BarChart3 className="w-6 h-6 mr-2" />
              Play Plinko
            </Link>
            <Link
              to="/register"
              className="bg-white/20 hover:bg-white/30 text-gray-900 font-bold py-4 px-8 rounded-xl transition-all duration-300 border border-gray-900/20 flex items-center justify-center"
            >
              <Rocket className="w-6 h-6 mr-2" />
              Create Free Account
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-800">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Realistic Physics</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">1000x Multipliers</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Auto-Drop Mode</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Risk-Free Practice</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlinkoStrategy;