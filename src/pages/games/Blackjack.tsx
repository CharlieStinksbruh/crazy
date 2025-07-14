import React, { useState, useEffect } from 'react';
import { Target, Play, Pause, Settings, RotateCcw, Save, RefreshCw, BarChart3 } from 'lucide-react';
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
  const { user, updateBalance, updateStats, formatCurrency } = useAuth();
  const { addBet, saveGameSettings, loadGameSettings, bets, setSeed, seed } = useGame();
  const { isEnabled, isLoading, validateBetAmount } = useGameAccess('blackjack');
  
  const [betAmount, setBetAmount] = useState(10);
  const [originalBetAmount, setOriginalBetAmount] = useState(10);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealer' | 'finished'>('betting');
  const [gameResult, setGameResult] = useState<'win' | 'lose' | 'push' | null>(null);
  const [deck, setDeck] = useState<Card[]>([]);
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

  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = loadGameSettings('blackjack');
    if (savedSettings.betAmount) setBetAmount(savedSettings.betAmount);
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

  const createDeck = (): Card[] => {
    const newDeck: Card[] = [];
    for (const suit of suits) {
      for (const value of values) {
        let numValue = parseInt(value);
        if (value === 'A') numValue = 11;
        else if (['J', 'Q', 'K'].includes(value)) numValue = 10;
        
        newDeck.push({ suit, value, numValue });
      }
    }
    return shuffleDeck(newDeck);
  };

  const shuffleDeck = (deck: Card[]): Card[] => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const calculateHandValue = (hand: Card[]): number => {
    let value = 0;
    let aces = 0;
    
    for (const card of hand) {
      if (card.value === 'A') {
        aces++;
        value += 11;
      } else {
        value += card.numValue;
      }
    }
    
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }
    
    return value;
  };

  const dealCard = (currentDeck: Card[]): { card: Card; remainingDeck: Card[] } => {
    if (currentDeck.length === 0) {
      const newDeck = createDeck();
      return { card: newDeck[0], remainingDeck: newDeck.slice(1) };
    }
    return { card: currentDeck[0], remainingDeck: currentDeck.slice(1) };
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
    let currentDeck = deck.length < 10 ? createDeck() : deck;
    
    // Deal initial cards
    const { card: playerCard1, remainingDeck: deck1 } = dealCard(currentDeck);
    const { card: dealerCard1, remainingDeck: deck2 } = dealCard(deck1);
    const { card: playerCard2, remainingDeck: deck3 } = dealCard(deck2);
    const { card: dealerCard2, remainingDeck: finalDeck } = dealCard(deck3);
    
    const newPlayerHand = [playerCard1, playerCard2];
    const newDealerHand = [dealerCard1, dealerCard2];
    
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setDeck(finalDeck);
    setGameState('playing');
    setGameResult(null);
    
    // Check for blackjack
    const playerValue = calculateHandValue(newPlayerHand);
    const dealerValue = calculateHandValue(newDealerHand);
    
    if (playerValue === 21 || dealerValue === 21) {
      setTimeout(() => finishGame(newPlayerHand, newDealerHand, finalDeck), instantBet ? betSpeed : 1000);
    }
  };

  const hit = () => {
    if (gameState !== 'playing') return;
    
    const { card, remainingDeck } = dealCard(deck);
    const newPlayerHand = [...playerHand, card];
    setPlayerHand(newPlayerHand);
    setDeck(remainingDeck);
    
    if (calculateHandValue(newPlayerHand) > 21) {
      setTimeout(() => finishGame(newPlayerHand, dealerHand, remainingDeck), instantBet ? betSpeed : 500);
    }
  };

  const stand = () => {
    if (gameState !== 'playing') return;
    setGameState('dealer');
    setTimeout(() => dealerPlay(), instantBet ? betSpeed : 1000);
  };

  const dealerPlay = () => {
    let currentDealerHand = [...dealerHand];
    let currentDeck = [...deck];
    
    while (calculateHandValue(currentDealerHand) < 17) {
      const { card, remainingDeck } = dealCard(currentDeck);
      currentDealerHand.push(card);
      currentDeck = remainingDeck;
    }
    
    setDealerHand(currentDealerHand);
    setDeck(currentDeck);
    
    setTimeout(() => finishGame(playerHand, currentDealerHand, currentDeck), instantBet ? betSpeed : 1000);
  };

  const finishGame = (finalPlayerHand: Card[], finalDealerHand: Card[], finalDeck: Card[]) => {
    const playerValue = calculateHandValue(finalPlayerHand);
    const dealerValue = calculateHandValue(finalDealerHand);
    
    let result: 'win' | 'lose' | 'push';
    let winAmount = 0;
    
    if (playerValue > 21) {
      result = 'lose';
    } else if (dealerValue > 21) {
      result = 'win';
      winAmount = betAmount * 2;
    } else if (playerValue === 21 && finalPlayerHand.length === 2 && dealerValue !== 21) {
      result = 'win';
      winAmount = betAmount * 2.5; // Blackjack pays 3:2
    } else if (playerValue > dealerValue) {
      result = 'win';
      winAmount = betAmount * 2;
    } else if (playerValue < dealerValue) {
      result = 'lose';
    } else {
      result = 'push';
      winAmount = betAmount; // Return bet
    }
    
    setGameResult(result);
    setGameState('finished');
    
    const profit = winAmount - betAmount;
    
    // Update profit tracking
    const newProfit = sessionProfit + profit;
    setSessionProfit(newProfit);
    setProfitHistory(prev => [...prev, {value: newProfit, bet: sessionStats.totalBets + 1, timestamp: Date.now()}]);
    
    // Update session statistics
    setSessionStats(prev => {
      const newStats = {
        totalBets: prev.totalBets + 1,
        wins: prev.wins + (result === 'win' ? 1 : 0),
        losses: prev.losses + (result === 'lose' ? 1 : 0),
        currentStreak: prev.isWinStreak === (result === 'win') ? prev.currentStreak + 1 : 1,
        longestWinStreak: prev.longestWinStreak,
        longestLossStreak: prev.longestLossStreak,
        isWinStreak: result === 'win'
      };
      
      if (result === 'win') {
        newStats.longestWinStreak = Math.max(prev.longestWinStreak, newStats.currentStreak);
      } else if (result === 'lose') {
        newStats.longestLossStreak = Math.max(prev.longestLossStreak, newStats.currentStreak);
      }
      
      return newStats;
    });
    
    updateBalance(profit);
    updateStats(betAmount, winAmount);
    
    addBet({
      game: 'Blackjack',
      betAmount,
      winAmount,
      multiplier: winAmount > 0 ? winAmount / betAmount : 0,
      result: { playerValue, dealerValue, result },
    });
    
    // Handle auto-betting
    if (isAutoMode && autoBetRunning) {
      setAutoBetCount(prev => prev - 1);
      setTimeout(() => {
        if (autoBetCount > 1 || infiniteBet) {
          startGame();
        } else {
          stopAutoPlay();
        }
      }, instantBet ? betSpeed : 2000);
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
      maxAutoBets,
      infiniteBet,
      instantBet,
      betSpeed
    };
    saveGameSettings('blackjack', settings);
  };

  const loadSettings = (settings: any) => {
    if (settings.betAmount) setBetAmount(settings.betAmount);
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

  const renderCard = (card: Card, hidden = false) => {
    if (hidden) {
      return (
        <div className="w-16 h-24 bg-blue-600 border border-gray-300 rounded-lg flex items-center justify-center">
          <div className="text-white text-xs">🂠</div>
        </div>
      );
    }
    
    const isRed = card.suit === '♥' || card.suit === '♦';
    return (
      <div className="w-16 h-24 bg-white border border-gray-300 rounded-lg flex flex-col items-center justify-center">
        <div className={`text-lg font-bold ${isRed ? 'text-red-500' : 'text-black'}`}>
          {card.value}
        </div>
        <div className={`text-lg ${isRed ? 'text-red-500' : 'text-black'}`}>
          {card.suit}
        </div>
      </div>
    );
  };

  // Auto-play logic for basic strategy
  useEffect(() => {
    if (isAutoMode && autoBetRunning && gameState === 'playing') {
      const playerValue = calculateHandValue(playerHand);
      const dealerUpCard = dealerHand[0];
      const dealerUpValue = dealerUpCard.numValue;
      
      // Basic strategy logic
      let action: 'hit' | 'stand' = 'stand';
      
      if (playerValue <= 11) {
        action = 'hit';
      } else if (playerValue === 12) {
        action = dealerUpValue >= 4 && dealerUpValue <= 6 ? 'stand' : 'hit';
      } else if (playerValue >= 13 && playerValue <= 16) {
        action = dealerUpValue >= 2 && dealerUpValue <= 6 ? 'stand' : 'hit';
      } else {
        action = 'stand';
      }
      
      setTimeout(() => {
        if (action === 'hit') {
          hit();
        } else {
          stand();
        }
      }, instantBet ? betSpeed : 1000);
    }
  }, [gameState, playerHand, dealerHand, isAutoMode, autoBetRunning]);

  useEffect(() => {
    if (isAutoMode && autoBetRunning && gameState === 'betting') {
      setTimeout(() => {
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
    }
  }, [gameState, isAutoMode, autoBetRunning, betSpeed]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-6">
              <Target className="w-8 h-8 text-gray-400 mr-3" />
              <h1 className="text-2xl font-bold text-white">Blackjack</h1>
            </div>
            
            {/* Game Table */}
            <div className="bg-green-800 rounded-lg p-8 mb-6">
              {/* Dealer Hand */}
              <div className="mb-8">
                <h3 className="text-white text-lg mb-4">
                  Dealer {gameState !== 'betting' && `(${gameState === 'playing' ? '?' : calculateHandValue(dealerHand)})`}
                </h3>
                <div className="flex space-x-2">
                  {dealerHand.map((card, index) => (
                    <div key={index}>
                      {renderCard(card, gameState === 'playing' && index === 1)}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Player Hand */}
              <div>
                <h3 className="text-white text-lg mb-4">
                  Player {gameState !== 'betting' && `(${calculateHandValue(playerHand)})`}
                </h3>
                <div className="flex space-x-2">
                  {playerHand.map((card, index) => (
                    <div key={index}>
                      {renderCard(card)}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Game Controls */}
              <div className="mt-8 flex justify-center space-x-4">
                {gameState === 'betting' && (
                  <button
                    onClick={startGame}
                    disabled={!user || betAmount > user.balance || autoBetRunning}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                  >
                    Deal
                  </button>
                )}
                
                {gameState === 'playing' && !autoBetRunning && (
                  <>
                    <button
                      onClick={hit}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                      Hit
                    </button>
                    <button
                      onClick={stand}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                      Stand
                    </button>
                  </>
                )}
                
                {gameState === 'finished' && (
                  <button
                    onClick={() => {
                      setGameState('betting');
                      setPlayerHand([]);
                      setDealerHand([]);
                      setGameResult(null);
                    }}
                    disabled={autoBetRunning}
                    className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                  >
                    New Game
                  </button>
                )}
              </div>
              
              {/* Game Result */}
              {gameResult && (
                <div className="mt-4 text-center">
                  <div className={`text-2xl font-bold ${
                    gameResult === 'win' ? 'text-green-400' : 
                    gameResult === 'lose' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {gameResult === 'win' ? 'You Win!' : 
                     gameResult === 'lose' ? 'You Lose!' : 'Push!'}
                  </div>
                </div>
              )}
            </div>
          </div>


          <RecentBets bets={bets.filter(bet => bet.game === 'Blackjack')} formatCurrency={formatCurrency} maxBets={5} />
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
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
                min="0.01"
                step="0.01"
                disabled={gameState !== 'betting' || autoBetRunning}
              />
              {betError && (
                <div className="mt-2 text-red-400 text-sm">{betError}</div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setBetAmount(prev => roundBetAmount(prev / 2))}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                disabled={gameState !== 'betting' || autoBetRunning}
              >
                1/2
              </button>
              <button
                onClick={() => setBetAmount(prev => roundBetAmount(prev * 2))}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                disabled={gameState !== 'betting' || autoBetRunning}
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
              {!autoBetRunning ? (
                <button
                  onClick={startAutoPlay}
                  disabled={gameState !== 'betting' || !user || betAmount > user.balance}
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
            currentGame="blackjack"
            currentSettings={{
              betAmount,
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
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
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
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
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

export default Blackjack;