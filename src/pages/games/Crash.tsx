import React, { useState, useEffect } from 'react';
import { Zap, Play, Pause, Settings, RotateCcw, Save, RefreshCw, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import { useGameAccess } from '../../hooks/useGameAccess';
import GameDisabledMessage from '../../components/GameDisabledMessage';
import DraggableLiveStats from '../../components/DraggableLiveStats';
import RecentBets from '../../components/RecentBets';
import SettingsManager from '../../components/SettingsManager';

const Crash = () => {
  const { user, updateBalance, updateStats, formatCurrency } = useAuth();
  const { addBet, generateSeededRandom, saveGameSettings, loadGameSettings, bets, setSeed, seed } = useGame();
  const { isEnabled, isLoading, validateBetAmount } = useGameAccess('crash');
  
  const [betAmount, setBetAmount] = useState(10);
  const [originalBetAmount, setOriginalBetAmount] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [crashPoint, setCrashPoint] = useState(0);
  const [cashedOut, setCashedOut] = useState(false);
  const [cashOutAt, setCashOutAt] = useState(2);
  const [autoCashOut, setAutoCashOut] = useState(false);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [autoBetCount, setAutoBetCount] = useState(0);
  const [maxAutoBets, setMaxAutoBets] = useState(100);
  const [infiniteBet, setInfiniteBet] = useState(false);
  const [autoBetRunning, setAutoBetRunning] = useState(false);
  const [instantBet, setInstantBet] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [betSpeed, setBetSpeed] = useState(1000);
  
  // Profit tracking
  const [sessionProfit, setSessionProfit] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    totalBets: 0,
    wins: 0,
    losses: 0,
    currentStreak: 0,
    longestWinStreak: 0,
    longestLossStreak: 0,
    isWinStreak: true
  });
  const [profitHistory, setProfitHistory] = useState<{value: number, bet: number, timestamp: number}[]>([{value: 0, bet: 0, timestamp: Date.now()}]);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [betsPerSecond, setBetsPerSecond] = useState(0);
  const [newSeed, setNewSeed] = useState(seed);
  const [betError, setBetError] = useState<string>('');

  // UI states for draggable stats
  const [showLiveStats, setShowLiveStats] = useState(false);

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = loadGameSettings('crash');
    if (savedSettings.betAmount) setBetAmount(savedSettings.betAmount);
    if (savedSettings.cashOutAt) setCashOutAt(savedSettings.cashOutAt);
    if (savedSettings.autoCashOut !== undefined) setAutoCashOut(savedSettings.autoCashOut);
    if (savedSettings.maxAutoBets) setMaxAutoBets(savedSettings.maxAutoBets);
    if (savedSettings.infiniteBet !== undefined) setInfiniteBet(savedSettings.infiniteBet);
    if (savedSettings.instantBet !== undefined) setInstantBet(savedSettings.instantBet);
    if (savedSettings.betSpeed) setBetSpeed(savedSettings.betSpeed);
  }, []);

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

  const startGame = () => {
    if (!user || betAmount > user.balance) return;

    // Validate bet amount against admin settings
    const validation = validateBetAmount(betAmount);
    if (!validation.isValid) {
      setBetError(validation.message || 'Invalid bet amount');
      setTimeout(() => setBetError(''), 3000);
      return;
    }

    setBetError('');
    setIsPlaying(true);
    setCurrentMultiplier(1);
    setCashedOut(false);
    setGameResult(null);
    
    // Generate crash point
    const randomArray = new Uint32Array(1);
    crypto.getRandomValues(randomArray);
    const randomNum = randomArray[0] / (0xffffffff + 1);
    const crash = Math.max(1.01, Math.pow(Math.E, randomNum * 3));
    setCrashPoint(crash);
    
    // Animate multiplier
    const duration = instantBet ? betSpeed : Math.min(crash * 1000, 10000);
    const startTime = Date.now();
    
    const animateMultiplier = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;
      
      if (progress >= 1) {
        // Game crashed
        setCurrentMultiplier(crash);
        endGame(false);
        return;
      }
      
      const current = 1 + (crash - 1) * progress;
      setCurrentMultiplier(current);
      
      // Auto cash out
      if (autoCashOut && current >= cashOutAt && !cashedOut) {
        cashOut();
        return;
      }
      
      requestAnimationFrame(animateMultiplier);
    };
    
    animateMultiplier();
  };

  const cashOut = () => {
    if (!isPlaying || cashedOut) return;
    
    setCashedOut(true);
    endGame(true);
  };

  const endGame = (won: boolean) => {
    setIsPlaying(false);
    setGameResult(won ? 'win' : 'lose');
    
    const winAmount = won ? betAmount * currentMultiplier : 0;
    const profit = winAmount - betAmount;
    
    // Always update balance - deduct bet amount and add winnings if any
    updateBalance(-betAmount);
    if (won) {
      updateBalance(winAmount);
    }
    
    // Update profit tracking
    const newProfit = sessionProfit + profit;
    setSessionProfit(newProfit);
    setProfitHistory(prev => [...prev, {value: newProfit, bet: sessionStats.totalBets + 1, timestamp: Date.now()}]);
    
    // Update session statistics
    setSessionStats(prev => {
      const newStats = {
        totalBets: prev.totalBets + 1,
        wins: prev.wins + (won ? 1 : 0),
        losses: prev.losses + (won ? 0 : 1),
        currentStreak: prev.isWinStreak === won ? prev.currentStreak + 1 : 1,
        longestWinStreak: prev.longestWinStreak,
        longestLossStreak: prev.longestLossStreak,
        isWinStreak: won
      };
      
      if (won) {
        newStats.longestWinStreak = Math.max(prev.longestWinStreak, newStats.currentStreak);
      } else {
        newStats.longestLossStreak = Math.max(prev.longestLossStreak, newStats.currentStreak);
      }
      
      return newStats;
    });
    
    updateStats(betAmount, winAmount);
    
    addBet({
      game: 'Crash',
      betAmount,
      winAmount,
      multiplier: won ? currentMultiplier : 0,
      result: { crashPoint, cashedOutAt: won ? currentMultiplier : null, won },
    });
    
    // Handle auto-betting
    if (isAutoMode && autoBetRunning) {
      setAutoBetCount(prev => prev - 1);
    }
  };

  const startAutoPlay = () => {
    setIsAutoMode(true);
    setAutoBetRunning(true);
    setAutoBetCount(infiniteBet ? Infinity : maxAutoBets);
    setOriginalBetAmount(betAmount);
    if (!sessionStartTime) {
      setSessionStartTime(Date.now());
    }
  };

  const stopAutoPlay = () => {
    setIsAutoMode(false);
    setAutoBetRunning(false);
    setAutoBetCount(0);
    setBetAmount(originalBetAmount);
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

  const saveSettings = () => {
    const settings = {
      betAmount,
      cashOutAt,
      autoCashOut,
      maxAutoBets,
      infiniteBet,
      instantBet,
      betSpeed
    };
    saveGameSettings('crash', settings);
  };

  const loadSettings = (settings: any) => {
    if (settings.betAmount) setBetAmount(settings.betAmount);
    if (settings.cashOutAt) setCashOutAt(settings.cashOutAt);
    if (settings.autoCashOut !== undefined) setAutoCashOut(settings.autoCashOut);
    if (settings.maxAutoBets) setMaxAutoBets(settings.maxAutoBets);
    if (settings.infiniteBet !== undefined) setInfiniteBet(settings.infiniteBet);
    if (settings.instantBet !== undefined) setInstantBet(settings.instantBet);
    if (settings.betSpeed) setBetSpeed(settings.betSpeed);
  };

  const handleSeedUpdate = () => {
    setSeed(newSeed);
  };

  const generateNewSeed = () => {
    const newRandomSeed = Math.random().toString(36).substring(2, 15);
    setNewSeed(newRandomSeed);
    setSeed(newRandomSeed);
  };

  useEffect(() => {
    if (isAutoMode && autoBetRunning && (autoBetCount > 0 || infiniteBet) && !isPlaying) {
      const timer = setTimeout(() => {
        // Validate bet amount before auto-betting
        const validation = validateBetAmount(betAmount);
        if (!validation.isValid) {
          stopAutoPlay();
          setBetError(validation.message || 'Invalid bet amount');
          setTimeout(() => setBetError(''), 3000);
          return;
        }
        startGame();
      }, betSpeed);
      return () => clearTimeout(timer);
    }
  }, [isAutoMode, autoBetRunning, autoBetCount, isPlaying, betSpeed]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isEnabled) {
    return <GameDisabledMessage gameName="Crash" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-6">
              <Zap className="w-8 h-8 text-red-400 mr-3" />
              <h1 className="text-2xl font-bold text-white">Crash</h1>
            </div>
            
            {/* Multiplier Display */}
            <div className="bg-gray-900 rounded-lg p-8 mb-6">
              <div className="text-center">
                <div className="text-8xl font-bold text-white mb-4">
                  {currentMultiplier.toFixed(2)}x
                </div>
                
                {/* Fixed height container for result to prevent jumping */}
                <div className="h-12 flex items-center justify-center">
                  {gameResult && (
                    <div className="text-center">
                      <div className="text-base text-gray-300">
                        {gameResult === 'win' ? 'Cashed Out!' : 'Crashed!'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Auto Cash Out */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={autoCashOut}
                    onChange={(e) => setAutoCashOut(e.target.checked)}
                    className="mr-2"
                    disabled={isPlaying}
                  />
                  <span className="text-white">Auto Cash Out</span>
                </label>
                {autoCashOut && (
                  <input
                    type="number"
                    value={cashOutAt}
                    onChange={(e) => setCashOutAt(Math.max(1.01, Number(e.target.value)))}
                    className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white w-20"
                    min="1.01"
                    step="0.01"
                    disabled={isPlaying}
                  />
                )}
              </div>
              
              {isPlaying && !cashedOut && (
                <button
                  onClick={cashOut}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-8 rounded-xl transition-colors text-xl shadow-lg transform hover:scale-105"
                >
                  💰 CASH OUT: {formatCurrency(betAmount * currentMultiplier)}
                </button>
              )}
            </div>
          </div>


          <RecentBets bets={bets.filter(bet => bet.game === 'Crash')} formatCurrency={formatCurrency} maxBets={5} />
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
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-400"
                min="0.01"
                step="0.01"
                disabled={isPlaying}
              />
              {betError && (
                <div className="mt-2 text-red-400 text-sm">{betError}</div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setBetAmount(prev => roundBetAmount(prev / 2))}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                disabled={isPlaying}
              >
                1/2
              </button>
              <button
                onClick={() => setBetAmount(prev => roundBetAmount(prev * 2))}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                disabled={isPlaying}
              >
                2x
              </button>
            </div>
            
            {user && (
              <div className="mb-4 text-sm text-gray-400">
                Balance: {formatCurrency(user.balance)}
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
                onClick={startGame}
                disabled={isPlaying || !user || betAmount > user.balance || autoBetRunning}
                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isPlaying ? (
                  <>
                    <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                    Playing...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start Game
                  </>
                )}
              </button>
              
              {!isAutoMode ? (
                <button
                  onClick={startAutoPlay}
                  disabled={isPlaying || !user || betAmount > user.balance}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Start Auto
                </button>
              ) : (
                <button
                  onClick={stopAutoPlay}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Stop Auto ({infiniteBet ? '∞' : autoBetCount} left)
                </button>
              )}
            </div>
          </div>
          

          <SettingsManager
            currentGame="crash"
            currentSettings={{
              betAmount,
              cashOutAt,
              autoCashOut,
              maxAutoBets,
              infiniteBet,
              instantBet,
              betSpeed
            }}
            onLoadSettings={loadSettings}
            onSaveSettings={saveSettings}
          />

          {/* Seed Control */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Random Seed</h3>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSeed}
                  onChange={(e) => setNewSeed(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                  placeholder="Enter custom seed"
                />
                <button
                  onClick={handleSeedUpdate}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  Set
                </button>
                <button
                  onClick={generateNewSeed}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Auto-bet Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Auto-Bet Settings
            </h3>
            
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
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-400"
                  min="1"
                  max="10000"
                  disabled={infiniteBet || autoBetRunning}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bet Speed (ms): {betSpeed === 1 ? 'Instant' : betSpeed}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5000"
                  step="1"
                  value={betSpeed}
                  onChange={(e) => setBetSpeed(Number(e.target.value))}
                  className="w-full"
                  disabled={autoBetRunning}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Instant</span>
                  <span>5s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default Crash;