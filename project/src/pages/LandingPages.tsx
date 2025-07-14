import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, Target, BarChart3, Shield, Zap, Crown, Star, Lightbulb, Users, Trophy, DollarSign, Gamepad2, Brain, BookOpen } from 'lucide-react';

const LandingPages = () => {
  const landingPages = [
    {
      title: 'Dice Probability Calculator',
      path: '/dice-probability-calculator',
      description: 'Calculate dice game odds, analyze betting strategies, and discover optimal approaches for your bankroll.',
      icon: <Calculator className="w-8 h-8" />,
      category: 'Calculators',
      color: 'from-blue-500 to-cyan-500',
      keywords: ['dice probability', 'betting calculator', 'odds analysis']
    },
    {
      title: 'Crash Game Strategy Guide',
      path: '/crash-game-strategy',
      description: 'Master crash games with proven strategies, optimal cashout timing, and advanced auto-betting techniques.',
      icon: <Zap className="w-8 h-8" />,
      category: 'Strategy Guides',
      color: 'from-red-500 to-orange-500',
      keywords: ['crash strategy', 'multiplier games', 'auto cashout']
    },
    {
      title: 'Martingale Calculator',
      path: '/martingale-calculator',
      description: 'Analyze Martingale strategy risks, calculate bankruptcy probability, and optimize your betting progression.',
      icon: <TrendingUp className="w-8 h-8" />,
      category: 'Calculators',
      color: 'from-purple-500 to-pink-500',
      keywords: ['martingale strategy', 'progressive betting', 'risk analysis']
    },
    {
      title: 'Blackjack Basic Strategy',
      path: '/blackjack-basic-strategy',
      description: 'Complete blackjack strategy charts, house edge analysis, and expert tips for optimal play.',
      icon: <Target className="w-8 h-8" />,
      category: 'Strategy Guides',
      color: 'from-gray-600 to-gray-800',
      keywords: ['blackjack strategy', 'basic strategy chart', 'card game tips']
    },
    {
      title: 'Casino Odds Calculator',
      path: '/casino-odds-calculator',
      description: 'Compare house edge across all casino games with our interactive odds calculator and analysis tool.',
      icon: <BarChart3 className="w-8 h-8" />,
      category: 'Calculators',
      color: 'from-green-500 to-emerald-500',
      keywords: ['casino odds', 'house edge', 'game comparison']
    },
    {
      title: 'Plinko Strategy Guide',
      path: '/plinko-strategy',
      description: 'Multiplier analysis, physics understanding, and risk management for Plinko games.',
      icon: <Star className="w-8 h-8" />,
      category: 'Strategy Guides',
      color: 'from-yellow-500 to-orange-500',
      keywords: ['plinko strategy', 'multiplier games', 'physics games']
    }
  ];

  const categories = [...new Set(landingPages.map(page => page.category))];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Strategy Guides & Calculators
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Master casino games with our comprehensive collection of strategy guides, probability calculators, 
              and expert analysis tools. All free and designed to improve your gaming knowledge.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span className="bg-gray-800 px-3 py-1 rounded-full">Free Strategy Guides</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">Probability Calculators</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">Expert Analysis</span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">Educational Content</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        {categories.map((category) => (
          <div key={category} className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
              {category === 'Calculators' && <Calculator className="w-8 h-8 text-blue-400 mr-3" />}
              {category === 'Strategy Guides' && <BookOpen className="w-8 h-8 text-green-400 mr-3" />}
              {category}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {landingPages
                .filter(page => page.category === category)
                .map((page, index) => (
                  <Link
                    key={index}
                    to={page.path}
                    className="group bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${page.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">
                        {page.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">
                      {page.title}
                    </h3>
                    
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {page.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {page.keywords.map((keyword, i) => (
                        <span
                          key={i}
                          className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        ))}

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Use Our Guides & Calculators?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
              <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Expert Knowledge</h3>
              <p className="text-gray-300 text-sm">
                Created by gambling experts and mathematicians with years of experience in casino game analysis.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
              <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">100% Free</h3>
              <p className="text-gray-300 text-sm">
                All our strategy guides and calculators are completely free. No hidden fees or premium subscriptions.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
              <Lightbulb className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Educational Focus</h3>
              <p className="text-gray-300 text-sm">
                Learn probability theory, game theory, and risk management in an easy-to-understand format.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Improve Your Game?
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto">
            Start with our strategy guides and calculators, then practice what you learn on CharliesOdds - 
            the most advanced demo casino platform available.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <Crown className="w-6 h-6 mr-2" />
              Start Learning Free
            </Link>
            <Link
              to="/dice"
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 border border-gray-700 flex items-center justify-center"
            >
              <Gamepad2 className="w-6 h-6 mr-2" />
              Practice on Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPages;