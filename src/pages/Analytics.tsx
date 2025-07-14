import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import RecentBets from '../components/RecentBets';

const Analytics = () => {
  const { user, formatCurrency } = useAuth();
  const { bets, stats } = useGame();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Analytics</h1>
          <p className="text-gray-400">Please log in to view your analytics.</p>
        </div>
      </div>
    );
  }

  const profitLoss = stats.totalWon - stats.totalWagered;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
        <p className="text-gray-400">Track your gaming performance and statistics</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Bets</p>
              <p className="text-2xl font-bold text-white">{stats.totalBets}</p>
            </div>
            <Target className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Win Rate</p>
              <p className="text-2xl font-bold text-white">{stats.winRate.toFixed(1)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Wagered</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalWagered)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Profit/Loss</p>
              <p className={`text-2xl font-bold ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(profitLoss)}
              </p>
            </div>
            {profitLoss >= 0 ? (
              <TrendingUp className="w-8 h-8 text-green-400" />
            ) : (
              <TrendingDown className="w-8 h-8 text-red-400" />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bets */}
        <RecentBets bets={bets} formatCurrency={formatCurrency} maxBets={15} />

        {/* Game Statistics */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Game Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Biggest Win</span>
              <span className="text-green-400 font-semibold">{formatCurrency(stats.biggestWin)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Biggest Loss</span>
              <span className="text-red-400 font-semibold">{formatCurrency(Math.abs(stats.biggestLoss))}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Wins</span>
              <span className="text-white font-semibold">{stats.totalWins}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Losses</span>
              <span className="text-white font-semibold">{stats.totalLosses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Average Bet</span>
              <span className="text-white font-semibold">
                {formatCurrency(stats.totalBets > 0 ? (stats.totalWagered / stats.totalBets) : 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Won</span>
              <span className="text-white font-semibold">{formatCurrency(stats.totalWon)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;