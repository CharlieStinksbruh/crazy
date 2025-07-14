import { useEffect, useState } from 'react';

interface GameSettings {
  enabled: boolean;
  minBet: number;
  maxBet: number;
  houseEdge: number;
}

export const useGameAccess = (gameName: string) => {
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGameSettings = () => {
      const savedSettings = localStorage.getItem('charlies-odds-admin-game-settings');
      if (savedSettings) {
        const allSettings = JSON.parse(savedSettings);
        const settings = allSettings[gameName];
        if (settings) {
          setGameSettings(settings);
        } else {
          // Default settings if not found
          setGameSettings({
            enabled: true,
            minBet: 0.01,
            maxBet: 1000,
            houseEdge: 1
          });
        }
      } else {
        // Default settings if no admin settings exist
        setGameSettings({
          enabled: true,
          minBet: 0.01,
          maxBet: 1000,
          houseEdge: 1
        });
      }
      setIsLoading(false);
    };

    loadGameSettings();
  }, [gameName]);

  const validateBetAmount = (amount: number): { isValid: boolean; message?: string } => {
    if (!gameSettings) return { isValid: true };

    // Check minimum bet
    if (gameSettings.minBet && amount < gameSettings.minBet) {
      return {
        isValid: false,
        message: `Minimum bet is $${gameSettings.minBet.toFixed(2)}`
      };
    }

    // Check maximum bet
    if (gameSettings.maxBet && amount > gameSettings.maxBet) {
      return {
        isValid: false,
        message: `Maximum bet is $${gameSettings.maxBet.toFixed(2)}`
      };
    }

    return { isValid: true };
  };

  return {
    gameSettings,
    isLoading,
    isEnabled: gameSettings?.enabled ?? true,
    minBet: gameSettings?.minBet ?? 0.01,
    maxBet: gameSettings?.maxBet ?? 1000,
    validateBetAmount
  };
};