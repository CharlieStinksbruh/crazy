import React, { useState, useEffect } from 'react';
import { TrendingUp, Play, Pause, Settings, RotateCcw, BarChart3, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import { useGameAccess } from '../../hooks/useGameAccess';
import GameDisabledMessage from '../../components/GameDisabledMessage';
import DraggableLiveStats from '../../components/DraggableLiveStats';
import RecentBets from '../../components/RecentBets';
import SettingsManager from '../../components/SettingsManager';

const Limbo = () => {
  const { user, updateBalance, updateStats, formatCurrency } = useAuth();
  const { addBet, bets } = useGame();
  const { isEnabled, isLoading, validateBetAmount } = useGameAccess('limbo');
  
  const [betAmount, setBetAmount] = useState(10);
  const [targetMultiplier, setTargetMultiplier] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [result, setResult] = useState(0);
  const [isWin, setIsWin] = useState(false);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
  
  // Auto-betting states
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [autoBetCount, setAutoBetCount] = useState(0);
  const [maxAutoBets, setMaxAutoBets] = useState(100);
  const [infiniteBet, setInfiniteBet] = useState(false);
  const [autoBetRunning, setAutoBetRunning] = useState(false);
  
  // Advanced auto-bet settings
  const [strategy, setStrategy] = useState<'fixed' | 'martingale' | 'fibonacci'>('fixed');
  const [onWin, setOnWin] = useState<'reset' | 'increase' | 'decrease'>('reset');
  const [onLoss, setOnLoss] = useState<'reset' | 'increase' | 'decrease'>('increase');
  const [increaseBy, setIncreaseBy] = useState(100);
  const [decreaseBy, setDecreaseBy] = useState(50);
  
  // Stop conditions
  const [stopOnProfit, setStopOnProfit] = useState(false);
  const [stopProfitAmount, setStopProfitAmount] = useState(100);
  const [stopOnLoss, setStopOnLoss] = useState(false);
  const [stopLossAmount, setStopLossAmount] = useState(100);
  const [stopOnNextWin, setStopOnNextWin] = useState(false);
  
  // Strategy specific states
  const [baseBet, setBaseBet] = useState(10);
  const [martingaleMultiplier, setMartingaleMultiplier] = useState(2);
  const [fibSequence, setFibSequence] = useState([1, 1]);
  const [fibIndex, setFibIndex] = useState(0);
  
  // Profit tracking
  const [sessionProfit, setSessionProfit] = useState(0);
  const [profitHistory, setProfitHistory] = useState<{value: number, bet: number, timestamp: number}[]>([{value: 0, bet: 0, timestamp: Date.now()}]);
  
  // UI states
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [instantBet, setInstantBet] = useState(false);
  
  // UI states for draggable stats
  const [showLiveStats, setShowLiveStats] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [betsPerSecond, setBetsPerSecond] = useState(0);
  const [betError, setBetError] = useState<string>('');

  // Enhanced statistics
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

  const handlePlay = () => {
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
    setGameResult(null);
    
    // Generate truly random result using crypto.getRandomValues for better randomness
    const randomArray = new Uint32Array(1);
    crypto.getRandomValues(randomArray);
    const randomNum = randomArray[0] / (0xffffffff + 1);
    
    // More accurate limbo distribution - most results between 1x-10x, rare high multipliers
    let finalMultiplier;
    if (randomNum < 0.5) {
      // 50% chance: 1.00x - 2.00x
      finalMultiplier = 1 + randomNum * 2;
    } else if (randomNum < 0.8) {
      // 30% chance: 2.00x - 5.00x
      finalMultiplier = 2 + (randomNum - 0.5) * 10;
    } else if (randomNum < 0.95) {
      // 15% chance: 5.00x - 20.00x
      finalMultiplier = 5 + (randomNum - 0.8) * 100;
    } else {
      // 5% chance: 20.00x - 1000.00x
      finalMultiplier = 20 + (randomNum - 0.95) * 19600;
    }
    
    finalMultiplier = Math.max(1.01, Math.min(1000, finalMultiplier));
    
    setResult(finalMultiplier);
    
    // Animate multiplier
    const duration = instantBet ? 100 : 2000;
    const startTime = Date.now();
    
    const animateMultiplier = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const current = 1 + (finalMultiplier - 1) * progress;
      setCurrentMultiplier(current);
      
      if (progress < 1) {
        requestAnimationFrame(animateMultiplier);
      } else {
        // Game complete
        const won = finalMultiplier >= targetMultiplier;
        setIsWin(won);
        setGameResult(won ? 'win' : 'lose');
        
        const winAmount = won ? betAmount * targetMultiplier : 0;
        const profit = winAmount - betAmount;
        
        // Always update balance - deduct bet amount and add winnings if any
        updateBalance(-betAmount);
        if (won) {
          updateBalance(winAmount);
        }
        
        updateStats(betAmount, winAmount);
        
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
        
        addBet({
          game: 'Limbo',
          betAmount,
          winAmount,
          multiplier: won ? targetMultiplier : 0,
          result: { target: targetMultiplier, actual: finalMultiplier, won },
        });
        
        setIsPlaying(false);
        
        // Handle auto-betting
        if (isAutoMode && autoBetRunning) {
          handleAutoBetResult(won, profit);
        }
      }
    };
    
    animateMultiplier();
  };

  const handleAutoBetResult = (won: boolean, profit: number) => {
    // Check stop on next win
    if (stopOnNextWin && won) {
      stopAutoPlay();
      setStopOnNextWin(false);
      return;
    }
    
    // Check stop conditions
    if (stopOnProfit && sessionProfit >= stopProfitAmount) {
      stopAutoPlay();
      return;
    }
    
    if (stopOnLoss && sessionProfit <= -stopLossAmount) {
      stopAutoPlay();
      return;
    }
    
    // Calculate new bet amount based on strategy
    let newBetAmount = betAmount;
    
    switch (strategy) {
      case 'fixed':
        if (won) {
          switch (onWin) {
            case 'increase':
              newBetAmount = betAmount + (betAmount * increaseBy / 100);
              break;
            case 'decrease':
              newBetAmount = betAmount - (betAmount * decreaseBy / 100);
              break;
            case 'reset':
              newBetAmount = baseBet;
              break;
          }
        } else {
          switch (onLoss) {
            case 'increase':
              newBetAmount = betAmount + (betAmount * increaseBy / 100);
              break;
            case 'decrease':
              newBetAmount = betAmount - (betAmount * decreaseBy / 100);
              break;
            case 'reset':
              newBetAmount = baseBet;
              break;
          }
        }
        break;
        
      case 'martingale':
        if (won) {
          newBetAmount = baseBet;
        } else {
          newBetAmount = betAmount * martingaleMultiplier;
        }
        break;
        
      case 'fibonacci':
        if (won) {
          setFibIndex(Math.max(0, fibIndex - 2));
          newBetAmount = baseBet * fibSequence[Math.max(0, fibIndex - 2)];
        } else {
          const nextIndex = fibIndex + 1;
          if (nextIndex >= fibSequence.length) {
            const newFib = fibSequence[fibSequence.length - 1] + fibSequence[fibSequence.length - 2];
            setFibSequence(prev => [...prev, newFib]);
          }
          setFibIndex(nextIndex);
          newBetAmount = baseBet * (fibSequence[nextIndex] || 1);
        }
        break;
    }
    
    const finalBetAmount = roundBetAmount(Math.max(0.01, newBetAmount));
    
    // Check if user has enough balance for the new bet amount
    if (user && finalBetAmount > user.balance) {
      // If not enough balance, stop auto-betting
      stopAutoPlay();
      return;
    }
    
    setBetAmount(finalBetAmount);
    setAutoBetCount(prev => prev - 1);
    
    if (autoBetCount <= 1 && !infiniteBet) {
      stopAutoPlay();
    }
  };

  const startAutoPlay = () => {
    setIsAutoMode(true);
    setAutoBetRunning(true);
    setAutoBetCount(infiniteBet ? Infinity : maxAutoBets);
    setBaseBet(betAmount);
    if (!sessionStartTime) {
      setSessionStartTime(Date.now());
    }
    setFibIndex(0);
  };

  const stopAutoPlay = () => {
    setIsAutoMode(false);
    setAutoBetRunning(false);
    setAutoBetCount(0);
    setBetAmount(originalBetAmount || baseBet);
    setStopOnNextWin(false);
  };

  const saveSettings = () => {
    const settings = {
      betAmount,
      targetMultiplier,
      strategy,
      onWin,
      onLoss,
      increaseBy,
      decreaseBy,
      maxAutoBets,
      infiniteBet,
      instantBet,
      stopOnProfit,
      stopProfitAmount,
      stopOnLoss,
      stopLossAmount,
      martingaleMultiplier
    };
    saveGameSettings('limbo', settings);
  };

  const loadSettings = (settings: any) => {
    if (settings.betAmount) setBetAmount(settings.betAmount);
    if (settings.targetMultiplier) setTargetMultiplier(settings.targetMultiplier);
    if (settings.strategy) setStrategy(settings.strategy);
    if (settings.onWin) setOnWin(settings.onWin);
    if (settings.onLoss) setOnLoss(settings.onLoss);
    if (settings.increaseBy) setIncreaseBy(settings.increaseBy);
    if (settings.decreaseBy) setDecreaseBy(settings.decreaseBy);
    if (settings.maxAutoBets) setMaxAutoBets(settings.maxAutoBets);
    if (settings.infiniteBet !== undefined) setInfiniteBet(settings.infiniteBet);
    if (settings.instantBet !== undefined) setInstantBet(settings.instantBet);
    if (settings.stopOnProfit !== undefined) setStopOnProfit(settings.stopOnProfit);
    if (settings.stopProfitAmount) setStopProfitAmount(settings.stopProfitAmount);
    if (settings.stopOnLoss !== undefined) setStopOnLoss(settings.stopOnLoss);
    if (settings.stopLossAmount) setStopLossAmount(settings.stopLossAmount);
    if (settings.martingaleMultiplier) setMartingaleMultiplier(settings.martingaleMultiplier);
  };

  const resetProfitGraph = () => {
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

  // Enhanced profit graph component
  const ProfitGraph = () => {
    const values = profitHistory.map(p => p.value);
    const maxProfit = Math.max(...values, 10);
    const minProfit = Math.min(...values, -10);
    const range = maxProfit - minProfit || 20;
    const width = 100;
    const height = 100;
    
    return (
      <div className="relative h-40 bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
        <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          <line 
            x1="0" 
            y1={height - ((0 - minProfit) / range) * height} 
            x2={width} 
            y2={height - ((0 - minProfit) / range) * height}
            stroke="#6b7280" 
            strokeWidth="1" 
            strokeDasharray="2,2"
            opacity="0.7"
          />
          
          <polyline
            fill="none"
            stroke={sessionProfit >= 0 ? "#10b981" : "#ef4444"}
            strokeWidth="1.5"
            points={profitHistory.map((point, index) => 
              `${(index / Math.max(profitHistory.length - 1, 1)) * width},${height - ((point.value - minProfit) / range) * height}`
            ).join(' ')}
          />
          
          {profitHistory.length > 1 && (
            <circle
              cx={(profitHistory.length - 1) / Math.max(profitHistory.length - 1, 1) * width}
              cy={height - ((sessionProfit - minProfit) / range) * height}
              r="1.5"
              fill={sessionProfit >= 0 ? "#10b981" : "#ef4444"}
            />
          )}
        </svg>
        
        <div className="absolute top-2 left-2 text-xs font-semibold bg-gray-800 px-2 py-1 rounded">
          <span className={sessionProfit >= 0 ? 'text-green-400' : 'text-red-400'}>
            ${sessionProfit.toFixed(2)}
          </span>
        </div>
        <div className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
          Max: ${maxProfit.toFixed(2)}
        </div>
        <div className="absolute bottom-2 left-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
          Min: ${minProfit.toFixed(2)}
        </div>
        <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
          {profitHistory.length - 1} bets
        </div>
      </div>
    );
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
        handlePlay();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAutoMode, autoBetRunning, autoBetCount, isPlaying]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isEnabled) {
    return <GameDisabledMessage gameName="Limbo" />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game Panel */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-8 h-8 text-green-400 mr-3" />
              <h1 className="text-2xl font-bold text-white">Limbo</h1>
            </div>
            
            {/* Multiplier Display */}
            <div className="bg-gray-900 rounded-lg p-8 mb-6">
              <div className="text-center">
                <div className="text-8xl font-bold text-white mb-4">
                  {currentMultiplier.toFixed(2)}x
                </div>
                <div className="text-xl text-gray-400 mb-6">
                  Target: {targetMultiplier.toFixed(2)}x
                </div>
                
                {/* Fixed height container for result to prevent jumping */}
                <div className="h-12 flex items-center justify-center">
                  {result !== null && (
                    <div className="text-center">
                      <div className="text-base text-gray-300">
                        Result: {result.toFixed(2)}x
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Target Multiplier Control */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Multiplier: {targetMultiplier.toFixed(2)}x
              </label>
              <input
                type="range"
                min="1.01"
                max="100"
                step="0.01"
                value={targetMultiplier}
                onChange={(e) => setTargetMultiplier(Number(e.target.value))}
                className="w-full"
                disabled={isPlaying || autoBetRunning}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1.01x</span>
                <span>100x</span>
              </div>
              <div className="grid grid-cols-4 gap-1 mt-2">
                {[1.5, 2, 5, 10].map(mult => (
                  <button
                    key={mult}
                    onClick={() => setTargetMultiplier(mult)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      targetMultiplier === mult 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    disabled={isPlaying || autoBetRunning}
                  >
                    {mult}x
                  </button>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-lg text-yellow-400 font-semibold">
                Potential Win: ${(betAmount * targetMultiplier).toFixed(2)}
              </div>
            </div>
          </div>

          <RecentBets bets={bets.filter(bet => bet.game === 'Limbo')} formatCurrency={formatCurrency} maxBets={5} />
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
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                min="0.01"
                step="0.01"
                disabled={isPlaying || autoBetRunning}
              />
              {betError && (
                <div className="mt-2 text-red-400 text-sm">{betError}</div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setBetAmount(prev => prev / 2)}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                disabled={isPlaying || autoBetRunning}
              >
                1/2
              </button>
              <button
                onClick={() => setBetAmount(prev => prev * 2)}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                disabled={isPlaying || autoBetRunning}
              >
                2x
              </button>
            </div>
            
            {user && (
              <div className="mb-4 text-sm text-gray-400">
                Balance: ${user.balance.toFixed(2)}
              </div>
            )}
            
            <div className="space-y-2">
              <button
                onClick={handlePlay}
                disabled={isPlaying || !user || betAmount > user.balance || autoBetRunning}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isPlaying ? (
                  <>
                    <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                    Playing...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Play
                  </>
                )}
              </button>
              
              {!autoBetRunning ? (
                <button
                  onClick={startAutoPlay}
                  disabled={isPlaying || !user || betAmount > user.balance}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Start Auto
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={stopAutoPlay}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    Stop Auto {infiniteBet ? '(∞)' : `(${autoBetCount} left)`}
                  </button>
                  
                  <button
                    onClick={() => setStopOnNextWin(true)}
                    disabled={stopOnNextWin}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    {stopOnNextWin ? 'Will Stop on Next Win' : 'Stop on Next Win'}
                  </button>
                </div>
              )}
            </div>
            
            {/* Live Stats Toggle */}
            <button
              onClick={() => setShowLiveStats(true)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center mt-2"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Show Live Stats
            </button>
          </div>
          

          <SettingsManager
            currentGame="limbo"
            currentSettings={{
              betAmount,
              targetMultiplier,
              strategy,
              onWin,
              onLoss,
              increaseBy,
              decreaseBy,
              maxAutoBets,
              infiniteBet,
              instantBet,
              stopOnProfit,
              stopProfitAmount,
              stopOnLoss,
              stopLossAmount,
              martingaleMultiplier
            }}
            onLoadSettings={loadSettings}
            onSaveSettings={saveSettings}
          />

          {/* Advanced Auto-bet Settings */}
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
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Number of Bets
                </label>
                <input
                  type="number"
                  value={maxAutoBets}
                  onChange={(e) => setMaxAutoBets(Number(e.target.value))}
                  className={`w-full px-3 py-2 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400 ${
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
              
              {showAdvanced && (
                <>
                  {/* Strategy Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Strategy
                    </label>
                    <select
                      value={strategy}
                      onChange={(e) => setStrategy(e.target.value as any)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                      disabled={autoBetRunning}
                    >
                      <option value="fixed">Fixed Bet</option>
                      <option value="martingale">Martingale</option>
                      <option value="fibonacci">Fibonacci</option>
                    </select>
                  </div>
                  
                  {/* Fixed Strategy Settings */}
                  {strategy === 'fixed' && (
                    <div className="bg-gray-700 rounded-lg p-3">
                      <h5 className="text-white font-medium mb-3">Fixed Strategy Settings</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-300 mb-1">On Win</label>
                          <select
                            value={onWin}
                            onChange={(e) => setOnWin(e.target.value as any)}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                            disabled={autoBetRunning}
                          >
                            <option value="reset">Reset to Base</option>
                            <option value="increase">Increase Bet</option>
                            <option value="decrease">Decrease Bet</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-1">On Loss</label>
                          <select
                            value={onLoss}
                            onChange={(e) => setOnLoss(e.target.value as any)}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                            disabled={autoBetRunning}
                          >
                            <option value="reset">Reset to Base</option>
                            <option value="increase">Increase Bet</option>
                            <option value="decrease">Decrease Bet</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <label className="block text-sm text-gray-300 mb-1">Increase By (%)</label>
                          <input
                            type="number"
                            value={increaseBy}
                            onChange={(e) => setIncreaseBy(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                            min="1"
                            disabled={autoBetRunning}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-1">Decrease By (%)</label>
                          <input
                            type="number"
                            value={decreaseBy}
                            onChange={(e) => setDecreaseBy(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                            min="1"
                            max="99"
                            disabled={autoBetRunning}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Stop Conditions */}
                  <div className="bg-gray-700 rounded-lg p-3">
                    <h5 className="text-white font-medium mb-3">Stop Conditions</h5>
                    
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={stopOnProfit}
                          onChange={(e) => setStopOnProfit(e.target.checked)}
                          className="mr-2"
                          disabled={autoBetRunning}
                        />
                        <span className="text-white text-sm">Stop on profit:</span>
                        <input
                          type="number"
                          value={stopProfitAmount}
                          onChange={(e) => setStopProfitAmount(Number(e.target.value))}
                          className="ml-2 w-20 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                          disabled={!stopOnProfit || autoBetRunning}
                        />
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={stopOnLoss}
                          onChange={(e) => setStopOnLoss(e.target.checked)}
                          className="mr-2"
                          disabled={autoBetRunning}
                        />
                        <span className="text-white text-sm">Stop on loss:</span>
                        <input
                          type="number"
                          value={stopLossAmount}
                          onChange={(e) => setStopLossAmount(Number(e.target.value))}
                          className="ml-2 w-20 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                          disabled={!stopOnLoss || autoBetRunning}
                        />
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Draggable Live Stats */}
      <DraggableLiveStats
        sessionStats={sessionStats}
        sessionProfit={sessionProfit}
        profitHistory={profitHistory}
        onReset={resetProfitGraph}
        formatCurrency={formatCurrency}
        startTime={sessionStartTime}
        betsPerSecond={betsPerSecond}
        isOpen={showLiveStats}
        onClose={() => setShowLiveStats(false)}
      />
    </div>
  );
};

export default Limbo;