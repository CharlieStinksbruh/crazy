import React from 'react';
import { BarChart3, RefreshCw, Clock, Zap } from 'lucide-react';

interface LiveStatsProps {
  sessionStats: {
    totalBets: number;
    wins: number;
    losses: number;
    currentStreak: number;
    longestWinStreak: number;
    longestLossStreak: number;
    isWinStreak: boolean;
  };
  sessionProfit: number;
  profitHistory: { value: number; bet: number; timestamp?: number }[];
  onReset: () => void;
  formatCurrency: (amount: number) => string;
  startTime?: number;
  betsPerSecond?: number;
}

const LiveStats: React.FC<LiveStatsProps> = ({
  sessionStats,
  sessionProfit,
  profitHistory,
  onReset,
  formatCurrency,
  startTime,
  betsPerSecond = 0
}) => {
  const getElapsedTime = () => {
    if (!startTime) return '00:00';
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Enhanced profit graph component
  const ProfitGraph = () => {
    const values = profitHistory.map(p => p.value);
    const maxProfit = Math.max(...values, 10);
    const minProfit = Math.min(...values, -10);
    const range = maxProfit - minProfit || 20;
    const width = 100;
    const height = 100;
    
    return (
      <div className="relative h-40 bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
        <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Zero line */}
          <line 
            x1="0" 
            y1={height - ((0 - minProfit) / range) * height} 
            x2={width} 
            y2={height - ((0 - minProfit) / range) * height}
            stroke="#6b7280" 
            strokeWidth="1" 
            strokeDasharray="2,2"
            opacity="0.7"
          />
          
          {/* Profit line */}
          <polyline
            fill="none"
            stroke={sessionProfit >= 0 ? "#10b981" : "#ef4444"}
            strokeWidth="1.5"
            points={profitHistory.map((point, index) => 
              `${(index / Math.max(profitHistory.length - 1, 1)) * width},${height - ((point.value - minProfit) / range) * height}`
            ).join(' ')}
          />
          
          {/* Current point */}
          {profitHistory.length > 1 && (
            <circle
              cx={(profitHistory.length - 1) / Math.max(profitHistory.length - 1, 1) * width}
              cy={height - ((sessionProfit - minProfit) / range) * height}
              r="1.5"
              fill={sessionProfit >= 0 ? "#10b981" : "#ef4444"}
            />
          )}
        </svg>
        
        {/* Labels */}
        <div className="absolute top-2 left-2 text-xs font-semibold bg-gray-800 px-2 py-1 rounded">
          <span className={sessionProfit >= 0 ? 'text-green-400' : 'text-red-400'}>
            {formatCurrency(sessionProfit)}
          </span>
        </div>
        <div className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
          Max: {formatCurrency(maxProfit)}
        </div>
        <div className="absolute bottom-2 left-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
          Min: {formatCurrency(minProfit)}
        </div>
        <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
          {profitHistory.length - 1} bets
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Live Statistics & Profit Graph
        </h3>
        <div className="flex items-center space-x-2">
          {startTime && (
            <div className="flex items-center text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
              <Clock className="w-3 h-3 mr-1" />
              {getElapsedTime()}
            </div>
          )}
          {betsPerSecond > 0 && (
            <div className="flex items-center text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
              <Zap className="w-3 h-3 mr-1" />
              {betsPerSecond.toFixed(1)}/s
            </div>
          )}
          <button
            onClick={onReset}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm flex items-center"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Reset
          </button>
        </div>
      </div>
      
      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">{sessionStats.totalBets}</div>
          <div className="text-xs text-gray-400">Total Bets</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-400">{sessionStats.wins}</div>
          <div className="text-xs text-gray-400">Wins</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-red-400">{sessionStats.losses}</div>
          <div className="text-xs text-gray-400">Losses</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-yellow-400">
            {sessionStats.totalBets > 0 ? ((sessionStats.wins / sessionStats.totalBets) * 100).toFixed(1) : 0}%
          </div>
          <div className="text-xs text-gray-400">Win Rate</div>
        </div>
      </div>
      
      {/* Streaks */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <div className={`text-lg font-bold ${sessionStats.isWinStreak ? 'text-green-400' : 'text-red-400'}`}>
            {sessionStats.currentStreak}
          </div>
          <div className="text-xs text-gray-400">
            Current {sessionStats.isWinStreak ? 'Win' : 'Loss'} Streak
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-400">{sessionStats.longestWinStreak}</div>
          <div className="text-xs text-gray-400">Best Win Streak</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-red-400">{sessionStats.longestLossStreak}</div>
          <div className="text-xs text-gray-400">Worst Loss Streak</div>
        </div>
      </div>
      
      {/* Profit Graph */}
      <ProfitGraph />
    </div>
  );
};

export default LiveStats;