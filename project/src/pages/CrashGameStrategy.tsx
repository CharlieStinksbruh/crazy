import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, TrendingUp, Shield, Target, Star, ArrowRight, CheckCircle, AlertTriangle, BarChart3, DollarSign, Trophy, Lightbulb, Users, Crown, Rocket, Calculator, Timer } from 'lucide-react';

const CrashGameStrategy = () => {
  const strategies = [
    {
      name: 'Conservative Auto-Cashout',
      multiplier: '1.5x - 2x',
      winRate: '85%',
      risk: 'Low',
      description: 'Consistent small profits with high win rate',
      pros: ['High success rate', 'Low variance', 'Good for beginners'],
      cons: ['Small profits', 'Slow growth', 'Can be boring']
    },
    {
      name: 'Moderate Risk Strategy',
      multiplier: '3x - 5x',
      winRate: '65%',
      risk: 'Medium',
      description: 'Balanced approach for steady growth',
      pros: ['Good profit potential', 'Manageable risk', 'Exciting gameplay'],
      cons: ['Higher variance', 'Requires patience', 'Moderate losses']
    },
    {
      name: 'High Risk High Reward',
      multiplier: '10x+',
      winRate: '25%',
      risk: 'High',
      description: 'Chase big multipliers for massive wins',
      pros: ['Huge profit potential', 'Thrilling experience', 'Quick results'],
      cons: ['Very high risk', 'Frequent losses', 'Emotional stress']
    }
  ];

  const tips = [
    {
      icon: <Timer className="w-6 h-6" />,
      title: 'Set Auto-Cashout',
      description: 'Always use auto-cashout to remove emotion from decisions'
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Bankroll Management',
      description: 'Never bet more than 5% of your total balance per round'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Track Your Stats',
      description: 'Monitor win rates and adjust strategy based on performance'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Know When to Stop',
      description: 'Set profit and loss limits before you start playing'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-900 via-orange-900 to-yellow-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Crash Game Strategy Guide
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Master the art of crash games with proven strategies, optimal cashout timing, and advanced auto-betting techniques. 
              Learn from experts and maximize your winning potential.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="bg-gray-800 px-3 py-1 rounded-full">Crash Game Tips</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">Auto-Cashout Strategy</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">Multiplier Analysis</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">Risk Management</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Strategy Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Proven Crash Game Strategies
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
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{strategy.multiplier}</div>
                    <div className="text-xs text-gray-400">Target Multiplier</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{strategy.winRate}</div>
                    <div className="text-xs text-gray-400">Win Rate</div>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-4">{strategy.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-green-400 font-semibold text-sm mb-1">Pros:</h4>
                    <ul className="text-xs text-gray-300 space-y-1">
                      {strategy.pros.map((pro, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-400 mr-1" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-red-400 font-semibold text-sm mb-1">Cons:</h4>
                    <ul className="text-xs text-gray-300 space-y-1">
                      {strategy.cons.map((con, i) => (
                        <li key={i} className="flex items-center">
                          <AlertTriangle className="w-3 h-3 text-red-400 mr-1" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Tips */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Expert Tips for Crash Games
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

        {/* Advanced Techniques */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Advanced Crash Game Techniques
          </h2>
          
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Zap className="w-6 h-6 text-yellow-400 mr-2" />
                  Martingale in Crash Games
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  The Martingale strategy can be adapted for crash games by doubling your bet after each loss while maintaining 
                  the same cashout multiplier. This works best with conservative multipliers (1.5x-2x).
                </p>
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Example Sequence:</h4>
                  <div className="text-xs text-gray-300 space-y-1">
                    <div>Bet $10 → Cashout at 2x → Win $20 (Profit: $10)</div>
                    <div>Bet $10 → Crash at 1.8x → Lose $10</div>
                    <div>Bet $20 → Cashout at 2x → Win $40 (Total Profit: $10)</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <BarChart3 className="w-6 h-6 text-blue-400 mr-2" />
                  Pattern Recognition
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  While each round is independent, some players track recent multipliers to identify potential patterns. 
                  This is more psychological than mathematical but can help with timing decisions.
                </p>
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Common Observations:</h4>
                  <div className="text-xs text-gray-300 space-y-1">
                    <div>• High multipliers often followed by lower ones</div>
                    <div>• Streaks of low multipliers may precede big ones</div>
                    <div>• Average multiplier over time approaches 2x</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Practice Your Crash Game Strategy
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto">
            Test these strategies risk-free on CharliesOdds. Start with $1,000 virtual balance and master crash games 
            with advanced auto-betting tools and real-time analytics.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/crash"
              className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <Zap className="w-6 h-6 mr-2" />
              Play Crash Game
            </Link>
            <Link
              to="/register"
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 border border-gray-700 flex items-center justify-center"
            >
              <Rocket className="w-6 h-6 mr-2" />
              Create Free Account
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-100">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Auto-Cashout</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Live Statistics</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Strategy Testing</span>
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

export default CrashGameStrategy;