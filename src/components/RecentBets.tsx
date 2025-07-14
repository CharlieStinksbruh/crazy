import React from 'react';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';

interface Bet {
  id: string;
  game: string;
  betAmount: number;
  winAmount: number;
  multiplier: number;
  timestamp: Date;
  result: any;
}

interface RecentBetsProps {
  bets: Bet[];
  formatCurrency: (amount: number) => string;
  maxBets?: number;
}

const RecentBets: React.FC<RecentBetsProps> = ({ bets, formatCurrency, maxBets = 10 }) => {
  const recentBets = bets.slice(0, maxBets);

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
        <Clock className="w-5 h-5 mr-2" />
        Recent Bets
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {recentBets.length > 0 ? (
          recentBets.map((bet) => {
            const profit = bet.winAmount - bet.betAmount;
            const isWin = profit > 0;
            
            return (
              <div key={bet.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${isWin ? 'bg-green-600' : 'bg-red-600'}`}>
                    {isWin ? (
                      <TrendingUp className="w-4 h-4 text-white" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{bet.game}</p>
                    <p className="text-gray-400 text-sm">
                      {bet.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white">{formatCurrency(bet.betAmount)}</p>
                  <p className={`text-sm font-semibold ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                    {isWin ? '+' : ''}{formatCurrency(profit)}
                  </p>
                  {bet.multiplier > 0 && (
                    <p className="text-xs text-gray-400">{bet.multiplier.toFixed(2)}x</p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-center py-8">No bets yet. Start playing to see your history!</p>
        )}
      </div>
    </div>
  );
};

export default RecentBets;