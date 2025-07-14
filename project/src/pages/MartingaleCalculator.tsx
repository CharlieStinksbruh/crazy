import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, AlertTriangle, Target, CheckCircle, BarChart3, DollarSign, Shield, Zap, Rocket, Crown } from 'lucide-react';

const MartingaleCalculator = () => {
  const [balance, setBalance] = useState(1000);
  const [baseBet, setBaseBet] = useState(10);
  const [winChance, setWinChance] = useState(50);
  const [multiplier, setMultiplier] = useState(2);
  const [results, setResults] = useState<any>(null);

  const calculateMartingale = () => {
    const lossChance = (100 - winChance) / 100;
    const payout = 100 / winChance;
    
    // Calculate maximum loss streak before bankruptcy
    let currentBet = baseBet;
    let totalLoss = 0;
    let streakLength = 0;
    
    while (totalLoss + currentBet <= balance) {
      totalLoss += currentBet;
      streakLength++;
      currentBet *= multiplier;
    }
    
    // Probability calculations
    const bankruptcyProbability = Math.pow(lossChance, streakLength) * 100;
    const survivalProbability = 100 - bankruptcyProbability;
    const expectedProfit = baseBet * (winChance / 100) - baseBet * (lossChance / 100);
    
    // Risk assessment
    let riskLevel = 'Low';
    let riskColor = 'text-green-400';
    if (bankruptcyProbability > 10) {
      riskLevel = 'High';
      riskColor = 'text-red-400';
    } else if (bankruptcyProbability > 5) {
      riskLevel = 'Medium';
      riskColor = 'text-yellow-400';
    }
    
    setResults({
      maxStreak: streakLength,
      bankruptcyProbability: bankruptcyProbability.toFixed(4),
      survivalProbability: survivalProbability.toFixed(4),
      totalRisk: totalLoss,
      expectedProfit: expectedProfit.toFixed(2),
      riskLevel,
      riskColor,
      payout: payout.toFixed(2)
    });
  };

  const recommendations = [
    'Never risk more than 1-2% of your total bankroll on Martingale',
    'Use high win chance games (80%+) for better survival rates',
    'Set strict loss limits before starting any session',
    'Consider flat betting for more sustainable long-term play',
    'Always practice with demo money before risking real funds'
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Martingale Strategy Calculator
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Calculate your bankruptcy risk with the Martingale betting system. Analyze optimal bet sizes, 
              survival probability, and risk management for progressive betting strategies.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="bg-gray-800 px-3 py-1 rounded-full">Martingale Calculator</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">Bankruptcy Risk Analysis</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">Progressive Betting</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">Risk Assessment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Calculator */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center mb-6">
              <Calculator className="w-8 h-8 text-purple-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Martingale Calculator</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Total Bankroll ($)
                </label>
                <input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Base Bet Amount ($)
                </label>
                <input
                  type="number"
                  value={baseBet}
                  onChange={(e) => setBaseBet(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  min="0.01"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Win Chance (%): {winChance}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="95"
                  value={winChance}
                  onChange={(e) => setWinChance(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1%</span>
                  <span>95%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Loss Multiplier: {multiplier}x
                </label>
                <input
                  type="range"
                  min="1.1"
                  max="3"
                  step="0.1"
                  value={multiplier}
                  onChange={(e) => setMultiplier(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1.1x</span>
                  <span>3x</span>
                </div>
              </div>

              <button
                onClick={calculateMartingale}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Risk
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center mb-6">
              <BarChart3 className="w-8 h-8 text-green-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Risk Analysis</h2>
            </div>

            {results ? (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">{results.maxStreak}</div>
                    <div className="text-sm text-gray-400">Max Loss Streak</div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 text-center">
                    <div className={`text-2xl font-bold ${results.riskColor}`}>
                      {results.riskLevel}
                    </div>
                    <div className="text-sm text-gray-400">Risk Level</div>
                  </div>
                </div>

                {/* Probability Analysis */}
                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-3">Probability Analysis</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Bankruptcy Risk:</span>
                      <span className="text-red-400 font-bold">{results.bankruptcyProbability}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Survival Chance:</span>
                      <span className="text-green-400 font-bold">{results.survivalProbability}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total Risk Amount:</span>
                      <span className="text-yellow-400 font-bold">${results.totalRisk}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Expected Payout:</span>
                      <span className="text-blue-400 font-bold">{results.payout}x</span>
                    </div>
                  </div>
                </div>

                {/* Warning */}
                {parseFloat(results.bankruptcyProbability) > 5 && (
                  <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                      <span className="text-red-400 font-bold">High Risk Warning</span>
                    </div>
                    <p className="text-red-300 text-sm">
                      This configuration has a significant bankruptcy risk. Consider reducing bet size or using a different strategy.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calculator className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Configure your parameters and calculate to see detailed risk analysis</p>
              </div>
            )}
          </div>
        </div>

        {/* Educational Content */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Understanding the Martingale Strategy
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <TrendingUp className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">How It Works</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                The Martingale system doubles your bet after each loss, aiming to recover all previous losses plus 
                a profit equal to your original bet when you eventually win.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">The Risks</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                While theoretically profitable, Martingale requires unlimited bankroll and no betting limits. 
                In reality, long losing streaks can quickly exhaust your funds.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <Shield className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Risk Management</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Use strict bankroll limits, high win chance games, and never chase losses beyond your predetermined limits. 
                Consider it a short-term strategy only.
              </p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-16">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Target className="w-8 h-8 text-yellow-400 mr-3" />
              Expert Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {recommendations.slice(0, 3).map((rec, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{rec}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {recommendations.slice(3).map((rec, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Test Martingale Strategy Safely
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto">
            Practice the Martingale strategy with virtual money on CharliesOdds. Test different configurations, 
            track your results, and learn without financial risk.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/dice"
              className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <Zap className="w-6 h-6 mr-2" />
              Try Martingale Strategy
            </Link>
            <Link
              to="/register"
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 border border-gray-700 flex items-center justify-center"
            >
              <Rocket className="w-6 h-6 mr-2" />
              Start Free Demo
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-100">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Risk-Free Testing</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Auto-Betting Tools</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Live Statistics</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Strategy Analysis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MartingaleCalculator;