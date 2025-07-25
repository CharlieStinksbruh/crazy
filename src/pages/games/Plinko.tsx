import React, { useState, useEffect } from 'react';
import { BarChart3, Play, Pause, Settings, RotateCcw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import { useGameAccess } from '../../hooks/useGameAccess';
import GameDisabledMessage from '../../components/GameDisabledMessage';
import DraggableLiveStats from '../../components/DraggableLiveStats';
import RecentBets from '../../components/RecentBets';
import SettingsManager from '../../components/SettingsManager';

const Plinko = () => {
  const { user, updateBalance, updateStats, formatCurrency } = useAuth();
  const { addBet, generateSeededRandom, bets } = useGame();
  const { isEnabled, isLoading, validateBetAmount } = useGameAccess('plinko');
  
  const [betAmount, setBetAmount] = useState(10);
  const [isDropping, setIsDropping] = useState(false);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 0 });
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

  // Plinko multipliers (17 slots for better distribution)
  const multipliers = [1000, 130, 26, 9, 4, 2, 1.5, 1, 0.5, 1, 1.5, 2, 4, 9, 26, 130, 1000];
  const colors = [
    'bg-red-600', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 
    'bg-green-500', 'bg-blue-400', 'bg-blue-500', 'bg-gray-500', 'bg-blue-500', 
    'bg-blue-400', 'bg-green-500', 'bg-green-400', 'bg-yellow-500', 'bg-orange-500', 
    'bg-red-500', 'bg-red-600'
  ];

  const dropBall = () => {
    if (!user || betAmount > user.balance) return;

    // Validate bet amount against admin settings
    const validation = validateBetAmount(betAmount);
    if (!validation.isValid) {
      setBetError(validation.message || 'Invalid bet amount');
      setTimeout(() => setBetError(''), 3000);
      return;
    }

    setBetError('');
    setIsDropping(true);
    setResult(null);
    setBallPosition({ x: 50, y: 0 });

    // Simulate realistic ball physics with better randomness
    let currentX = 50;
    let currentY = 0;
    const steps = 16; // Number of peg rows
    const stepHeight = 20;
    
    const animateBall = (step: number) => {
      if (step >= steps) {
        // Ball reached bottom, determine final slot
        const slotWidth = 100 / multipliers.length;
        const finalSlot = Math.floor(currentX / slotWidth);
        const clampedSlot = Math.max(0, Math.min(multipliers.length - 1, finalSlot));
        const finalMultiplier = multipliers[clampedSlot];
        
        setResult(clampedSlot);
        setMultiplier(finalMultiplier);
        
        const winAmount = betAmount * finalMultiplier;
        const profit = winAmount - betAmount;
        
        // Update profit tracking
        const newProfit = sessionProfit + profit;
        setSessionProfit(newProfit);
      setProfitHistory(prev => [...prev, {value: newProfit, bet: sessionStats.totalBets + 1, timestamp: Date.now()}]);
        
        // Update session statistics
        setSessionStats(prev => {
          const newStats = {
            totalBets: prev.totalBets + 1,
            wins: prev.wins + (finalMultiplier > 1 ? 1 : 0),
            losses: prev.losses + (finalMultiplier <= 1 ? 1 : 0),
            currentStreak: prev.isWinStreak === (finalMultiplier > 1) ? prev.currentStreak + 1 : 1,
            longestWinStreak: prev.longestWinStreak,
            longestLossStreak: prev.longestLossStreak,
            isWinStreak: finalMultiplier > 1
          };
          
          if (finalMultiplier > 1) {
            newStats.longestWinStreak = Math.max(prev.longestWinStreak, newStats.currentStreak);
          } else {
            newStats.longestLossStreak = Math.max(prev.longestLossStreak, newStats.currentStreak);
          }
          
          return newStats;
        });
        
        updateBalance(profit);
        
        addBet({
          game: 'Plinko',
          betAmount,
          winAmount,
          multiplier: finalMultiplier,
          result: { slot: clampedSlot, multiplier: finalMultiplier },
        });
        
        setIsDropping(false);
        
        // Handle auto-betting
        if (isAutoMode && autoBetRunning) {
          setAutoBetCount(prev => prev - 1);
        }
        return;
      }

      // Calculate next position with realistic physics
      const randomArray = new Uint32Array(1);
      crypto.getRandomValues(randomArray);
      const randomNum = randomArray[0] / (0xffffffff + 1);
      const direction = randomNum > 0.5 ? 1 : -1;
      const bounce = (randomNum * 8) + 2; // Random bounce between 2-10
      
      currentX += direction * bounce;
      currentX = Math.max(5, Math.min(95, currentX)); // Keep within bounds
      currentY = step * stepHeight;
      
      setBallPosition({ x: currentX, y: currentY });
      
      setTimeout(() => animateBall(step + 1), instantBet ? 50 : 150);
    };
    
    setTimeout(() => animateBall(0), 100);
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
    saveGameSettings('plinko', settings);
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
    if (isAutoMode && autoBetRunning && (autoBetCount > 0 || infiniteBet) && !isDropping) {
      const timer = setTimeout(() => {
        // Validate bet amount before auto-betting
        const validation = validateBetAmount(betAmount);
        if (!validation.isValid) {
          stopAutoPlay();
          setBetError(validation.message || 'Invalid bet amount');
          setTimeout(() => setBetError(''), 3000);
          return;
        }
        dropBall();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAutoMode, autoBetRunning, autoBetCount, isDropping]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isEnabled) {
    return <GameDisabledMessage gameName="Plinko" />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Game Panel */}
        <div>
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <BarChart3 className="w-8 h-8 text-yellow-400 mr-3" />
              <h1 className="text-2xl font-bold text-white">Plinko</h1>
            </div>
            
            {/* Plinko Board */}
            <div className="bg-gray-900 rounded-lg p-8 mb-6">
              {/* Ball Drop Area */}
              <div className="relative h-96 mb-6 overflow-hidden border-2 border-gray-700 rounded-lg bg-gradient-to-b from-gray-800 to-gray-900">
                {/* Drop point */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full shadow-lg"></div>
                
                {/* Pegs arranged in proper pyramid formation */}
                {Array.from({ length: 14 }, (_, row) => (
                  <div key={row} className="absolute w-full flex justify-center" style={{ 
                    top: `${30 + (row * 22)}px`
                  }}>
                    {Array.from({ length: row + 2 }, (_, peg) => {
                      const totalPegs = row + 2;
                      const containerWidth = 90; // Percentage of container width to use
                      const spacing = containerWidth / (totalPegs + 1);
                      const leftOffset = 5 + spacing * (peg + 1); // 5% margin + spacing
                      
                      return (
                        <div 
                          key={peg} 
                          className="absolute w-3 h-3 bg-gray-500 rounded-full shadow-md border border-gray-400"
                          style={{ left: `${leftOffset}%` }}
                        />
                      );
                    })}
                  </div>
                ))}
                
                {/* Ball */}
                {isDropping && (
                  <div 
                    className="absolute w-4 h-4 bg-yellow-400 rounded-full transition-all duration-150 z-10 shadow-lg border-2 border-yellow-300"
                    style={{ 
                      left: `${ballPosition.x}%`,
                      top: `${ballPosition.y}px`,
                      transform: 'translateX(-50%)'
                    }}
                  />
                )}
              </div>
              
              {/* Multiplier Slots */}
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${multipliers.length}, 1fr)` }}>
                {multipliers.map((mult, index) => (
                  <div 
                    key={index}
                    className={`h-12 rounded-lg flex items-center justify-center text-white font-bold text-xs transition-all duration-300 ${
                      colors[index]
                    } ${result === index ? 'ring-4 ring-yellow-400 scale-110' : ''}`}
                  >
                    {mult}x
                  </div>
                ))}
              </div>
              
              {/* Result Display */}
              <div className="mt-6 text-center">
                <div className="h-12 flex flex-col items-center justify-center">
                  {result !== null && (
                    <div className="text-center">
                      <div className="text-lg font-semibold text-yellow-400">
                        {multiplier}x - ${(betAmount * multiplier).toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <RecentBets bets={bets.filter(bet => bet.game === 'Plinko')} formatCurrency={formatCurrency} maxBets={5} />
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
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                min="0.01"
                step="0.01"
                disabled={isDropping || autoBetRunning}
              />
              {betError && (
                <div className="mt-2 text-red-400 text-sm">{betError}</div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setBetAmount(prev => prev / 2)}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                disabled={isDropping || autoBetRunning}
              >
                1/2
              </button>
              <button
                onClick={() => setBetAmount(prev => prev * 2)}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                disabled={isDropping || autoBetRunning}
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
                onClick={dropBall}
                disabled={isDropping || !user || betAmount > user.balance || autoBetRunning}
                className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isDropping ? (
                  <>
                    <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                    Dropping...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Drop Ball
                  </>
                )}
              </button>
              
              {!autoBetRunning ? (
                <button
                  onClick={startAutoPlay}
                  disabled={isDropping || !user || betAmount > user.balance}
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
            currentGame="plinko"
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
                  className={`w-full px-3 py-2 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
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
                <div className="text-sm text-gray-400">Total Drops</div>
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
          
          {/* Plinko Tips */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Plinko Tips</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Center slots have higher probability but lower multipliers</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Edge slots offer massive multipliers (1000x) but are very rare</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Ball physics are realistic - each bounce is random</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Use smaller bets when chasing high multipliers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Bets moved to bottom */}
      <div className="mt-8">
        <RecentBets bets={bets.filter(bet => bet.game === 'Plinko')} formatCurrency={formatCurrency} maxBets={5} />
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

export default Plinko;