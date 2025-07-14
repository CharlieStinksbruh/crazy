import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, BarChart3, Target, TrendingUp, CheckCircle, AlertTriangle, Rocket, Crown, Shield, Star } from 'lucide-react';

const CasinoOddsCalculator = () => {
  const [selectedGame, setSelectedGame] = useState('dice');
  const [gameParams, setGameParams] = useState({
    dice: { winChance: 50, betAmount: 10, balance: 1000 },
    roulette: { betType: 'red', betAmount: 10, balance: 1000 },
    slots: { rtp: 96, betAmount: 10, balance: 1000 },
    baccarat: { betType: 'player', betAmount: 10, balance: 1000 }
  });

  const gameData = {
    dice: {
      name: 'Dice Games',
      description: 'Customizable win chances from 1% to 95%',
      calculateOdds: (params: any) => {
        const winChance = params.winChance / 100;
        const payout = 100 / params.winChance;
        const houseEdge = ((1 - winChance) - (winChance * (payout - 1))) * 100;
        const expectedLoss = params.betAmount * (houseEdge / 100);
        return {
          winChance: params.winChance,
          payout: payout.toFixed(2),
          houseEdge: Math.abs(houseEdge).toFixed(2),
          expectedLoss: expectedLoss.toFixed(2),
          sessionsToLose: Math.floor(params.balance / Math.abs(expectedLoss))
        };
      }
    },
    roulette: {
      name: 'Roulette',
      description: 'European and American roulette odds',
      calculateOdds: (params: any) => {
        const odds = {
          red: { winChance: 48.65, payout: 2, houseEdge: 2.7 },
          black: { winChance: 48.65, payout: 2, houseEdge: 2.7 },
          even: { winChance: 48.65, payout: 2, houseEdge: 2.7 },
          odd: { winChance: 48.65, payout: 2, houseEdge: 2.7 },
          single: { winChance: 2.7, payout: 36, houseEdge: 2.7 },
          dozen: { winChance: 32.4, payout: 3, houseEdge: 2.7 }
        };
        const bet = odds[params.betType as keyof typeof odds];
        const expectedLoss = params.betAmount * (bet.houseEdge / 100);
        return {
          winChance: bet.winChance,
          payout: bet.payout.toFixed(2),
          houseEdge: bet.houseEdge.toFixed(2),
          expectedLoss: expectedLoss.toFixed(2),
          sessionsToLose: Math.floor(params.balance / expectedLoss)
        };
      }
    },
    slots: {
      name: 'Slot Machines',
      description: 'RTP-based slot machine analysis',
      calculateOdds: (params: any) => {
        const houseEdge = 100 - params.rtp;
        const expectedLoss = params.betAmount * (houseEdge / 100);
        return {
          winChance: 'Varies',
          payout: 'Varies',
          houseEdge: houseEdge.toFixed(2),
          expectedLoss: expectedLoss.toFixed(2),
          sessionsToLose: Math.floor(params.balance / expectedLoss)
        };
      }
    },
    baccarat: {
      name: 'Baccarat',
      description: 'Player, Banker, and Tie bet analysis',
      calculateOdds: (params: any) => {
        const odds = {
          player: { winChance: 49.32, payout: 2, houseEdge: 1.24 },
          banker: { winChance: 50.68, payout: 1.95, houseEdge: 1.06 },
          tie: { winChance: 9.6, payout: 9, houseEdge: 14.4 }
        };
        const bet = odds[params.betType as keyof typeof odds];
        const expectedLoss = params.betAmount * (bet.houseEdge / 100);
        return {
          winChance: bet.winChance,
          payout: bet.payout.toFixed(2),
          houseEdge: bet.houseEdge.toFixed(2),
          expectedLoss: expectedLoss.toFixed(2),
          sessionsToLose: Math.floor(params.balance / expectedLoss)
        };
      }
    }
  };

  const updateGameParam = (param: string, value: any) => {
    setGameParams(prev => ({
      ...prev,
      [selectedGame]: {
        ...prev[selectedGame as keyof typeof prev],
        [param]: value
      }
    }));
  };

  const currentGame = gameData[selectedGame as keyof typeof gameData];
  const currentParams = gameParams[selectedGame as keyof typeof gameParams];
  const results = currentGame.calculateOdds(currentParams);

  const getHouseEdgeColor = (edge: string) => {
    const edgeNum = parseFloat(edge);
    if (edgeNum < 2) return 'text-green-400';
    if (edgeNum < 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-900 via-blue-900 to-purple-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Casino Odds Calculator
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Calculate house edge, win probability, and expected losses for all major casino games. 
              Compare odds across different games and betting strategies to make informed decisions.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="bg-gray-800 px-3 py-1 rounded-full">Casino Odds</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">House Edge Calculator</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">Game Comparison</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">Expected Value</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Calculator */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center mb-6">
              <Calculator className="w-8 h-8 text-green-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Game Odds Calculator</h2>
            </div>

            {/* Game Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Casino Game
              </label>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="dice">Dice Games</option>
                <option value="roulette">Roulette</option>
                <option value="slots">Slot Machines</option>
                <option value="baccarat">Baccarat</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">{currentGame.description}</p>
            </div>

            {/* Game-specific parameters */}
            <div className="space-y-4 mb-6">
              {selectedGame === 'dice' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Win Chance (%): {currentParams.winChance}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="95"
                    value={currentParams.winChance}
                    onChange={(e) => updateGameParam('winChance', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              {selectedGame === 'roulette' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bet Type
                  </label>
                  <select
                    value={currentParams.betType}
                    onChange={(e) => updateGameParam('betType', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <option value="red">Red/Black</option>
                    <option value="even">Even/Odd</option>
                    <option value="dozen">Dozen</option>
                    <option value="single">Single Number</option>
                  </select>
                </div>
              )}

              {selectedGame === 'slots' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    RTP (%): {currentParams.rtp}%
                  </label>
                  <input
                    type="range"
                    min="85"
                    max="99"
                    value={currentParams.rtp}
                    onChange={(e) => updateGameParam('rtp', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              {selectedGame === 'baccarat' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bet Type
                  </label>
                  <select
                    value={currentParams.betType}
                    onChange={(e) => updateGameParam('betType', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <option value="player">Player</option>
                    <option value="banker">Banker</option>
                    <option value="tie">Tie</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bet Amount ($)
                </label>
                <input
                  type="number"
                  value={currentParams.betAmount}
                  onChange={(e) => updateGameParam('betAmount', Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Total Bankroll ($)
                </label>
                <input
                  type="number"
                  value={currentParams.balance}
                  onChange={(e) => updateGameParam('balance', Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center mb-6">
              <BarChart3 className="w-8 h-8 text-blue-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Odds Analysis</h2>
            </div>

            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">{results.winChance}%</div>
                  <div className="text-sm text-gray-400">Win Chance</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{results.payout}x</div>
                  <div className="text-sm text-gray-400">Payout</div>
                </div>
              </div>

              {/* House Edge */}
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">House Edge</span>
                  <span className={`font-bold text-2xl ${getHouseEdgeColor(results.houseEdge)}`}>
                    {results.houseEdge}%
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">Expected Loss per Bet</span>
                  <span className="text-red-400 font-bold">${results.expectedLoss}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Sessions to Lose Bankroll</span>
                  <span className="text-orange-400 font-bold">{results.sessionsToLose}</span>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-white font-bold mb-3">Risk Assessment</h3>
                {parseFloat(results.houseEdge) < 2 ? (
                  <div className="flex items-center text-green-400">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="text-sm">Low house edge - Good odds for players</span>
                  </div>
                ) : parseFloat(results.houseEdge) < 5 ? (
                  <div className="flex items-center text-yellow-400">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <span className="text-sm">Moderate house edge - Average casino game</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-400">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <span className="text-sm">High house edge - Unfavorable for players</span>
                  </div>
                )}
              </div>

              {/* Game Recommendation */}
              <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-4">
                <h3 className="text-white font-bold mb-2">💡 Pro Tip</h3>
                <p className="text-gray-200 text-sm">
                  {selectedGame === 'dice' && currentParams.winChance > 80 && 
                    "High win chance dice games offer consistent wins but lower payouts. Great for conservative play."}
                  {selectedGame === 'roulette' && currentParams.betType === 'single' && 
                    "Single number bets have high payouts but very low win rates. Consider outside bets for better odds."}
                  {selectedGame === 'slots' && currentParams.rtp > 96 && 
                    "This slot has good RTP. Look for games with 96%+ RTP for better long-term results."}
                  {selectedGame === 'baccarat' && currentParams.betType === 'banker' && 
                    "Banker bet has the lowest house edge in baccarat. Avoid tie bets due to high house edge."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Game Comparison */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Casino Game House Edge Comparison
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Blackjack</h3>
              <div className="text-3xl font-bold text-green-400 mb-2">0.5%</div>
              <p className="text-gray-300 text-sm">With perfect basic strategy</p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Baccarat</h3>
              <div className="text-3xl font-bold text-green-400 mb-2">1.06%</div>
              <p className="text-gray-300 text-sm">Banker bet (best option)</p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Roulette</h3>
              <div className="text-3xl font-bold text-yellow-400 mb-2">2.7%</div>
              <p className="text-gray-300 text-sm">European single zero</p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Slots</h3>
              <div className="text-3xl font-bold text-red-400 mb-2">2-15%</div>
              <p className="text-gray-300 text-sm">Varies by machine and RTP</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Test These Odds Risk-Free
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto">
            Experience all these casino games with realistic odds on CharliesOdds. Practice with virtual money 
            and see how house edge affects your results over time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/register"
              className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <Rocket className="w-6 h-6 mr-2" />
              Start Playing Free
            </Link>
            <Link
              to="/dice"
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 border border-gray-700 flex items-center justify-center"
            >
              <Target className="w-6 h-6 mr-2" />
              Try Dice Game
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-100">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">All Games Available</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Realistic Odds</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Live Statistics</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">No Risk Practice</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasinoOddsCalculator;