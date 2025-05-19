export type Instrument = 'NQ' | 'ES';

export type TradeDirection = 'LONG' | 'SHORT';

export type TradeStatus = 'PENDING' | 'ACTIVE' | 'CLOSED';

export type TradingMode = 'LIVE' | 'BACKTEST';

export interface HistoricalPrice {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface Trade {
  id: string;
  instrument: Instrument;
  direction: TradeDirection;
  entryPrice: number;
  entryTime: Date;
  exitPrice?: number;
  exitTime?: Date;
  quantity: number;
  stopLoss?: number;
  takeProfit?: number;
  status: TradeStatus;
  pl?: number;
  plPoints?: number;
  mode: TradingMode;
}

export interface TradeHistory {
  trades: Trade[];
}

export interface PriceUpdate {
  instrument: Instrument;
  price: number;
  timestamp: Date;
}

export interface InstrumentSettings {
  pointValue: number;
  tickSize: number;
  symbol: string;
}

export interface InstrumentConfig {
  [key: string]: InstrumentSettings;
}

export interface BacktestResult {
  trades: Trade[];
  totalPL: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  maxDrawdown: number;
  sharpeRatio: number;
}