import { useState, useEffect, useCallback } from 'react';
import { 
  Trade, 
  Instrument, 
  TradeDirection, 
  TradeStatus 
} from '../types';
import { 
  calculatePL, 
  shouldExitTrade,
  generateTradeId
} from '../utils/tradeUtils';
import { DEFAULT_QUANTITY } from '../constants';
import { getCurrentNYTime } from '../utils/timeUtils';

const useTrades = (getMarketPrice: (instrument: Instrument) => number) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [pendingTrades, setPendingTrades] = useState<{
    instruments: Instrument[];
    direction: TradeDirection;
    stopLoss?: number;
    takeProfit?: number;
    targetExitTime?: Date;
  } | null>(null);

  // Schedule a trade to be executed at 1:00 PM NY time
  const scheduleTrade = useCallback((
    instruments: Instrument[], 
    direction: TradeDirection,
    stopLoss?: number,
    takeProfit?: number,
    targetExitTime?: Date
  ) => {
    setPendingTrades({
      instruments,
      direction,
      stopLoss,
      takeProfit,
      targetExitTime
    });
  }, []);

  // Execute a trade immediately
  const executeTrade = useCallback((
    instrument: Instrument,
    direction: TradeDirection,
    stopLoss?: number,
    takeProfit?: number,
    targetExitTime?: Date
  ) => {
    const currentPrice = getMarketPrice(instrument);
    const currentTime = getCurrentNYTime();
    
    const newTrade: Trade = {
      id: generateTradeId(),
      instrument,
      direction,
      entryPrice: currentPrice,
      entryTime: currentTime,
      quantity: DEFAULT_QUANTITY,
      stopLoss,
      takeProfit,
      status: 'ACTIVE'
    };
    
    setTrades(prevTrades => [...prevTrades, newTrade]);
    return newTrade;
  }, [getMarketPrice]);

  // Close a trade
  const closeTrade = useCallback((tradeId: string) => {
    setTrades(prevTrades => 
      prevTrades.map(trade => {
        if (trade.id === tradeId && trade.status === 'ACTIVE') {
          const currentPrice = getMarketPrice(trade.instrument);
          const exitTime = getCurrentNYTime();
          const { pl, plPoints } = calculatePL(trade, currentPrice);
          
          return {
            ...trade,
            exitPrice: currentPrice,
            exitTime,
            status: 'CLOSED',
            pl,
            plPoints
          };
        }
        return trade;
      })
    );
  }, [getMarketPrice]);

  // Check for execution of scheduled trades
  useEffect(() => {
    if (!pendingTrades) return;
    
    const checkSchedule = () => {
      const now = getCurrentNYTime();
      
      // Check if it's 1:00 PM NY time
      if (now.getHours() === 13 && now.getMinutes() === 0) {
        pendingTrades.instruments.forEach(instrument => {
          executeTrade(
            instrument, 
            pendingTrades.direction,
            pendingTrades.stopLoss,
            pendingTrades.takeProfit,
            pendingTrades.targetExitTime
          );
        });
        
        setPendingTrades(null);
      }
    };
    
    const interval = setInterval(checkSchedule, 1000);
    return () => clearInterval(interval);
  }, [pendingTrades, executeTrade]);

  // Monitor active trades for exit conditions
  useEffect(() => {
    if (trades.length === 0) return;
    
    const interval = setInterval(() => {
      let tradesUpdated = false;
      
      const updatedTrades = trades.map(trade => {
        if (trade.status === 'ACTIVE') {
          const currentPrice = getMarketPrice(trade.instrument);
          
          // Check if we should exit based on SL/TP or time
          if (shouldExitTrade(trade, currentPrice, pendingTrades?.targetExitTime)) {
            tradesUpdated = true;
            const exitTime = getCurrentNYTime();
            const { pl, plPoints } = calculatePL(trade, currentPrice);
            
            return {
              ...trade,
              exitPrice: currentPrice,
              exitTime,
              status: 'CLOSED',
              pl,
              plPoints
            };
          }
        }
        return trade;
      });
      
      if (tradesUpdated) {
        setTrades(updatedTrades);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [trades, getMarketPrice, pendingTrades]);

  // Calculate unrealized P&L for active trades
  const getUpdatedTrades = useCallback(() => {
    return trades.map(trade => {
      if (trade.status === 'ACTIVE') {
        const currentPrice = getMarketPrice(trade.instrument);
        const { pl, plPoints } = calculatePL(trade, currentPrice);
        
        return {
          ...trade,
          pl,
          plPoints
        };
      }
      return trade;
    });
  }, [trades, getMarketPrice]);

  // Get realized P&L
  const getRealizedPL = useCallback(() => {
    return trades
      .filter(trade => trade.status === 'CLOSED')
      .reduce((total, trade) => total + (trade.pl || 0), 0);
  }, [trades]);

  // Get unrealized P&L
  const getUnrealizedPL = useCallback(() => {
    return getUpdatedTrades()
      .filter(trade => trade.status === 'ACTIVE')
      .reduce((total, trade) => total + (trade.pl || 0), 0);
  }, [getUpdatedTrades]);

  return {
    trades: getUpdatedTrades(),
    scheduleTrade,
    executeTrade,
    closeTrade,
    getRealizedPL,
    getUnrealizedPL
  };
};

export default useTrades;