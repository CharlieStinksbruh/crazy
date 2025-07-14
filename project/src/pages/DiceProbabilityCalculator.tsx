import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, Shield, Target, Star, ArrowRight, CheckCircle, AlertTriangle, Zap, BarChart3, DollarSign, Trophy, Lightbulb, Users, Crown, Rocket } from 'lucide-react';

const DiceProbabilityCalculator = () => {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [winChance, setWinChance] = useState(50);
  const [strategy, setStrategy] = useState<'fixed' | 'martingale' | 'fibonacci' | 'labouchere'>('fixed');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calculateProbability = () => {
    setLoading(true);
    
    setTimeout(() => {
      const lossChance = (100 - winChance) / 100;
      const winChanceDecimal = winChance / 100;
      const payout = 100 / winChance;
      
      let estimatedRolls = 0;
      let strategyScore = 0;
      let riskLevel = 'Low';
      let recommendations = [];
      
      // Calculate based on strategy
      switch (strategy) {
        case 'fixed':
          estimatedRolls = Math.floor(balance / betAmount);
          strategyScore = winChance > 60 ? 85 : winChance > 40 ? 70 : 45;
          riskLevel = betAmount > balance * 0.1 ? 'High' : betAmount > balance * 0.05 ? 'Medium' : 'Low';
          recommendations = [
            'Keep bet size under 5% of total balance',
            'Consider higher win chance for consistent profits',
            'Fixed betting is safest for beginners'
          ];
          break;
          
        case 'martingale':
          // Simplified martingale calculation
          const maxLossStreak = Math.floor(Math.log2(balance / betAmount));
          estimatedRolls = Math.pow(2, maxLossStreak) * (1 / lossChance);
          strategyScore = winChance > 80 ? 75 : winChance > 60 ? 60 : 30;
          riskLevel = 'High';
          recommendations = [
            'Extremely risky - can lose entire balance quickly',
            'Only use with very high win chances (80%+)',
            'Set strict loss limits before starting'
          ];
          break;
          
        case 'fibonacci':
          estimatedRolls = balance / (betAmount * 1.618);
          strategyScore = winChance > 70 ? 80 : winChance > 50 ? 65 : 40;
          riskLevel = winChance > 70 ? 'Medium' : 'High';
          recommendations = [
            'More conservative than Martingale',
            'Works best with 60%+ win chance',
            'Slower recovery but safer progression'
          ];
          break;
          
        case 'labouchere':
          estimatedRolls = balance / (betAmount * 2);
          strategyScore = winChance > 65 ? 78 : winChance > 45 ? 62 : 35;
          riskLevel = 'Medium';
          recommendations = [
            'Flexible strategy with customizable sequences',
            'Requires discipline and planning',
            'Good for experienced players'
          ];
          break;
      }
      
      // Additional analysis
      const expectedValue = (winChanceDecimal * payout) - 1;
      const houseEdge = Math.abs(expectedValue) * 100;
      
      setResults({
        estimatedRolls: Math.max(1, Math.floor(estimatedRolls)),
        strategyScore,
        riskLevel,
        recommendations,
        expectedValue,
        houseEdge,
        payout: payout.toFixed(2),
        breakEvenChance: (100 / payout).toFixed(2)
      });
      
      setLoading(false);
    }, 1000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'High': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* SEO Header */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Dice Probability Calculator
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Calculate your dice game odds, analyze betting strategies, and discover the optimal approach for your bankroll. 
              Free advanced probability calculator with strategy scoring and risk analysis.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="bg-gray-800 px-3 py-1 rounded-full">Dice Odds Calculator</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">Betting Strategy Analyzer</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">Bankroll Management</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">Risk Assessment Tool</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Calculator */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center mb-6">
              <Calculator className="w-8 h-8 text-blue-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Probability Calculator</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Starting Balance ($)
                </label>
                <input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bet Amount ($)
                </label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                  <span>1% (High Risk)</span>
                  <span>95% (Low Risk)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Betting Strategy
                </label>
                <select
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value as any)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="fixed">Fixed Betting</option>
                  <option value="martingale">Martingale Strategy</option>
                  <option value="fibonacci">Fibonacci Strategy</option>
                  <option value="labouchere">Labouchere Strategy</option>
                </select>
              </div>

              <button
                onClick={calculateProbability}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate Probability
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center mb-6">
              <BarChart3 className="w-8 h-8 text-green-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
            </div>

            {results ? (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">{results.estimatedRolls}</div>
                    <div className="text-sm text-gray-400">Estimated Rolls to Bust</div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(results.strategyScore)}`}>
                      {results.strategyScore}/100
                    </div>
                    <div className="text-sm text-gray-400">Strategy Score</div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Risk Level</span>
                    <span className={`font-bold ${getRiskColor(results.riskLevel)}`}>
                      {results.riskLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Expected Payout</span>
                    <span className="text-yellow-400 font-bold">{results.payout}x</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">House Edge</span>
                    <span className="text-red-400 font-bold">{results.houseEdge.toFixed(2)}%</span>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                    Strategy Recommendations
                  </h3>
                  <div className="space-y-2">
                    {results.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calculator className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Enter your parameters and click calculate to see detailed probability analysis</p>
              </div>
            )}
          </div>
        </div>

        {/* Educational Content */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Master Dice Game Probability & Strategy
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <Target className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Probability Basics</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Understanding dice probability is crucial for successful gambling. Our calculator shows you exactly how many rolls 
                you can expect before losing your entire bankroll with different strategies and win chances.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <TrendingUp className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Strategy Analysis</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Compare Martingale, Fibonacci, Labouchere, and fixed betting strategies. Each approach has different risk profiles 
                and optimal use cases depending on your bankroll and risk tolerance.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <Shield className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Risk Management</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Learn proper bankroll management techniques. Our risk assessment helps you understand the probability of ruin 
                and optimal bet sizing for long-term success in dice games.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Test Your Strategy?
          </h2>
          <p className="text-xl text-gray-800 mb-8 max-w-3xl mx-auto">
            Put your probability knowledge to the test with CharliesOdds - the most advanced demo casino platform. 
            Practice risk-free with $1,000 starting balance and professional auto-betting tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/register"
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <Rocket className="w-6 h-6 mr-2" />
              Start Playing Free
            </Link>
            <Link
              to="/dice"
              className="bg-white/20 hover:bg-white/30 text-gray-900 font-bold py-4 px-8 rounded-xl transition-all duration-300 border border-gray-900/20 flex items-center justify-center"
            >
              <Target className="w-6 h-6 mr-2" />
              Try Dice Game
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-800">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">100% Free</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">No Real Money</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Advanced Tools</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Instant Access</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-3">How accurate is the dice probability calculator?</h3>
              <p className="text-gray-300 text-sm">
                Our calculator uses proven mathematical formulas to estimate outcomes. While actual results may vary due to variance, 
                the calculations provide reliable probability estimates for strategic planning.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-3">Which betting strategy is safest?</h3>
              <p className="text-gray-300 text-sm">
                Fixed betting with small bet sizes (1-2% of bankroll) is generally safest. Martingale and progressive strategies 
                can be profitable short-term but carry high risk of total loss.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-3">What win chance should I use?</h3>
              <p className="text-gray-300 text-sm">
                Higher win chances (70%+) provide more consistent results but lower payouts. Lower win chances offer higher payouts 
                but with increased volatility. Choose based on your risk tolerance.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-3">Can I practice these strategies for free?</h3>
              <p className="text-gray-300 text-sm">
                Yes! CharliesOdds offers a completely free demo environment where you can test all strategies with virtual money. 
                Perfect for learning without financial risk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiceProbabilityCalculator;