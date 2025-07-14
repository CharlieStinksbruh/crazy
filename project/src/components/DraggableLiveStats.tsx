import React, { useState, useRef, useEffect } from 'react';
import { BarChart3, RefreshCw, Clock, Zap, X, Maximize2, Minimize2 } from 'lucide-react';

interface LiveStatsProps {
  sessionStats: {
    totalBets: number;
    wins: number;
    losses: number;
    currentStreak: number;
    longestWinStreak: number;
    longestLossStreak: number;
    isWinStreak: boolean;
  };
  sessionProfit: number;
  profitHistory: { value: number; bet: number; timestamp?: number }[];
  onReset: () => void;
  formatCurrency: (amount: number) => string;
  startTime?: number;
  betsPerSecond?: number;
  isOpen: boolean;
  onClose: () => void;
}

const DraggableLiveStats: React.FC<LiveStatsProps> = ({
  sessionStats,
  sessionProfit,
  profitHistory,
  onReset,
  formatCurrency,
  startTime,
  betsPerSecond = 0,
  isOpen,
  onClose
}) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 400, height: 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getElapsedTime = () => {
    if (!startTime) return '00:00';
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragOffset({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      if (isDragging) {
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - size.width, clientX - dragOffset.x)),
          y: Math.max(0, Math.min(window.innerHeight - (isMinimized ? 60 : size.height), clientY - dragOffset.y))
        });
      } else if (isResizing) {
        setSize({
          width: Math.max(300, Math.min(800, clientX - position.x)),
          height: Math.max(200, Math.min(600, clientY - position.y))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove);
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, position, size, isMinimized]);

  // Enhanced profit graph component
  const ProfitGraph = () => {
    const values = profitHistory.map(p => p.value);
    const maxProfit = Math.max(...values, 10);
    const minProfit = Math.min(...values, -10);
    const range = maxProfit - minProfit || 20;
    const width = 100;
    const height = 100;
    
    return (
      <div className="relative h-32 bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
        <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Zero line */}
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
          
          {/* Profit line */}
          <polyline
            fill="none"
            stroke={sessionProfit >= 0 ? "#10b981" : "#ef4444"}
            strokeWidth="1.5"
            points={profitHistory.map((point, index) => 
              `${(index / Math.max(profitHistory.length - 1, 1)) * width},${height - ((point.value - minProfit) / range) * height}`
            ).join(' ')}
          />
          
          {/* Current point */}
          {profitHistory.length > 1 && (
            <circle
              cx={(profitHistory.length - 1) / Math.max(profitHistory.length - 1, 1) * width}
              cy={height - ((sessionProfit - minProfit) / range) * height}
              r="1.5"
              fill={sessionProfit >= 0 ? "#10b981" : "#ef4444"}
            />
          )}
        </svg>
        
        {/* Labels */}
        <div className="absolute top-1 left-1 text-xs font-semibold bg-gray-800 px-1 py-0.5 rounded">
          <span className={sessionProfit >= 0 ? 'text-green-400' : 'text-red-400'}>
            {formatCurrency(sessionProfit)}
          </span>
        </div>
        <div className="absolute top-1 right-1 text-xs text-gray-400 bg-gray-800 px-1 py-0.5 rounded">
          Max: {formatCurrency(maxProfit)}
        </div>
        <div className="absolute bottom-1 left-1 text-xs text-gray-400 bg-gray-800 px-1 py-0.5 rounded">
          Min: {formatCurrency(minProfit)}
        </div>
        <div className="absolute bottom-1 right-1 text-xs text-gray-400 bg-gray-800 px-1 py-0.5 rounded">
          {profitHistory.length - 1} bets
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-50 select-none"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: isMinimized ? 'auto' : size.height,
        minWidth: 300,
        minHeight: isMinimized ? 'auto' : 200
      }}
      onTouchStart={handleMouseDown}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 bg-gray-700 rounded-t-lg cursor-move border-b border-gray-600 select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <h3 className="text-white font-bold flex items-center">
          <BarChart3 className="w-4 h-4 mr-2" />
          Live Statistics
        </h3>
        <div className="flex items-center space-x-2">
          {startTime && (
            <div className="flex items-center text-xs text-gray-400 bg-gray-600 px-2 py-1 rounded">
              <Clock className="w-3 h-3 mr-1" />
              {getElapsedTime()}
            </div>
          )}
          {betsPerSecond > 0 && (
            <div className="flex items-center text-xs text-gray-400 bg-gray-600 px-2 py-1 rounded">
              <Zap className="w-3 h-3 mr-1" />
              {betsPerSecond.toFixed(1)}/s
            </div>
          )}
          <button
            onClick={onReset}
            className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded text-xs flex items-center"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Reset
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-400 hover:text-white"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="p-4 overflow-auto" style={{ height: size.height - 60 }}>
          {/* Statistics Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-900 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-white">{sessionStats.totalBets}</div>
              <div className="text-xs text-gray-400">Total Bets</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-green-400">{sessionStats.wins}</div>
              <div className="text-xs text-gray-400">Wins</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-red-400">{sessionStats.losses}</div>
              <div className="text-xs text-gray-400">Losses</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-yellow-400">
                {sessionStats.totalBets > 0 ? ((sessionStats.wins / sessionStats.totalBets) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-xs text-gray-400">Win Rate</div>
            </div>
          </div>
          
          {/* Streaks */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-gray-900 rounded-lg p-2 text-center">
              <div className={`text-sm font-bold ${sessionStats.isWinStreak ? 'text-green-400' : 'text-red-400'}`}>
                {sessionStats.currentStreak}
              </div>
              <div className="text-xs text-gray-400">
                Current {sessionStats.isWinStreak ? 'Win' : 'Loss'}
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-green-400">{sessionStats.longestWinStreak}</div>
              <div className="text-xs text-gray-400">Best Win</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-red-400">{sessionStats.longestLossStreak}</div>
              <div className="text-xs text-gray-400">Worst Loss</div>
            </div>
          </div>
          
          {/* Profit Graph */}
          <ProfitGraph />
        </div>
      )}

      {/* Resize Handle */}
      {!isMinimized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-gray-600 hover:bg-gray-500"
          onMouseDown={handleResizeMouseDown}
          style={{
            clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)'
          }}
        />
      )}
    </div>
  );
};

export default DraggableLiveStats;