import React from 'react';
import { Trade } from '../types';
import { formatCurrency } from '../utils/tradeUtils';
import { DollarSign, Clock, Activity } from 'lucide-react';

interface TradingSummaryProps {
  trades: Trade[];
  unrealizedPL: number;
  realizedPL: number;
  currentTime: string;
  scheduledTime?: string;
}

const TradingSummary: React.FC<TradingSummaryProps> = ({
  trades,
  unrealizedPL,
  realizedPL,
  currentTime,
  scheduledTime
}) => {
  const totalPL = unrealizedPL + realizedPL;
  const activeTrades = trades.filter(t => t.status === 'ACTIVE').length;
  const closedTrades = trades.filter(t => t.status === 'CLOSED').length;
  const pendingTrades = trades.filter(t => t.status === 'PENDING').length;
  
  const wonTrades = trades
    .filter(t => t.status === 'CLOSED')
    .filter(t => (t.pl || 0) > 0)
    .length;
    
  const lostTrades = trades
    .filter(t => t.status === 'CLOSED')
    .filter(t => (t.pl || 0) < 0)
    .length;
    
  const winRate = closedTrades > 0 
    ? Math.round((wonTrades / closedTrades) * 100) 
    : 0;

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="text-xs font-medium text-gray-400 mb-1">
            NY Time
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-blue-400" />
            <span className="text-white font-medium">{currentTime}</span>
          </div>
          {scheduledTime && (
            <div className="mt-1 text-xs text-blue-400">
              Scheduled: {scheduledTime}
            </div>
          )}
        </div>
        
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="text-xs font-medium text-gray-400 mb-1">
            Total P/L
          </div>
          <div className={`text-xl font-bold ${
            totalPL > 0 ? 'text-green-500' : 
            totalPL < 0 ? 'text-red-500' : 
            'text-white'
          }`}>
            {formatCurrency(totalPL)}
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="text-xs font-medium text-gray-400 mb-1">
            Trades
          </div>
          <div className="flex justify-between">
            <div>
              <div className="flex items-center text-blue-400">
                <Activity className="h-3 w-3 mr-1" />
                <span className="text-sm">{activeTrades} Active</span>
              </div>
              <div className="text-sm text-gray-300">
                {closedTrades} Closed
              </div>
            </div>
            {pendingTrades > 0 && (
              <div className="text-sm text-yellow-400">
                {pendingTrades} Pending
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="text-xs font-medium text-gray-400 mb-1">
            Performance
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-sm text-green-500">{wonTrades} Won</div>
              <div className="text-sm text-red-500">{lostTrades} Lost</div>
            </div>
            {closedTrades > 0 && (
              <div className="text-lg font-bold text-white">
                {winRate}%
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="text-xs font-medium text-gray-400 mb-1">
            Realized P/L
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
            <span className={`font-medium ${
              realizedPL > 0 ? 'text-green-500' : 
              realizedPL < 0 ? 'text-red-500' : 
              'text-white'
            }`}>
              {formatCurrency(realizedPL)}
            </span>
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="text-xs font-medium text-gray-400 mb-1">
            Unrealized P/L
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
            <span className={`font-medium ${
              unrealizedPL > 0 ? 'text-green-500' : 
              unrealizedPL < 0 ? 'text-red-500' : 
              'text-white'
            }`}>
              {formatCurrency(unrealizedPL)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingSummary;