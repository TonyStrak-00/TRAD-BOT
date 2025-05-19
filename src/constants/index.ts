import { InstrumentConfig } from '../types';

export const INSTRUMENTS_CONFIG: InstrumentConfig = {
  NQ: {
    pointValue: 20, // $20 per point
    tickSize: 0.25, // 0.25 points per tick
    symbol: 'NQ'
  },
  ES: {
    pointValue: 50, // $50 per point
    tickSize: 0.25, // 0.25 points per tick
    symbol: 'ES'
  }
};

export const DEFAULT_QUANTITY = 1;

export const TRADING_HOURS = {
  start: '09:30', // Eastern Time
  end: '16:00'    // Eastern Time
};