import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  isAdmin: boolean;
  createdAt: Date;
  level: number;
  experience: number;
  lastDailyBonus: string | null;
  stats: {
    totalBets: number;
    totalWins: number;
    totalLosses: number;
    biggestWin: number;
    biggestLoss: number;
  };
  currency: 'USD' | 'GBP' | 'EUR' | 'BTC' | 'ETH' | 'LTC';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, password: string) => boolean;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateBalance: (amount: number) => void;
  updateStats: (betAmount: number, winAmount: number) => void;
  addExperience: (amount: number) => void;
  claimDailyBonus: () => number;
  getNextLevelRequirement: () => number;
  getLevelRewards: (level: number) => { dailyBonus: number; title: string };
  setCurrency: (currency: 'USD' | 'GBP' | 'EUR' | 'BTC' | 'ETH' | 'LTC') => void;
  formatCurrency: (amount: number) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize default users and load saved state
  useEffect(() => {
    // Create default users if they don't exist
    const existingUsers = localStorage.getItem('charlies-odds-users');
    if (!existingUsers) {
      const defaultUsers = [
        {
          id: 'admin-001',
          username: 'admin',
          email: 'admin@charliesodds.com',
          password: 'admin',
          balance: 10000,
          isAdmin: true,
          level: 1,
          experience: 0,
          lastDailyBonus: null,
          createdAt: new Date().toISOString(),
          stats: { totalBets: 0, totalWins: 0, totalLosses: 0, biggestWin: 0, biggestLoss: 0 },
          currency: 'USD'
        },
        {
          id: 'demo-001',
          username: 'demo',
          email: 'demo@charliesodds.com',
          password: 'demo',
          balance: 1000,
          isAdmin: false,
          level: 1,
          experience: 0,
          lastDailyBonus: null,
          createdAt: new Date().toISOString(),
          stats: { totalBets: 0, totalWins: 0, totalLosses: 0, biggestWin: 0, biggestLoss: 0 },
          currency: 'USD'
        }
      ];
      localStorage.setItem('charlies-odds-users', JSON.stringify(defaultUsers));
    }

    // Load current user session
    const currentUserId = localStorage.getItem('charlies-odds-current-user');
    if (currentUserId) {
      const users = JSON.parse(localStorage.getItem('charlies-odds-users') || '[]');
      const foundUser = users.find((u: any) => u.id === currentUserId);
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser({
          ...userWithoutPassword,
          createdAt: new Date(foundUser.createdAt),
          currency: foundUser.currency || 'USD',
          level: foundUser.level || 1,
          experience: foundUser.experience || 0,
          lastDailyBonus: foundUser.lastDailyBonus || null
        });
        setIsAuthenticated(true);
      }
    }
  }, []);

  const login = (usernameOrEmail: string, password: string): boolean => {
    try {
      const users = JSON.parse(localStorage.getItem('charlies-odds-users') || '[]');
      const foundUser = users.find((u: any) => 
        (u.username.toLowerCase() === usernameOrEmail.toLowerCase() || 
         u.email.toLowerCase() === usernameOrEmail.toLowerCase()) &&
        u.password === password
      );

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        const userObj = {
          ...userWithoutPassword,
          createdAt: new Date(foundUser.createdAt),
          currency: foundUser.currency || 'USD'
        };
        
        setUser(userObj);
        setIsAuthenticated(true);
        localStorage.setItem('charlies-odds-current-user', foundUser.id);
        
        console.log('Login successful:', userObj.username);
        return true;
      }
      
      console.log('Login failed: Invalid credentials');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('charlies-odds-users') || '[]');
      
      // Check if user already exists
      const existingUser = users.find((u: any) => 
        u.username.toLowerCase() === username.toLowerCase() || 
        u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (existingUser) {
        return false;
      }

      const newUser = {
        id: `user-${Date.now()}`,
        username,
        email,
        password,
        balance: 1000,
        isAdmin: false,
        level: 1,
        experience: 0,
        lastDailyBonus: null,
        createdAt: new Date().toISOString(),
        stats: { totalBets: 0, totalWins: 0, totalLosses: 0, biggestWin: 0, biggestLoss: 0 },
        currency: 'USD'
      };

      users.push(newUser);
      localStorage.setItem('charlies-odds-users', JSON.stringify(users));

      // Auto-login the new user
      const { password: _, ...userWithoutPassword } = newUser;
      const userObj = {
        ...userWithoutPassword,
        createdAt: new Date(newUser.createdAt),
        currency: 'USD' as const,
        level: newUser.level,
        experience: newUser.experience,
        lastDailyBonus: newUser.lastDailyBonus
      };
      
      setUser(userObj);
      setIsAuthenticated(true);
      localStorage.setItem('charlies-odds-current-user', newUser.id);

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('charlies-odds-current-user');
    console.log('User logged out');
  };
  
  const getNextLevelRequirement = (): number => {
    if (!user) return 100;
    return user.level * 100; // Each level requires level * 100 XP
  };

  const getLevelRewards = (level: number) => {
    const baseBonus = 25;
    const bonusPerLevel = 5;
    
    const titles = [
      'Novice Gambler', 'Casual Player', 'Regular Bettor', 'Experienced Player', 'Skilled Gambler',
      'Expert Player', 'Master Bettor', 'High Roller', 'VIP Player', 'Elite Gambler',
      'Legendary Player', 'Casino Royalty', 'Gambling Guru', 'Fortune Master', 'Luck Legend'
    ];
    
    return {
      dailyBonus: baseBonus + (level - 1) * bonusPerLevel,
      title: titles[Math.min(level - 1, titles.length - 1)] || `Level ${level} Player`
    };
  };

  const updateBalance = (amount: number) => {
    if (!user) return;

    const newBalance = user.balance + amount;
    const updatedUser = { ...user, balance: newBalance };
    setUser(updatedUser);

    // Update in localStorage
    const users = JSON.parse(localStorage.getItem('charlies-odds-users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], balance: newBalance };
      localStorage.setItem('charlies-odds-users', JSON.stringify(users));
    }

    console.log(`Balance updated: ${amount >= 0 ? '+' : ''}${amount.toFixed(2)} -> ${formatCurrency(newBalance)}`);
  };

  const addExperience = (amount: number) => {
    if (!user) return;

    let newExperience = user.experience + amount;
    let newLevel = user.level;
    
    // Check for level ups
    while (newExperience >= getNextLevelRequirement()) {
      newExperience -= getNextLevelRequirement();
      newLevel++;
    }
    
    const updatedUser = { ...user, experience: newExperience, level: newLevel };
    setUser(updatedUser);

    // Update in localStorage
    const users = JSON.parse(localStorage.getItem('charlies-odds-users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], experience: newExperience, level: newLevel };
      localStorage.setItem('charlies-odds-users', JSON.stringify(users));
    }
  };

  const claimDailyBonus = (): number => {
    if (!user) return 0;

    const today = new Date().toDateString();
    if (user.lastDailyBonus === today) return 0;

    const levelRewards = getLevelRewards(user.level);
    const bonusAmount = levelRewards.dailyBonus;
    
    // Update balance using the same pattern as games
    const newBalance = user.balance + bonusAmount;
    const updatedUser = { ...user, balance: newBalance, lastDailyBonus: today };
    setUser(updatedUser);

    // Update in localStorage
    const users = JSON.parse(localStorage.getItem('charlies-odds-users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], balance: newBalance, lastDailyBonus: today };
      localStorage.setItem('charlies-odds-users', JSON.stringify(users));
    }
    

    return bonusAmount;
  };

  const updateStats = (betAmount: number, winAmount: number) => {
    if (!user) return;

    const isWin = winAmount > betAmount;
    const profit = winAmount - betAmount;
    
    const updatedStats = {
      ...user.stats,
      totalBets: user.stats.totalBets + 1,
      totalWins: user.stats.totalWins + (isWin ? 1 : 0),
      totalLosses: user.stats.totalLosses + (isWin ? 0 : 1),
      biggestWin: Math.max(user.stats.biggestWin, profit),
      biggestLoss: Math.min(user.stats.biggestLoss, profit)
    };

    const updatedUser = { ...user, stats: updatedStats };
    setUser(updatedUser);

    // Update in localStorage
    const users = JSON.parse(localStorage.getItem('charlies-odds-users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], stats: updatedStats };
      localStorage.setItem('charlies-odds-users', JSON.stringify(users));
    }
    
    // Add experience for betting
    addExperience(Math.floor(betAmount / 10)); // 1 XP per $10 bet
  };

  const setCurrency = (currency: 'USD' | 'BTC' | 'ETH' | 'LTC') => {
    if (!user) return;

    const updatedUser = { ...user, currency };
    setUser(updatedUser);

    // Update in localStorage
    const users = JSON.parse(localStorage.getItem('charlies-odds-users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], currency };
      localStorage.setItem('charlies-odds-users', JSON.stringify(users));
    }
  };

  const formatCurrency = (amount: number): string => {
    if (!user) return `$${amount.toFixed(2)}`;
    
    switch (user.currency) {
      case 'GBP':
        return `£${amount.toFixed(2)}`;
      case 'EUR':
        return `€${amount.toFixed(2)}`;
      case 'BTC':
        return `₿${(amount / 100000).toFixed(8)}`;
      case 'ETH':
        return `Ξ${(amount / 4000).toFixed(6)}`;
      case 'LTC':
        return `Ł${(amount / 100).toFixed(4)}`;
      default:
        return `$${amount.toFixed(2)}`;
    }
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateBalance,
    updateStats,
    addExperience,
    claimDailyBonus,
    getNextLevelRequirement,
    getLevelRewards,
    setCurrency,
    formatCurrency,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};