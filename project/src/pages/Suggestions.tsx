import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Lightbulb, Bug, Plus, Star, ThumbsUp, ThumbsDown, User, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Suggestion {
  id: number;
  text: string;
  category: string;
  priority: string;
  author: string;
  timestamp: string;
  status: string;
  upvotes: number;
  downvotes: number;
  userVotes: { [userId: string]: 'up' | 'down' };
  adminResponses?: Array<{
    id: string;
    author: string;
    text: string;
    timestamp: string;
  }>;
}

const Suggestions = () => {
  const { user } = useAuth();
  const [suggestion, setSuggestion] = useState('');
  const [category, setCategory] = useState('feature');
  const [priority, setPriority] = useState('medium');
  const [submitted, setSubmitted] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  // Load suggestions from localStorage
  useEffect(() => {
    const savedSuggestions = localStorage.getItem('charlies-odds-suggestions');
    if (savedSuggestions) {
      setSuggestions(JSON.parse(savedSuggestions));
    } else {
      // Initialize with default suggestions
      const defaultSuggestions: Suggestion[] = [
        {
          id: 1,
          text: "Add a tournament mode where players can compete",
          category: "feature",
          priority: "high",
          author: "GameMaster",
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: "under-review",
          upvotes: 23,
          downvotes: 2,
          userVotes: {},
          adminResponses: [{
            id: "1",
            author: "Admin",
            text: "Great idea! We're currently evaluating the technical requirements for implementing tournaments.",
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          }]
        },
        {
          id: 2,
          text: "Include more detailed statistics in the analytics page",
          category: "improvement",
          priority: "medium",
          author: "DataLover",
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: "planned",
          upvotes: 18,
          downvotes: 1,
          userVotes: {}
        },
        {
          id: 3,
          text: "Add sound effects to make games more immersive",
          category: "feature",
          priority: "low",
          author: "SoundFan",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: "open",
          upvotes: 12,
          downvotes: 5,
          userVotes: {}
        },
        {
          id: 4,
          text: "Fix the dice animation sometimes getting stuck",
          category: "bug",
          priority: "high",
          author: "BugHunter",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: "in-progress",
          upvotes: 8,
          downvotes: 0,
          userVotes: {},
          adminResponses: [{
            id: "2",
            author: "Admin",
            text: "We've identified the issue and are working on a fix. Should be resolved in the next update.",
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }]
        },
        {
          id: 5,
          text: "Add a dark/light theme toggle option",
          category: "improvement",
          priority: "low",
          author: "ThemeSeeker",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: "open",
          upvotes: 15,
          downvotes: 3,
          userVotes: {}
        }
      ];
      setSuggestions(defaultSuggestions);
      localStorage.setItem('charlies-odds-suggestions', JSON.stringify(defaultSuggestions));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const newSuggestion: Suggestion = {
      id: Date.now(),
      text: suggestion,
      category,
      priority,
      author: user.username,
      timestamp: new Date().toISOString(),
      status: 'open',
      upvotes: 0,
      downvotes: 0,
      userVotes: {}
    };

    const updatedSuggestions = [newSuggestion, ...suggestions];
    setSuggestions(updatedSuggestions);
    localStorage.setItem('charlies-odds-suggestions', JSON.stringify(updatedSuggestions));
    
    setSubmitted(true);
    setSuggestion('');
    
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleVote = (suggestionId: number, voteType: 'up' | 'down') => {
    if (!user) return;

    const updatedSuggestions = suggestions.map(suggestion => {
      if (suggestion.id === suggestionId) {
        const currentVote = suggestion.userVotes[user.id];
        const newUserVotes = { ...suggestion.userVotes };
        let newUpvotes = suggestion.upvotes;
        let newDownvotes = suggestion.downvotes;

        // Remove previous vote if exists
        if (currentVote === 'up') {
          newUpvotes--;
        } else if (currentVote === 'down') {
          newDownvotes--;
        }

        // Add new vote if different from current
        if (currentVote !== voteType) {
          newUserVotes[user.id] = voteType;
          if (voteType === 'up') {
            newUpvotes++;
          } else {
            newDownvotes++;
          }
        } else {
          // Remove vote if clicking same vote
          delete newUserVotes[user.id];
        }

        return {
          ...suggestion,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          userVotes: newUserVotes
        };
      }
      return suggestion;
    });

    setSuggestions(updatedSuggestions);
    localStorage.setItem('charlies-odds-suggestions', JSON.stringify(updatedSuggestions));
  };

  // Sort suggestions by score (upvotes - downvotes)
  const sortedSuggestions = [...suggestions].sort((a, b) => {
    const scoreA = a.upvotes - a.downvotes;
    const scoreB = b.upvotes - b.downvotes;
    return scoreB - scoreA;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'feature':
        return <Plus className="w-4 h-4 text-green-400" />;
      case 'bug':
        return <Bug className="w-4 h-4 text-red-400" />;
      case 'improvement':
        return <Lightbulb className="w-4 h-4 text-yellow-400" />;
      default:
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-gray-600 text-white';
      case 'under-review':
        return 'bg-yellow-600 text-white';
      case 'planned':
        return 'bg-blue-600 text-white';
      case 'in-progress':
        return 'bg-purple-600 text-white';
      case 'completed':
        return 'bg-green-600 text-white';
      case 'rejected':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getPriorityColor = (pri: string) => {
    switch (pri) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <MessageSquare className="w-8 h-8 mr-3 text-yellow-400" />
          Suggestions & Feedback
        </h1>
        <p className="text-gray-400">Help us improve CharliesOdds by sharing your ideas and reporting issues</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submit New Suggestion */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 sticky top-8">
            <h2 className="text-xl font-bold text-white mb-4">Submit Suggestion</h2>
            
            {submitted && (
              <div className="bg-green-600 text-white p-3 rounded-lg mb-4 text-sm">
                Thank you! Your suggestion has been submitted.
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="feature">New Feature</option>
                  <option value="improvement">Improvement</option>
                  <option value="bug">Bug Report</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Suggestion
                </label>
                <textarea
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 h-32 resize-none"
                  placeholder="Describe your suggestion or issue in detail..."
                  required
                  disabled={!user}
                />
              </div>

              <button
                type="submit"
                disabled={!user}
                className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 disabled:text-gray-400 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-2" />
                {user ? 'Submit Suggestion' : 'Login Required'}
              </button>
            </form>

            {!user && (
              <div className="mt-4 bg-blue-900 border border-blue-600 rounded-lg p-4">
                <p className="text-blue-200 text-sm text-center">
                  <strong>Login required</strong> to submit suggestions and vote
                </p>
              </div>
            )}

            <div className="mt-6 text-xs text-gray-400">
              <p className="mb-2"><strong>Guidelines:</strong></p>
              <ul className="space-y-1">
                <li>• Be specific and detailed</li>
                <li>• One suggestion per submission</li>
                <li>• Check existing suggestions first</li>
                <li>• Include steps to reproduce bugs</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Existing Suggestions */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Community Suggestions</h2>
            <div className="text-sm text-gray-400">
              {suggestions.length} suggestions
            </div>
          </div>

          <div className="space-y-4">
            {sortedSuggestions.map((item) => (
              <div key={item.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(item.category)}
                    <span className="text-sm text-gray-400 capitalize">{item.category}</span>
                    <span className={`text-sm font-medium ${getPriorityColor(item.priority)}`}>
                      {item.priority} priority
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(item.status)}`}>
                    {item.status.replace('-', ' ')}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 mb-3 text-sm text-gray-400">
                  <User className="w-4 h-4" />
                  <span>{item.author}</span>
                  <Calendar className="w-4 h-4 ml-2" />
                  <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
                
                <p className="text-white mb-4">{item.text}</p>
                
                {/* Admin Responses */}
                {item.adminResponses && item.adminResponses.length > 0 && (
                  <div className="bg-gray-700 rounded-lg p-4 mb-4">
                    <h4 className="text-yellow-400 font-semibold mb-3 text-sm">Official Response:</h4>
                    <div className="space-y-2">
                      {item.adminResponses.map((response) => (
                        <div key={response.id} className="bg-gray-600 rounded p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-yellow-400 font-semibold text-sm">{response.author}</span>
                            <span className="text-gray-400 text-xs">
                              {new Date(response.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-200 text-sm">{response.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => handleVote(item.id, 'up')}
                      disabled={!user}
                      className={`flex items-center space-x-1 transition-colors ${
                        user && item.userVotes[user.id] === 'up' 
                          ? 'text-green-400' 
                          : 'text-gray-400 hover:text-green-400'
                      } ${!user ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">{item.upvotes}</span>
                    </button>
                    <button 
                      onClick={() => handleVote(item.id, 'down')}
                      disabled={!user}
                      className={`flex items-center space-x-1 transition-colors ${
                        user && item.userVotes[user.id] === 'down' 
                          ? 'text-red-400' 
                          : 'text-gray-400 hover:text-red-400'
                      } ${!user ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span className="text-sm">{item.downvotes}</span>
                    </button>
                    <div className="text-sm text-gray-400">
                      Score: {item.upvotes - item.downvotes}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Suggestion #{item.id}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {suggestions.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Suggestions Yet</h3>
              <p className="text-gray-500">Be the first to submit a suggestion!</p>
            </div>
          )}

          <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">How Suggestions Work</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="text-white font-semibold mb-2">Status Meanings:</h4>
                <ul className="space-y-1 text-gray-300">
                  <li><span className="text-gray-400">Open:</span> Under consideration</li>
                  <li><span className="text-yellow-400">Under Review:</span> Being evaluated</li>
                  <li><span className="text-blue-400">Planned:</span> Approved for development</li>
                  <li><span className="text-purple-400">In Progress:</span> Currently being worked on</li>
                  <li><span className="text-green-400">Completed:</span> Implemented and live</li>
                  <li><span className="text-red-400">Rejected:</span> Not suitable for implementation</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Voting & Priority:</h4>
                <ul className="space-y-1 text-gray-300">
                  <li><span className="text-green-400">👍 Upvote:</span> Support this suggestion</li>
                  <li><span className="text-red-400">👎 Downvote:</span> Don't think it's needed</li>
                  <li><span className="text-yellow-400">Score:</span> Net votes (upvotes - downvotes)</li>
                  <li><span className="text-blue-400">Sorting:</span> Higher scores appear first</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;