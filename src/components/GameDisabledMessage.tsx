import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Gamepad2, ArrowRight } from 'lucide-react';

interface GameDisabledMessageProps {
  gameName: string;
}

const GameDisabledMessage: React.FC<GameDisabledMessageProps> = ({ gameName }) => {
  const otherGames = [
    { name: 'Dice', path: '/dice' },
    { name: 'Limbo', path: '/limbo' },
    { name: 'Crash', path: '/crash' },
    { name: 'Blackjack', path: '/blackjack' },
    { name: 'Plinko', path: '/plinko' },
    { name: 'Spin Wheel', path: '/spin-wheel' },
  ].filter(game => game.name.toLowerCase() !== gameName.toLowerCase());

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            {gameName} is Currently Disabled
          </h1>
          
          <p className="text-gray-300 text-lg mb-8">
            This game is temporarily unavailable. Our team is working on improvements and will have it back online soon.
          </p>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 mr-2" />
              Try These Other Games Instead
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherGames.map((game) => (
                <Link
                  key={game.path}
                  to={game.path}
                  className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{game.name}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Return to Homepage
            </Link>
            <Link
              to="/suggestions"
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Report an Issue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDisabledMessage;