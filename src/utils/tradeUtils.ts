import { Trade, Instrument, TradeDirection } from '../types';
import { INSTRUMENTS_CONFIG } from '../constants';

export const calculatePL = (
  trade: Trade,
  currentPrice?: number
): { pl: number; plPoints: number } => {
  const exitPrice = trade.exitPrice || currentPrice;
  
  if (!exitPrice) {
    return { pl: 0, plPoints: 0 };
  }

  const instrumentConfig = INSTRUMENTS_CONFIG[trade.instrument];
  const direction = trade.direction === 'LONG' ? 1 : -1;
  
  const priceDiff = (exitPrice - trade.entryPrice) * direction;
  const plPoints = priceDiff;
  const pl = plPoints * instrumentConfig.pointValue * trade.quantity;
  
  return { pl, plPoints };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatPrice = (instrument: Instrument, price: number): string => {
  const tickSize = INSTRUMENTS_CONFIG[instrument].tickSize;
  let decimals = 0;
  
  if (tickSize < 1) {
    decimals = String(tickSize).split('.')[1].length;
  }
  
  return price.toFixed(decimals);
};

export const shouldExitTrade = (
  trade: Trade,
  currentPrice: number,
  targetExitTime?: Date
): boolean => {
  if (trade.status !== 'ACTIVE') return false;
  
  // Check time-based exit
  if (targetExitTime && new Date() >= targetExitTime) {
    return true;
  }
  
  // Check stop loss
  if (trade.stopLoss) {
    if (
      (trade.direction === 'LONG' && currentPrice <= trade.stopLoss) ||
      (trade.direction === 'SHORT' && currentPrice >= trade.stopLoss)
    ) {
      return true;
    }
  }
  
  // Check take profit
  if (trade.takeProfit) {
    if (
      (trade.direction === 'LONG' && currentPrice >= trade.takeProfit) ||
      (trade.direction === 'SHORT' && currentPrice <= trade.takeProfit)
    ) {
      return true;
    }
  }
  
  return false;
};

export const getExitReason = (
  trade: Trade,
  currentPrice: number,
  targetExitTime?: Date
): string => {
  if (!trade.exitPrice) return '';
  
  if (targetExitTime && trade.exitTime && trade.exitTime >= targetExitTime) {
    return 'Time target reached';
  }
  
  if (trade.stopLoss) {
    if (
      (trade.direction === 'LONG' && trade.exitPrice <= trade.stopLoss) ||
      (trade.direction === 'SHORT' && trade.exitPrice >= trade.stopLoss)
    ) {
      return 'Stop loss triggered';
    }
  }
  
  if (trade.takeProfit) {
    if (
      (trade.direction === 'LONG' && trade.exitPrice >= trade.takeProfit) ||
      (trade.direction === 'SHORT' && trade.exitPrice <= trade.takeProfit)
    ) {
      return 'Take profit reached';
    }
  }
  
  return 'Manual exit';
};

export const generateTradeId = (): string => {
  return `trade-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};