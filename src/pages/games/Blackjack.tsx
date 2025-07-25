import React, { useState, useEffect } from 'react';
import { Target, Play, Pause, Settings, RotateCcw, BarChart3, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import { useGameAccess } from '../../hooks/useGameAccess';
import GameDisabledMessage from '../../components/GameDisabledMessage';
import DraggableLiveStats from '../../components/DraggableLiveStats';
import RecentBets from '../../components/RecentBets';
import SettingsManager from '../../components/SettingsManager';

interface Card {
  suit: string;
  value: string;
  numValue: number;
}

const Blackjack = () => {
  const { user, updateBalance, formatCurrency } = useAuth();
  const { addBet, generateSeededRandom, saveGameSettings, loadGameSettings, bets, setSeed, seed } = useGame();
  const { isEnabled, isLoading, validateBetAmount } = useGameAccess('blackjack');
  
  const [betAmount, setBetAmount] = useState(10);
  const [originalBetAmount, setOriginalBetAmount] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [gameResult, setGameResult] = useState<{ result: string; profit: number } | null>(null);
  const [canHit, setCanHit] = useState(false);
  const [canStand, setCanStand] = useState(false);
  const [canDouble, setCanDouble] = useState(false);
  const [showDealerCard, setShowDealerCard] = useState(false);
  
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

  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = loadGameSettings('blackjack');
    if (savedSettings.betAmount) setBetAmount(savedSettings.betAmount);
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
    if (amount < 1) return Math.round(amount * 100) / 100;
    if (amount < 10) return Math.round(amount * 10) / 10;
    return Math.round(amount);
  };

  const createCard = (): Card => {
    const randomArray = new Uint32Array(2);
    crypto.getRandomValues(randomArray);
    
    const suit = suits[randomArray[0] % suits.length];
    const value = values[randomArray[1] % values.length];
    
    let numValue = 0;
    if (value === 'A') {
      numValue = 11; // Will be adjusted later if needed
    } else if (['J', 'Q', 'K'].includes(value)) {
      numValue = 10;
    } else {
      numValue = parseInt(value);
    }
    
    return { suit, value, numValue };
  };

  const calculateScore = (cards: Card[]): number => {
    let score = 0;
    let aces = 0;
    
    for (const card of cards) {
      if (card.value === 'A') {
        aces++;
        score += 11;
      } else {
        score += card.numValue;
      }
    }
    
    // Adjust for aces
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }
    
    return score;
  };

  const dealInitialCards = () => {
    const playerCard1 = createCard();
    const playerCard2 = createCard();
    const dealerCard1 = createCard();
    const dealerCard2 = createCard();
    
    const newPlayerCards = [playerCard1, playerCard2];
    const newDealerCards = [dealerCard1, dealerCard2];
    
    setPlayerCards(newPlayerCards);
    setDealerCards(newDealerCards);
    
    const newPlayerScore = calculateScore(newPlayerCards);
    const newDealerScore = calculateScore(newDealerCards);
    
    setPlayerScore(newPlayerScore);
    setDealerScore(newDealerScore);
    
    // Check for blackjack
    if (newPlayerScore === 21) {
      if (newDealerScore === 21) {
        endGame('push', 0);
      } else {
        endGame('blackjack', betAmount * 1.5);
      }
    } else {
      setCanHit(true);
      setCanStand(true);
      setCanDouble(newPlayerCards.length === 2 && betAmount * 2 <= (user?.balance || 0));
    }
  };

  const hit = () => {
    const newCard = createCard();
    const newPlayerCards = [...playerCards, newCard];
    setPlayerCards(newPlayerCards);
    
    const newScore = calculateScore(newPlayerCards);
    setPlayerScore(newScore);
    
    setCanDouble(false);
    
    if (newScore > 21) {
      endGame('bust', -betAmount);
    } else if (newScore === 21) {
      stand();
    }
  };

  const stand = () => {
    setCanHit(false);
    setCanStand(false);
    setCanDouble(false);
    setShowDealerCard(true);
    
    // Dealer plays
    let currentDealerCards = [...dealerCards];
    let currentDealerScore = calculateScore(currentDealerCards);
    
    while (currentDealerScore < 17) {
      const newCard = createCard();
      currentDealerCards.push(newCard);
      currentDealerScore = calculateScore(currentDealerCards);
    }
    
    setDealerCards(currentDealerCards);
    setDealerScore(currentDealerScore);
    
    // Determine winner
    if (currentDealerScore > 21) {
      endGame('dealer_bust', betAmount);
    } else if (playerScore > currentDealerScore) {
      endGame('win', betAmount);
    } else if (playerScore < currentDealerScore) {
      endGame('lose', -betAmount);
    } else {
      endGame('push', 0);
    }
  };

  const double = () => {
    if (betAmount * 2 > (user?.balance || 0)) return;
    
    setBetAmount(betAmount * 2);
    const newCard = createCard();
    const newPlayerCards = [...playerCards, newCard];
    setPlayerCards(newPlayerCards);
    
    const newScore = calculateScore(newPlayerCards);
    setPlayerScore(newScore);
    
    if (newScore > 21) {
      endGame('bust', -betAmount * 2);
    } else {
      stand();
    }
  };

  const endGame = (result: string, profit: number) => {
    setCanHit(false);
    setCanStand(false);
    setCanDouble(false);
    setShowDealerCard(true);
    
    const won = profit > 0;
    const winAmount = betAmount + profit;
    
    setGameResult({ result, profit });
    
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
    
    // Update balance using auth context
    updateBalance(profit);
    
    // Add bet to game context
    addBet({
      game: 'Blackjack',
      betAmount,
      winAmount,
      multiplier: won ? (winAmount / betAmount) : 0,
      result: { playerScore, dealerScore, result },
    });
    
    setTimeout(() => {
      setIsPlaying(false);
      
      // Handle auto-betting
      if (isAutoMode && autoBetRunning) {
        handleAutoBetResult(won, profit);
      }
    }, instantBet ? betSpeed : 2000);
  };

  const startGame = () => {
    if (!user || betAmount > user.balance) return;

    const validation = validateBetAmount(betAmount);
    if (!validation.isValid) {
      setBetError(validation.message || 'Invalid bet amount');
      setTimeout(() => setBetError(''), 3000);
      return;
    }

    setBetError('');
    setIsPlaying(true);
    setGameResult(null);
    setPlayerCards([]);
    setDealerCards([]);
    setPlayerScore(0);
    setDealerScore(0);
    setCanHit(false);
    setCanStand(false);
    setCanDouble(false);
    setShowDealerCard(false);
    
    setTimeout(() => {
      dealInitialCards();
    }, 500);
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
    saveGameSettings('blackjack', settings);
  };

  const loadSettings = (settings: any) => {
    if (settings.betAmount) setBetAmount(settings.betAmount);
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

  const renderCard = (card: Card, hidden = false) => {
    if (hidden) {
      return (
        <div className="w-16 h-24 bg-blue-600 rounded-lg border-2 border-blue-700 flex items-center justify-center">
          <div className="text-white text-xs">?</div>
        </div>
      );
    }
    
    const isRed = card.suit === '♥' || card.suit === '♦';
    
    return (
      <div className={`w-16 h-24 bg-white rounded-lg border-2 border-gray-300 flex flex-col items-center justify-center ${isRed ? 'text-red-600' : 'text-black'}`}>
        <div className="text-xs font-bold">{card.value}</div>
        <div className="text-lg">{card.suit}</div>
      </div>
    );
  };

  useEffect(() => {
    if (isAutoMode && autoBetRunning && (autoBetCount > 0 || infiniteBet) && !isPlaying) {
      const timer = setTimeout(() => {
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
    return <GameDisabledMessage gameName="Blackjack" />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Game Panel - Now at the top */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8 col-span-full">
        <div className="flex items-center mb-6">
          <Target className="w-8 h-8 text-gray-400 mr-3" />
          <h1 className="text-2xl font-bold text-white">Blackjack</h1>
        </div>
        
        {/* Blackjack Table */}
        <div className="bg-green-800 rounded-lg p-8 mb-6 min-h-96">
          {/* Dealer Section */}
          <div className="text-center mb-8">
            <h3 className="text-white text-lg mb-4">Dealer ({showDealerCard ? dealerScore : '?'})</h3>
            <div className="flex justify-center space-x-2">
              {dealerCards.map((card, index) => (
                <div key={index}>
                  {renderCard(card, index === 1 && !showDealerCard)}
                </div>
              ))}
            </div>
          </div>
          
          {/* Player Section */}
          <div className="text-center">
            <h3 className="text-white text-lg mb-4">Player ({playerScore})</h3>
            <div className="flex justify-center space-x-2 mb-6">
              {playerCards.map((card, index) => (
                <div key={index}>
                  {renderCard(card)}
                </div>
              ))}
            </div>
            
            {/* Game Actions */}
            {isPlaying && (canHit || canStand || canDouble) && (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={hit}
                  disabled={!canHit}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Hit
                </button>
                <button
                  onClick={stand}
                  disabled={!canStand}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Stand
                </button>
                <button
                  onClick={double}
                  disabled={!canDouble}
                  className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Double
                </button>
              </div>
            )}
            
            {/* Game Result */}
            {gameResult && (
              <div className={`mt-6 p-4 rounded-lg ${gameResult.profit > 0 ? 'bg-green-600' : gameResult.profit < 0 ? 'bg-red-600' : 'bg-yellow-600'}`}>
                <div className="text-white text-xl font-bold">
                  {gameResult.result === 'blackjack' && 'Blackjack!'}
                  {gameResult.result === 'win' && 'You Win!'}
                  {gameResult.result === 'lose' && 'You Lose!'}
                  {gameResult.result === 'bust' && 'Bust!'}
                  {gameResult.result === 'dealer_bust' && 'Dealer Bust!'}
                  {gameResult.result === 'push' && 'Push!'}
                </div>
                <div className="text-white">
                  {gameResult.profit > 0 ? `+${formatCurrency(gameResult.profit)}` : 
                   gameResult.profit < 0 ? `-${formatCurrency(Math.abs(gameResult.profit))}` : 
                   'No change'}
                </div>
              </div>
            )}
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
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
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
                onClick={() => setBetAmount(prev => roundBetAmount(prev / 2))}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                disabled={isPlaying || autoBetRunning}
              >
                1/2
              </button>
              <button
                onClick={() => setBetAmount(prev => roundBetAmount(prev * 2))}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                disabled={isPlaying || autoBetRunning}
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
                onClick={startGame}
                disabled={isPlaying || !user || betAmount > user.balance || autoBetRunning}
                className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isPlaying ? (
                  <>
                    <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                    Playing...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Deal Cards
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
          </div>
          
          {/* Live Stats Toggle */}
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
            currentGame="blackjack"
            currentSettings={{
              betAmount,
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
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                  placeholder="Enter custom seed"
                />
                <button
                  onClick={handleSeedUpdate}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  Set
                </button>
                <button
                  onClick={generateNewSeed}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Advanced Auto-bet Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
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
                  className={`w-full px-3 py-2 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-400 ${
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
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
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
                <div className="text-sm text-gray-400">Total Hands</div>
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
          
          {/* Basic Strategy Tips */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Basic Strategy Tips</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Always split Aces and 8s</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Never split 10s or face cards</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Double down on 11 against any dealer card</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Stand on hard 17 or higher</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Bets moved to bottom */}
      <div className="mt-8">
        <RecentBets bets={bets.filter(bet => bet.game === 'Blackjack')} formatCurrency={formatCurrency} maxBets={5} />
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

export default Blackjack;