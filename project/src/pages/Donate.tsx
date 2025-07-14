import React, { useState } from 'react';
import { Heart, Coffee, Star, Crown, Gift, Users, Shield, Zap } from 'lucide-react';

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const predefinedAmounts = [5, 10, 25, 50, 100];

  const recentDonors = [
    { name: 'Alex M.', amount: 25, message: 'Love the platform! Keep up the great work.', time: '2 hours ago' },
    { name: 'Sarah K.', amount: 50, message: 'Amazing educational tool for learning casino games.', time: '1 day ago' },
    { name: 'Anonymous', amount: 10, message: '', time: '2 days ago' },
    { name: 'Mike R.', amount: 100, message: 'Best demo casino I\'ve ever used!', time: '3 days ago' },
    { name: 'Emma L.', amount: 15, message: 'Thank you for making this free!', time: '1 week ago' }
  ];

  const handleDonate = () => {
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;
    
    // In a real implementation, this would integrate with a payment processor
    alert(`Thank you for your ${amount > 0 ? `$${amount}` : ''} donation! This is a demo - no actual payment was processed.`);
    
    // Reset form
    setDonorName('');
    setMessage('');
    setCustomAmount('');
    setSelectedAmount(5);
    setIsAnonymous(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
            Support CharliesOdds
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Help us keep CharliesOdds free and continuously improving. Your support enables us to add new features, 
            maintain the platform, and provide the best demo casino experience possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Donation Form */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center mb-6">
              <Heart className="w-8 h-8 text-red-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Make a Donation</h2>
            </div>

            <div className="space-y-6">
              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Choose Amount
                </label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                      className={`py-3 px-4 rounded-lg font-semibold transition-colors ${
                        selectedAmount === amount && !customAmount
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Custom Amount
                  </label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(0);
                    }}
                    placeholder="Enter custom amount"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-400"
                    min="1"
                  />
                </div>
              </div>

              {/* Donor Information */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-400"
                  disabled={isAnonymous}
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave a message for the community"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-400 h-24 resize-none"
                  disabled={isAnonymous}
                />
              </div>

              {/* Anonymous Option */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => {
                      setIsAnonymous(e.target.checked);
                      if (e.target.checked) {
                        setDonorName('');
                        setMessage('');
                      }
                    }}
                    className="mr-3"
                  />
                  <span className="text-white">Donate anonymously</span>
                </label>
              </div>

              {/* Donate Button */}
              <button
                onClick={handleDonate}
                className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <Heart className="w-5 h-5 mr-2" />
                Donate {customAmount ? `$${customAmount}` : `$${selectedAmount}`}
              </button>

              <p className="text-xs text-gray-400 text-center">
                This is a demo platform. No actual payment will be processed.
              </p>
            </div>
          </div>

          {/* Why Donate & Recent Donors */}
          <div className="space-y-8">
            {/* Why Donate */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Gift className="w-6 h-6 text-yellow-400 mr-2" />
                Why Support Us?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-green-400 mr-3 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold">Keep It Free</h4>
                    <p className="text-gray-300 text-sm">Maintain free access for all users worldwide</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Zap className="w-5 h-5 text-blue-400 mr-3 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold">New Features</h4>
                    <p className="text-gray-300 text-sm">Fund development of new games and tools</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Star className="w-5 h-5 text-purple-400 mr-3 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold">Server Costs</h4>
                    <p className="text-gray-300 text-sm">Cover hosting and infrastructure expenses</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="w-5 h-5 text-orange-400 mr-3 mt-1" />
                  <div>
                    <h4 className="text-white font-semibold">Community Growth</h4>
                    <p className="text-gray-300 text-sm">Support educational content and resources</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Donors */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Crown className="w-6 h-6 text-yellow-400 mr-2" />
                Recent Supporters
              </h3>
              
              <div className="space-y-4">
                {recentDonors.map((donor, index) => (
                  <div key={index} className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">{donor.name}</span>
                      <div className="flex items-center">
                        <span className="text-yellow-400 font-bold">${donor.amount}</span>
                        <span className="text-gray-400 text-xs ml-2">{donor.time}</span>
                      </div>
                    </div>
                    {donor.message && (
                      <p className="text-gray-300 text-sm italic">"{donor.message}"</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Alternative Support */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6">
                Other Ways to Support
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Coffee className="w-5 h-5 text-brown-400 mr-3" />
                  <span className="text-gray-300 text-sm">Share CharliesOdds with friends</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-3" />
                  <span className="text-gray-300 text-sm">Leave feedback and suggestions</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-400 mr-3" />
                  <span className="text-gray-300 text-sm">Participate in the community</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-5 h-5 text-red-400 mr-3" />
                  <span className="text-gray-300 text-sm">Report bugs and issues</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thank You Section */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Thank You for Your Support! ❤️
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto">
            Every donation, no matter the size, helps us maintain and improve CharliesOdds. 
            Together, we're building the best educational casino platform in the world.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-200">Free Forever</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <div className="text-gray-200">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-200">Always Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;