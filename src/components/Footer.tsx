import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CO</span>
                </div>
                <span className="text-white font-bold text-xl">CharliesOdds</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                The most advanced crypto casino with provably fair games, real-time analytics, 
                and professional auto-betting strategies.
              </p>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Games */}
            <div>
              <h3 className="text-white font-semibold mb-4">Games</h3>
              <ul className="space-y-2">
                <li><Link to="/dice" className="text-gray-400 hover:text-white transition-colors">Dice</Link></li>
                <li><Link to="/limbo" className="text-gray-400 hover:text-white transition-colors">Limbo</Link></li>
                <li><Link to="/crash" className="text-gray-400 hover:text-white transition-colors">Crash</Link></li>
                <li><Link to="/blackjack" className="text-gray-400 hover:text-white transition-colors">Blackjack</Link></li>
                <li><Link to="/plinko" className="text-gray-400 hover:text-white transition-colors">Plinko</Link></li>
                <li><Link to="/spin-wheel" className="text-gray-400 hover:text-white transition-colors">Spin Wheel</Link></li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h3 className="text-white font-semibold mb-4">Account</h3>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors">Register</Link></li>
                <li><Link to="/profile" className="text-gray-400 hover:text-white transition-colors">Profile</Link></li>
                <li><Link to="/analytics" className="text-gray-400 hover:text-white transition-colors">Analytics</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="mailto:support@charliesodds.com" className="text-gray-400 hover:text-white transition-colors">Contact Support</a></li>
                <li><Link to="/donate" className="text-gray-400 hover:text-white transition-colors">Donate</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Responsible Gaming</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors">Sitemap</Link></li>
              </ul>
            </div>
            
            {/* SEO Landing Pages */}
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/landing-pages" className="text-gray-400 hover:text-white transition-colors">Landing Pages</Link></li>
                <li><Link to="/earn-balance" className="text-gray-400 hover:text-white transition-colors">Earn Balance</Link></li>
                <li><Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors">Sitemap</Link></li>
                <li><Link to="/donate" className="text-gray-400 hover:text-white transition-colors">Donate</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-sm text-gray-400">
                <p>&copy; 2025 CharliesOdds. All rights reserved.</p>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Provably Fair
                </span>
                <span>18+ Only</span>
                <span>Play Responsibly</span>
              </div>
            </div>
            
            <div className="mt-4 text-center text-xs text-gray-500">
              <p>CharliesOdds is a demo casino platform for entertainment purposes. No real money gambling.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;