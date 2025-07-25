import React, { useState, useEffect } from 'react';
import { Play as PlayIcon, Pause, Settings, RotateCcw, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import { useGameAccess } from '../../hooks/useGameAccess';
import GameDisabledMessage from '../../components/GameDisabledMessage';
import DraggableLiveStats from '../../components/DraggableLiveStats';
import RecentBets from '../../components/RecentBets';
import SettingsManager from '../../components/SettingsManager';

const SpinWheel = () => {
  const { user, updateBalance, updateStats, formatCurrency } = useAuth();
  const { addBet, generateSeededRandom, bets } = useGame();
  const { isEnabled, isLoading, validateBetAmount } = useGameAccess('spin-wheel');
  
  const [betAmount, setBetAmount] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [multiplier, setMultiplier] = useState(0);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [autoBetCount, setAutoBetCount] = useState(0);
  const [maxAutoBets, setMaxAutoBets] = useState(100);
  const [infiniteBet, setInfiniteBet] = useState(false);
  const [autoBetRunning, setAutoBetRunning] = useState(false);
  const [instantBet, setInstantBet] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Profit tracking
  const [sessionProfit, setSessionProfit] = useState(0);
  const [profitHistory, setProfitHistory] = useState<{value: number, bet: number, timestamp: number}[]>([{value: 0, bet: 0, timestamp: Date.now()}]);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [betsPerSecond, setBetsPerSecond] = useState(0);
  const [betError, setBetError] = useState<string>('');
  
  // UI states for draggable stats
  const [showLiveStats, setShowLiveStats] = useState(false);

  const [sessionStats, setSessionStats] = useState({
    totalBets: 0,
    wins: 0,
    losses: 0,
    currentStreak: 0,
    longestWinStreak: 0,
    longestLossStreak: 0,
    isWinStreak: true
  });

  // Calculate bets per second
  useEffect(() => {
    if (sessionStartTime && sessionStats.totalBets > 0) {
      const elapsed = (Date.now() - sessionStartTime) / 1000;
      setBetsPerSecond(sessionStats.totalBets / elapsed);
    }
  }, [sessionStats.totalBets, sessionStartTime]);

  const roundBetAmount = (amount: number) => {
    // Round to 2 decimal places for amounts under $1
    if (amount < 1) return Math.round(amount * 100) / 100;
    // Round to 1 decimal place for amounts under $10
    if (amount < 10) return Math.round(amount * 10) / 10;
    // Round to nearest whole number for larger amounts
    return Math.round(amount);
  };

  // Wheel segments with multipliers
  const segments = [
    { multiplier: 1.5, color: 'bg-blue-500' },
    { multiplier: 2, color: 'bg-green-500' },
    { multiplier: 1.2, color: 'bg-yellow-500' },
    { multiplier: 5, color: 'bg-red-500' },
    { multiplier: 1.1, color: 'bg-purple-500' },
    { multiplier: 3, color: 'bg-orange-500' },
    { multiplier: 1.5, color: 'bg-blue-500' },
    { multiplier: 10, color: 'bg-red-600' },
    { multiplier: 1.2, color: 'bg-yellow-500' },
    { multiplier: 2, color: 'bg-green-500' },
    { multiplier: 1.1, color: 'bg-purple-500' },
    { multiplier: 1.5, color: 'bg-blue-500' },
  ];

  const spinWheel = () => {
    if (!user || betAmount > user.balance) return;

    // Validate bet amount against admin settings
    const validation = validateBetAmount(betAmount);
    if (!validation.isValid) {
      setBetError(validation.message || 'Invalid bet amount');
      setTimeout(() => setBetError(''), 3000);
      return;
    }

    setBetError('');
    setIsSpinning(true);
    setResult(null);

    // Generate random result
    const randomArray = new Uint32Array(1);
    crypto.getRandomValues(randomArray);
    const randomNum = randomArray[0] / (0xffffffff + 1);
    const segmentIndex = Math.floor(randomNum * segments.length);
    const segmentAngle = 360 / segments.length;
    const targetAngle = segmentIndex * segmentAngle + (segmentAngle / 2);
    
    // Add multiple rotations for effect
    const finalRotation = rotation + 1440 + targetAngle; // 4 full rotations + target
    
    setRotation(finalRotation);
    
    // Complete spin after animation
    const animationDuration = instantBet ? 500 : 3000;
    setTimeout(() => {
      const selectedSegment = segments[segmentIndex];
      setResult(segmentIndex);
      setMultiplier(selectedSegment.multiplier);
      
      const winAmount = betAmount * selectedSegment.multiplier;
      const profit = winAmount - betAmount;
      
      // Update profit tracking
      const newProfit = sessionProfit + profit;
      setSessionProfit(newProfit);
      setProfitHistory(prev => [...prev, {value: newProfit, bet: sessionStats.totalBets + 1, timestamp: Date.now()}]);
      
      // Update session statistics
      setSessionStats(prev => {
        const newStats = {
          totalBets: prev.totalBets + 1,
          wins: prev.wins + (selectedSegment.multiplier > 1 ? 1 : 0),
          losses: prev.losses + (selectedSegment.multiplier <= 1 ? 1 : 0),
          currentStreak: prev.isWinStreak === (selectedSegment.multiplier > 1) ? prev.currentStreak + 1 : 1,
          longestWinStreak: prev.longestWinStreak,
          longestLossStreak: prev.longestLossStreak,
          isWinStreak: selectedSegment.multiplier > 1
        };
        
        if (selectedSegment.multiplier > 1) {
          newStats.longestWinStreak = Math.max(prev.longestWinStreak, newStats.currentStreak);
        } else {
          newStats.longestLossStreak = Math.max(prev.longestLossStreak, newStats.currentStreak);
        }
        
        return newStats;
      });
      
      updateBalance(profit);
      updateStats(betAmount, winAmount);
      
      addBet({
        game: 'Spin Wheel',
        betAmount,
        winAmount,
        multiplier: selectedSegment.multiplier,
        result: { segment: segmentIndex, multiplier: selectedSegment.multiplier },
      });
      
      setIsSpinning(false);
      
      // Handle auto-betting
      if (isAutoMode && autoBetRunning) {
        setAutoBetCount(prev => prev - 1);
      }
    }, animationDuration);
  };

  const startAutoPlay = () => {
    setIsAutoMode(true);
    setAutoBetRunning(true);
    setAutoBetCount(infiniteBet ? Infinity : maxAutoBets);
    if (!sessionStartTime) {
      setSessionStartTime(Date.now());
    }
  };

  const stopAutoPlay = () => {
    setIsAutoMode(false);
    setAutoBetRunning(false);
    setAutoBetCount(0);
  };

  const saveSettings = () => {
    const settings = {
      betAmount,
      maxAutoBets,
      infiniteBet,
      instantBet
    };
    saveGameSettings('spin-wheel', settings);
  };

  const loadSettings = (settings: any) => {
    if (settings.betAmount) setBetAmount(settings.betAmount);
    if (settings.maxAutoBets) setMaxAutoBets(settings.maxAutoBets);
    if (settings.infiniteBet !== undefined) setInfiniteBet(settings.infiniteBet);
    if (settings.instantBet !== undefined) setInstantBet(settings.instantBet);
  };

  const resetStats = () => {
    setSessionProfit(0);
    setProfitHistory([{value: 0, bet: 0, timestamp: Date.now()}]);
    setSessionStats({
      totalBets: 0,
      wins: 0,
      losses: 0,
      currentStreak: 0,
      longestWinStreak: 0,
      longestLossStreak: 0,
      isWinStreak: true
    });
    setSessionStartTime(Date.now());
    setBetsPerSecond(0);
  };

  useEffect(() => {
    if (isAutoMode && autoBetRunning && (autoBetCount > 0 || infiniteBet) && !isSpinning) {
      const timer = setTimeout(() => {
        // Validate bet amount before auto-betting
        const validation = validateBetAmount(betAmount);
        if (!validation.isValid) {
          stopAutoPlay();
          setBetError(validation.message || 'Invalid bet amount');
          setTimeout(() => setBetError(''), 3000);
          return;
        }
        spinWheel();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAutoMode, autoBetRunning, autoBetCount, isSpinning]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isEnabled) {
    return <GameDisabledMessage gameName="Spin Wheel" />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Game Panel */}
        <div>
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <PlayIcon className="w-8 h-8 text-purple-400 mr-3" />
              <h1 className="text-2xl font-bold text-white">Spin Wheel</h1>
            </div>
            
            {/* Wheel */}
            <div className="bg-gray-900 rounded-lg p-8 mb-6">
              <div className="relative flex items-center justify-center">
                {/* Wheel */}
                <div className="relative">
                  <svg
                    width="300"
                    height="300"
                    className={`transition-transform ${instantBet ? 'duration-500' : 'duration-3000'} ease-out`}
                    style={{ transform: `rotate(${rotation}deg)` }}
                  >
                    {segments.map((segment, index) => {
                      const angle = (360 / segments.length) * index;
                      const nextAngle = (360 / segments.length) * (index + 1);
                      const startAngleRad = (angle * Math.PI) / 180;
                      const endAngleRad = (nextAngle * Math.PI) / 180;
                      
                      const x1 = 150 + 140 * Math.cos(startAngleRad);
                      const y1 = 150 + 140 * Math.sin(startAngleRad);
                      const x2 = 150 + 140 * Math.cos(endAngleRad);
                      const y2 = 150 + 140 * Math.sin(endAngleRad);
                      
                      const largeArcFlag = nextAngle - angle > 180 ? 1 : 0;
                      
                      const pathData = [
                        `M 150 150`,
                        `L ${x1} ${y1}`,
                        `A 140 140 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                        'Z'
                      ].join(' ');
                      
                      // Color mapping
                      const colorMap: { [key: string]: string } = {
                        'bg-blue-500': '#3b82f6',
                        'bg-green-500': '#10b981',
                        'bg-yellow-500': '#eab308',
                        'bg-red-500': '#ef4444',
                        'bg-red-600': '#dc2626',
                        'bg-purple-500': '#8b5cf6',
                        'bg-orange-500': '#f97316',
                      };
                      
                      return (
                        <g key={index}>
                          <path
                            d={pathData}
                            fill={colorMap[segment.color] || '#6b7280'}
                            stroke="#1f2937"
                            strokeWidth="2"
                          />
                          <text
                            x={150 + 100 * Math.cos((startAngleRad + endAngleRad) / 2)}
                            y={150 + 100 * Math.sin((startAngleRad + endAngleRad) / 2)}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="white"
                            fontSize="14"
                            fontWeight="bold"
                          >
                            {segment.multiplier}x
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                  
                  {/* Pointer */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
                  </div>
                </div>
              </div>
              
              {/* Result Display */}
              <div className="mt-6 text-center">
                <div className="h-12 flex flex-col items-center justify-center">
                  {result !== null && (
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-400">
                        {multiplier}x - ${(betAmount * multiplier).toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <RecentBets bets={bets.filter(bet => bet.game === 'Spin Wheel')} formatCurrency={formatCurrency} maxBets={5} />
          </div>
        </div>
        
        {/* Betting Panel */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Place Your Bet</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bet Amount
              </label>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Math.max(0.01, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                min="0.01"
                step="0.01"
                disabled={isSpinning || autoBetRunning}
              />
              {betError && (
                <div className="mt-2 text-red-400 text-sm">{betError}</div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setBetAmount(prev => prev / 2)}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                disabled={isSpinning || autoBetRunning}
              >
                1/2
              </button>
              <button
                onClick={() => setBetAmount(prev => prev * 2)}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                disabled={isSpinning || autoBetRunning}
              >
                2x
              </button>
            </div>
            
            {user && (
              <div className="mb-4 text-sm text-gray-400">
                Balance: ${user.balance.toFixed(2)}
              </div>
            )}
            
            {/* Live Stats Toggle */}
            <button
              onClick={() => setShowLiveStats(true)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center mt-2"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Show Live Stats
            </button>
            
            <div className="space-y-2">
              <button
                onClick={spinWheel}
                disabled={isSpinning || !user || betAmount > user.balance || autoBetRunning}
                className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isSpinning ? (
                  <>
                    <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                    Spinning...
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-5 h-5 mr-2" />
                    Spin Wheel
                  </>
                )}
              </button>
              
              {!autoBetRunning ? (
                <button
                  onClick={startAutoPlay}
                  disabled={isSpinning || !user || betAmount > user.balance}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Start Auto
                </button>
              ) : (
                <button
                  onClick={stopAutoPlay}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Stop Auto {infiniteBet ? '(∞)' : `(${autoBetCount} left)`}
                </button>
              )}
            </div>
          </div>
          

          <SettingsManager
            currentGame="spin-wheel"
            currentSettings={{
              betAmount,
              maxAutoBets,
              infiniteBet,
              instantBet
            }}
            onLoadSettings={loadSettings}
            onSaveSettings={saveSettings}
          />

          {/* Auto-bet Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Auto-Bet Settings
              </h3>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                {showAdvanced ? 'Hide' : 'Show'} Advanced
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={infiniteBet}
                    onChange={(e) => setInfiniteBet(e.target.checked)}
                    className="mr-2"
                    disabled={autoBetRunning}
                  />
                  <span className="text-white text-sm font-medium">Infinite Bet Mode</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Bets
                </label>
                <input
                  type="number"
                  value={maxAutoBets}
                  onChange={(e) => setMaxAutoBets(Number(e.target.value))}
                  className={`w-full px-3 py-2 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                    infiniteBet ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-700'
                  }`}
                  min="1"
                  max="10000"
                  disabled={infiniteBet || autoBetRunning}
                />
              </div>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={instantBet}
                    onChange={(e) => setInstantBet(e.target.checked)}
                    className="mr-2"
                    disabled={autoBetRunning}
                  />
                  <span className="text-white text-sm">Instant Bet (Skip Animation)</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Game Statistics */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Session Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{sessionStats.totalBets}</div>
                <div className="text-sm text-gray-400">Total Spins</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{sessionStats.wins}</div>
                <div className="text-sm text-gray-400">Wins</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{sessionStats.losses}</div>
                <div className="text-sm text-gray-400">Losses</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {sessionStats.totalBets > 0 ? ((sessionStats.wins / sessionStats.totalBets) * 100).toFixed(1) : 0}%
                </div>
                <div className="text-sm text-gray-400">Win Rate</div>
              </div>
            </div>
          </div>
          
          {/* Session Profit */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Session Profit</h3>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${sessionProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(sessionProfit)}
              </div>
              <div className="text-gray-400">Current Session</div>
            </div>
          </div>
          
          {/* Spin Wheel Tips */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Spin Wheel Tips</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Each spin is completely random and independent</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Higher multipliers appear less frequently</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Use consistent bet sizing for steady results</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Auto-spin helps maintain discipline</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Bets moved to bottom */}
      <div className="mt-8">
        <RecentBets bets={bets.filter(bet => bet.game === 'Spin Wheel')} formatCurrency={formatCurrency} maxBets={5} />
      </div>
      
      {/* Draggable Live Stats */}
      <DraggableLiveStats
        sessionStats={sessionStats}
        sessionProfit={sessionProfit}
        profitHistory={profitHistory}
        onReset={resetStats}
        formatCurrency={formatCurrency}
        startTime={sessionStartTime}
        betsPerSecond={betsPerSecond}
        isOpen={showLiveStats}
        onClose={() => setShowLiveStats(false)}
      />
    </div>
  );
};

export default SpinWheel;