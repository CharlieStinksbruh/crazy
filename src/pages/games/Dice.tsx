import React, { useState, useEffect } from 'react';
import { Dice6, Play, Pause, Settings, RotateCcw, BarChart3, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import { useGameAccess } from '../../hooks/useGameAccess';
import GameDisabledMessage from '../../components/GameDisabledMessage';
import DraggableLiveStats from '../../components/DraggableLiveStats';
import RecentBets from '../../components/RecentBets';
import SettingsManager from '../../components/SettingsManager';

const Dice = () => {
  const { user, updateBalance, updateStats, formatCurrency } = useAuth();
  const { addBet, generateSeededRandom, saveGameSettings, loadGameSettings, bets, setSeed, seed } = useGame();
  const { isEnabled, isLoading, validateBetAmount } = useGameAccess('dice');
  
  const [betAmount, setBetAmount] = useState(10);
  const [originalBetAmount, setOriginalBetAmount] = useState(10);
  const [winChance, setWinChance] = useState(50);
  const [isRolling, setIsRolling] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [isWin, setIsWin] = useState(false);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
  const [rollType, setRollType] = useState<'under' | 'over'>('under');
  
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
  const [betSpeed, setBetSpeed] = useState(1000);
  
  // UI states for draggable stats
  const [showLiveStats, setShowLiveStats] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [betsPerSecond, setBetsPerSecond] = useState(0);
  const [newSeed, setNewSeed] = useState(seed);
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

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = loadGameSettings('dice');
    if (savedSettings.betAmount) setBetAmount(savedSettings.betAmount);
    if (savedSettings.winChance) setWinChance(savedSettings.winChance);
    if (savedSettings.rollType) setRollType(savedSettings.rollType);
    if (savedSettings.strategy) setStrategy(savedSettings.strategy);
    if (savedSettings.onWin) setOnWin(savedSettings.onWin);
    if (savedSettings.onLoss) setOnLoss(savedSettings.onLoss);
    if (savedSettings.increaseBy) setIncreaseBy(savedSettings.increaseBy);
    if (savedSettings.decreaseBy) setDecreaseBy(savedSettings.decreaseBy);
    if (savedSettings.maxAutoBets) setMaxAutoBets(savedSettings.maxAutoBets);
    if (savedSettings.infiniteBet !== undefined) setInfiniteBet(savedSettings.infiniteBet);
    if (savedSettings.instantBet !== undefined) setInstantBet(savedSettings.instantBet);
    if (savedSettings.betSpeed) setBetSpeed(savedSettings.betSpeed);
    if (savedSettings.stopOnProfit !== undefined) setStopOnProfit(savedSettings.stopOnProfit);
    if (savedSettings.stopProfitAmount) setStopProfitAmount(savedSettings.stopProfitAmount);
    if (savedSettings.stopOnLoss !== undefined) setStopOnLoss(savedSettings.stopOnLoss);
    if (savedSettings.stopLossAmount) setStopLossAmount(savedSettings.stopLossAmount);
    if (savedSettings.martingaleMultiplier) setMartingaleMultiplier(savedSettings.martingaleMultiplier);
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

  const rollDice = () => {
    if (!user || betAmount > user.balance) return;

    // Validate bet amount against admin settings
    const validation = validateBetAmount(betAmount);
    if (!validation.isValid) {
      setBetError(validation.message || 'Invalid bet amount');
      setTimeout(() => setBetError(''), 3000);
      return;
    }

    setBetError('');
    setIsRolling(true);
    setGameResult(null);
    
    // Generate random number between 0-100 using crypto for better randomness
    const randomArray = new Uint32Array(1);
    crypto.getRandomValues(randomArray);
    const result = (randomArray[0] / (0xffffffff + 1)) * 100;
    
    setDiceResult(result);
    
    // Determine win/loss
    let won = false;
    if (rollType === 'under') {
      won = result < winChance;
    } else {
      won = result > (100 - winChance);
    }
    
    setIsWin(won);
    setGameResult(won ? 'win' : 'lose');
    
    // Calculate payout
    const multiplier = 100 / winChance;
    const winAmount = won ? betAmount * multiplier : 0;
    const profit = winAmount - betAmount;
    
    // Update profit tracking FIRST
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
    
    // Update balance and stats in auth context
    if (user) {
      updateBalance(profit);
    }
    
    // Add bet to game context
    addBet({
      game: 'Dice',
      betAmount,
      winAmount,
      multiplier: won ? multiplier : 0,
      result: { target: winChance, actual: result, won, rollType },
    });
    
    setTimeout(() => {
      setIsRolling(false);
      
      // Handle auto-betting
      if (isAutoMode && autoBetRunning) {
        handleAutoBetResult(won, profit);
      }
    }, instantBet ? betSpeed : 1000);
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
    setOriginalBetAmount(betAmount);
    if (!sessionStartTime) {
      setSessionStartTime(Date.now());
    }
    setFibIndex(0);
  };

  const stopAutoPlay = () => {
    setIsAutoMode(false);
    setAutoBetRunning(false);
    setAutoBetCount(0);
    setBetAmount(originalBetAmount);
    setStopOnNextWin(false);
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
      winChance,
      rollType,
      strategy,
      onWin,
      onLoss,
      increaseBy,
      decreaseBy,
      maxAutoBets,
      infiniteBet,
      instantBet,
      betSpeed,
      stopOnProfit,
      stopProfitAmount,
      stopOnLoss,
      stopLossAmount,
      martingaleMultiplier
    };
    saveGameSettings('dice', settings);
  };

  const loadSettings = (settings: any) => {
    if (settings.betAmount) setBetAmount(settings.betAmount);
    if (settings.winChance) setWinChance(settings.winChance);
    if (settings.rollType) setRollType(settings.rollType);
    if (settings.strategy) setStrategy(settings.strategy);
    if (settings.onWin) setOnWin(settings.onWin);
    if (settings.onLoss) setOnLoss(settings.onLoss);
    if (settings.increaseBy) setIncreaseBy(settings.increaseBy);
    if (settings.decreaseBy) setDecreaseBy(settings.decreaseBy);
    if (settings.maxAutoBets) setMaxAutoBets(settings.maxAutoBets);
    if (settings.infiniteBet !== undefined) setInfiniteBet(settings.infiniteBet);
    if (settings.instantBet !== undefined) setInstantBet(settings.instantBet);
    if (settings.betSpeed) setBetSpeed(settings.betSpeed);
    if (settings.stopOnProfit !== undefined) setStopOnProfit(settings.stopOnProfit);
    if (settings.stopProfitAmount) setStopProfitAmount(settings.stopProfitAmount);
    if (settings.stopOnLoss !== undefined) setStopOnLoss(settings.stopOnLoss);
    if (settings.stopLossAmount) setStopLossAmount(settings.stopLossAmount);
    if (settings.martingaleMultiplier) setMartingaleMultiplier(settings.martingaleMultiplier);
  };

  const handleSeedUpdate = () => {
    setSeed(newSeed);
  };

  const generateNewSeed = () => {
    const newRandomSeed = Math.random().toString(36).substring(2, 15);
    setNewSeed(newRandomSeed);
    setSeed(newRandomSeed);
  };

  const multiplier = rollType === 'under' ? 100 / winChance : 100 / (100 - winChance);

  useEffect(() => {
    if (isAutoMode && autoBetRunning && (autoBetCount > 0 || infiniteBet) && !isRolling) {
      const timer = setTimeout(() => {
        // Validate bet amount before auto-betting
        const validation = validateBetAmount(betAmount);
        if (!validation.isValid) {
          stopAutoPlay();
          setBetError(validation.message || 'Invalid bet amount');
          setTimeout(() => setBetError(''), 3000);
          return;
        }
        rollDice();
      }, betSpeed);
      return () => clearTimeout(timer);
    }
  }, [isAutoMode, autoBetRunning, autoBetCount, isRolling, betSpeed]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isEnabled) {
    return <GameDisabledMessage gameName="Dice" />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Game Panel - Now at the top */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8 col-span-full">
        <div className="flex items-center mb-6">
          <Dice6 className="w-8 h-8 text-blue-400 mr-3" />
          <h1 className="text-2xl font-bold text-white">Dice</h1>
        </div>
        
        {/* Dice Display with Slider */}
        <div className="bg-gray-900 rounded-lg p-8 mb-6">
          <div className="mb-4">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-white mb-2">
                Roll {rollType === 'under' ? 'Under' : 'Over'} {rollType === 'under' ? winChance : (100 - winChance)}
              </div>
              <div className="text-lg text-yellow-400 font-semibold">
                Multiplier: {multiplier.toFixed(2)}x
              </div>
            </div>
            
            {/* Dice Slider */}
            <div className="relative mb-4">
              <div className="w-full h-8 bg-gray-700 rounded-lg relative overflow-hidden">
                {/* Win/Lose zones */}
                <div 
                  className="absolute top-0 left-0 h-full bg-green-500 opacity-30"
                  style={{ 
                    width: rollType === 'under' ? `${winChance}%` : `${100 - winChance}%`,
                    left: rollType === 'under' ? '0%' : `${winChance}%`
                  }}
                />
                <div 
                  className="absolute top-0 h-full bg-red-500 opacity-30"
                  style={{ 
                    width: rollType === 'under' ? `${100 - winChance}%` : `${winChance}%`,
                    left: rollType === 'under' ? `${winChance}%` : '0%'
                  }}
                />
                
                {/* Number markers */}
                <div className="absolute inset-0 flex items-center justify-between px-2">
                  <span className="text-white text-xs">0</span>
                  <span className="text-white text-xs">25</span>
                  <span className="text-white text-xs">50</span>
                  <span className="text-white text-xs">75</span>
                  <span className="text-white text-xs">100</span>
                </div>
                
                {/* Result arrow */}
                {diceResult !== null && (
                  <div 
                    className="absolute top-0 h-full w-0.5 bg-white shadow-lg transition-all duration-500"
                    style={{ left: `${diceResult}%` }}
                  >
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-0 h-0 border-l-1 border-r-1 border-b-3 border-l-transparent border-r-transparent border-b-white"></div>
                    </div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 px-1.5 py-0.5 rounded text-xs font-bold whitespace-nowrap">
                      {diceResult.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Fixed height container for result to prevent jumping */}
            <div className="h-12 flex items-center justify-center">
              {gameResult && (
                <div className="text-center">
                  <div className={`text-2xl font-bold ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                    {isWin ? 'WIN!' : 'LOSE!'}
                  </div>
                  <div className="text-base text-gray-300">
                    {isWin ? `+${formatCurrency(betAmount * multiplier - betAmount)}` : `-${formatCurrency(betAmount)}`}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Win Chance Slider with Dynamic Colors */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white text-sm">Win Chance: {winChance}%</span>
              <span className="text-yellow-400 text-sm">Multiplier: {multiplier.toFixed(2)}x</span>
            </div>
            
            {/* Custom slider with dynamic colors based on win chance */}
            <div className="relative">
              <input
                type="range"
                min="1"
                max="95"
                value={winChance}
                onChange={(e) => setWinChance(Number(e.target.value))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-gray-700"
                disabled={isRolling || autoBetRunning}
              />
              <style jsx>{`
                input[type="range"]::-webkit-slider-thumb {
                  appearance: none;
                  height: 20px;
                  width: 20px;
                  border-radius: 50%;
                  background: #ffffff;
                  cursor: pointer;
                  border: 2px solid #374151;
                }
                input[type="range"]::-moz-range-thumb {
                  height: 20px;
                  width: 20px;
                  border-radius: 50%;
                  background: #ffffff;
                  cursor: pointer;
                  border: 2px solid #374151;
                }
              `}</style>
            </div>
            
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1%</span>
              <span>95%</span>
            </div>
          </div>
          
          {/* Roll Type Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-700 rounded-lg p-1 flex">
              <button
                onClick={() => setRollType('under')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  rollType === 'under' 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
                disabled={isRolling || autoBetRunning}
              >
                Roll Under
              </button>
              <button
                onClick={() => setRollType('over')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  rollType === 'over' 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
                disabled={isRolling || autoBetRunning}
              >
                Roll Over
              </button>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg text-yellow-400 font-semibold">
              Potential Win: {formatCurrency(betAmount * multiplier)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                min="0.01"
                step="0.01"
                disabled={isRolling || autoBetRunning}
              />
              {betError && (
                <div className="mt-2 text-red-400 text-sm">{betError}</div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setBetAmount(prev => roundBetAmount(prev / 2))}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                disabled={isRolling || autoBetRunning}
              >
                1/2
              </button>
              <button
                onClick={() => setBetAmount(prev => roundBetAmount(prev * 2))}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                disabled={isRolling || autoBetRunning}
              >
                2x
              </button>
            </div>
            
            {user && (
              <div className="mb-4 text-sm text-gray-400">
                Balance: {formatCurrency(user.balance)}
              </div>
            )}
            
            <div className="space-y-2">
              <button
                onClick={rollDice}
                disabled={isRolling || !user || betAmount > user.balance || autoBetRunning}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isRolling ? (
                  <>
                    <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                    Rolling...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Roll Dice
                  </>
                )}
              </button>
              
              {!autoBetRunning ? (
                <button
                  onClick={startAutoPlay}
                  disabled={isRolling || !user || betAmount > user.balance}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
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
          </div>
          
          {/* Live Stats Toggle - Moved below bet buttons */}
          <button
            onClick={() => setShowLiveStats(!showLiveStats)}
            className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center ${
              showLiveStats 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            {showLiveStats ? 'Hide Live Stats' : 'Show Live Stats'}
          </button>

          <SettingsManager
            currentGame="dice"
            currentSettings={{
              betAmount,
              winChance,
              rollType,
              strategy,
              onWin,
              onLoss,
              increaseBy,
              decreaseBy,
              maxAutoBets,
              infiniteBet,
              instantBet,
              betSpeed,
              stopOnProfit,
              stopProfitAmount,
              stopOnLoss,
              stopLossAmount,
              martingaleMultiplier
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
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
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
          
          {/* Advanced Auto-bet Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-6">
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
                  className={`w-full px-3 py-2 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    infiniteBet ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-700'
                  }`}
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
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                  
                  {/* Martingale Strategy Settings */}
                  {strategy === 'martingale' && (
                    <div className="bg-gray-700 rounded-lg p-3">
                      <h5 className="text-white font-medium mb-3">Martingale Settings</h5>
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Loss Multiplier</label>
                        <input
                          type="number"
                          value={martingaleMultiplier}
                          onChange={(e) => setMartingaleMultiplier(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                          min="1.1"
                          max="10"
                          step="0.1"
                          disabled={autoBetRunning}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Multiply bet by this amount after each loss
                        </p>
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
        
        {/* Statistics and Info Panel */}
        <div className="space-y-6">
          {/* Game Statistics */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Session Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{sessionStats.totalBets}</div>
                <div className="text-sm text-gray-400">Total Bets</div>
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
          
          {/* Game Tips */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Dice Game Tips</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Higher win chances provide more consistent results but lower payouts</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Use auto-betting to remove emotion from your decisions</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Set stop-loss limits to protect your bankroll</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Track your statistics to improve your strategy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Bets moved to bottom */}
      <div className="mt-8">
        <RecentBets bets={bets.filter(bet => bet.game === 'Dice')} formatCurrency={formatCurrency} maxBets={5} />
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

export default Dice;