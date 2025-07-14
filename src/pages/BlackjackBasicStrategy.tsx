import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Shield, BarChart3, CheckCircle, Star, Rocket, Crown, Calculator, TrendingUp, Users } from 'lucide-react';

const BlackjackBasicStrategy = () => {
  const hardTotals = [
    { player: '8 or less', dealer: 'Any', action: 'Hit', color: 'bg-blue-600' },
    { player: '9', dealer: '3-6', action: 'Double', color: 'bg-green-600' },
    { player: '9', dealer: '2,7-A', action: 'Hit', color: 'bg-blue-600' },
    { player: '10', dealer: '2-9', action: 'Double', color: 'bg-green-600' },
    { player: '10', dealer: '10,A', action: 'Hit', color: 'bg-blue-600' },
    { player: '11', dealer: 'Any', action: 'Double', color: 'bg-green-600' },
    { player: '12', dealer: '4-6', action: 'Stand', color: 'bg-red-600' },
    { player: '12', dealer: '2,3,7-A', action: 'Hit', color: 'bg-blue-600' },
    { player: '13-16', dealer: '2-6', action: 'Stand', color: 'bg-red-600' },
    { player: '13-16', dealer: '7-A', action: 'Hit', color: 'bg-blue-600' },
    { player: '17-21', dealer: 'Any', action: 'Stand', color: 'bg-red-600' }
  ];

  const softTotals = [
    { player: 'A,2 or A,3', dealer: '5-6', action: 'Double', color: 'bg-green-600' },
    { player: 'A,2 or A,3', dealer: 'Other', action: 'Hit', color: 'bg-blue-600' },
    { player: 'A,4 or A,5', dealer: '4-6', action: 'Double', color: 'bg-green-600' },
    { player: 'A,4 or A,5', dealer: 'Other', action: 'Hit', color: 'bg-blue-600' },
    { player: 'A,6', dealer: '3-6', action: 'Double', color: 'bg-green-600' },
    { player: 'A,6', dealer: 'Other', action: 'Hit', color: 'bg-blue-600' },
    { player: 'A,7', dealer: '3-6', action: 'Double', color: 'bg-green-600' },
    { player: 'A,7', dealer: '2,7,8', action: 'Stand', color: 'bg-red-600' },
    { player: 'A,7', dealer: '9,10,A', action: 'Hit', color: 'bg-blue-600' },
    { player: 'A,8 or A,9', dealer: 'Any', action: 'Stand', color: 'bg-red-600' }
  ];

  const pairs = [
    { player: 'A,A or 8,8', dealer: 'Any', action: 'Split', color: 'bg-yellow-600' },
    { player: '10,10', dealer: 'Any', action: 'Stand', color: 'bg-red-600' },
    { player: '9,9', dealer: '2-9 (not 7)', action: 'Split', color: 'bg-yellow-600' },
    { player: '9,9', dealer: '7,10,A', action: 'Stand', color: 'bg-red-600' },
    { player: '7,7', dealer: '2-7', action: 'Split', color: 'bg-yellow-600' },
    { player: '7,7', dealer: '8-A', action: 'Hit', color: 'bg-blue-600' },
    { player: '6,6', dealer: '2-6', action: 'Split', color: 'bg-yellow-600' },
    { player: '6,6', dealer: '7-A', action: 'Hit', color: 'bg-blue-600' },
    { player: '5,5', dealer: 'Any', action: 'Double (treat as 10)', color: 'bg-green-600' },
    { player: '4,4', dealer: 'Any', action: 'Hit', color: 'bg-blue-600' },
    { player: '2,2 or 3,3', dealer: '2-7', action: 'Split', color: 'bg-yellow-600' },
    { player: '2,2 or 3,3', dealer: '8-A', action: 'Hit', color: 'bg-blue-600' }
  ];

  const tips = [
    {
      title: 'Never Take Insurance',
      description: 'Insurance is a side bet that favors the house. Basic strategy never recommends taking insurance, even with a good hand.'
    },
    {
      title: 'Always Split Aces and Eights',
      description: 'These are the two most important splits in blackjack. Aces give you two chances at 21, and eights escape a weak 16.'
    },
    {
      title: 'Never Split Tens',
      description: 'A hand of 20 is too strong to break up. Keep your tens together and stand on this excellent total.'
    },
    {
      title: 'Double Down on 11',
      description: 'With 11, you have the best chance of making 21. Always double down against any dealer upcard.'
    },
    {
      title: 'Hit Soft 17',
      description: 'Unlike the dealer, you should hit soft 17 (A,6) in most situations to improve your hand.'
    },
    {
      title: 'Stand on Hard 17+',
      description: 'Any hard total of 17 or higher should be stood on. The risk of busting is too high to take another card.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Blackjack Basic Strategy Guide
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Master perfect blackjack basic strategy with our comprehensive charts and expert tips. 
              Reduce the house edge to just 0.5% with mathematically optimal play.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="bg-gray-800 px-3 py-1 rounded-full">Blackjack Strategy</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">Basic Strategy Chart</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">Card Counting Basics</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">House Edge Reduction</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Strategy Charts */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Complete Basic Strategy Charts
          </h2>
          
          {/* Hard Totals */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">Hard Totals (No Aces)</h3>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 overflow-x-auto">
              <div className="min-w-full">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="font-bold text-white text-center py-2">Your Hand</div>
                  <div className="font-bold text-white text-center py-2">Dealer Shows</div>
                  <div className="font-bold text-white text-center py-2">Action</div>
                  
                  {hardTotals.map((row, index) => (
                    <React.Fragment key={index}>
                      <div className="text-gray-300 text-center py-2 bg-gray-900 rounded">{row.player}</div>
                      <div className="text-gray-300 text-center py-2 bg-gray-900 rounded">{row.dealer}</div>
                      <div className={`text-white text-center py-2 rounded font-semibold ${row.color}`}>
                        {row.action}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Soft Totals */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">Soft Totals (With Aces)</h3>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 overflow-x-auto">
              <div className="min-w-full">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="font-bold text-white text-center py-2">Your Hand</div>
                  <div className="font-bold text-white text-center py-2">Dealer Shows</div>
                  <div className="font-bold text-white text-center py-2">Action</div>
                  
                  {softTotals.map((row, index) => (
                    <React.Fragment key={index}>
                      <div className="text-gray-300 text-center py-2 bg-gray-900 rounded">{row.player}</div>
                      <div className="text-gray-300 text-center py-2 bg-gray-900 rounded">{row.dealer}</div>
                      <div className={`text-white text-center py-2 rounded font-semibold ${row.color}`}>
                        {row.action}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pairs */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">Pairs (Splitting Strategy)</h3>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 overflow-x-auto">
              <div className="min-w-full">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="font-bold text-white text-center py-2">Your Pair</div>
                  <div className="font-bold text-white text-center py-2">Dealer Shows</div>
                  <div className="font-bold text-white text-center py-2">Action</div>
                  
                  {pairs.map((row, index) => (
                    <React.Fragment key={index}>
                      <div className="text-gray-300 text-center py-2 bg-gray-900 rounded">{row.player}</div>
                      <div className="text-gray-300 text-center py-2 bg-gray-900 rounded">{row.dealer}</div>
                      <div className={`text-white text-center py-2 rounded font-semibold ${row.color}`}>
                        {row.action}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h4 className="text-lg font-bold text-white mb-4">Action Legend</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                <span className="text-gray-300 text-sm">Hit - Take another card</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
                <span className="text-gray-300 text-sm">Stand - Keep current total</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
                <span className="text-gray-300 text-sm">Double - Double bet, take one card</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-600 rounded mr-2"></div>
                <span className="text-gray-300 text-sm">Split - Separate pairs into two hands</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expert Tips */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Essential Blackjack Tips
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tips.map((tip, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                  <h3 className="text-lg font-bold text-white">{tip.title}</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* House Edge Information */}
        <div className="mb-16">
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              House Edge by Strategy
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-400 mb-2">~5%</div>
                <div className="text-white font-semibold mb-2">No Strategy</div>
                <div className="text-gray-400 text-sm">Playing by intuition and hunches</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">~2%</div>
                <div className="text-white font-semibold mb-2">Casual Play</div>
                <div className="text-gray-400 text-sm">Some basic knowledge, inconsistent decisions</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">0.5%</div>
                <div className="text-white font-semibold mb-2">Perfect Basic Strategy</div>
                <div className="text-gray-400 text-sm">Following the charts exactly every time</div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-300 text-sm max-w-2xl mx-auto">
                Using perfect basic strategy reduces the house edge to just 0.5%, making blackjack one of the best 
                casino games for players. This means for every $100 wagered, you can expect to lose only 50 cents on average.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Practice Perfect Basic Strategy
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Master blackjack basic strategy with CharliesOdds' advanced demo platform. Practice with auto-play 
            that follows perfect basic strategy and track your results in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/blackjack"
              className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <Target className="w-6 h-6 mr-2" />
              Play Blackjack
            </Link>
            <Link
              to="/register"
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 border border-gray-500 flex items-center justify-center"
            >
              <Rocket className="w-6 h-6 mr-2" />
              Start Free Demo
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-200">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Perfect Strategy</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Auto-Play Mode</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Live Statistics</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Risk-Free Learning</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlackjackBasicStrategy;