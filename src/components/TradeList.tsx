import React from 'react';
import { Trade } from '../types';
import { formatTime, formatDuration } from '../utils/timeUtils';
import { formatCurrency, formatPrice, getExitReason } from '../utils/tradeUtils';
import { CheckCircle2, XCircle, Clock, ArrowUp, ArrowDown } from 'lucide-react';

interface TradeListProps {
  trades: Trade[];
  onCloseTrade: (tradeId: string) => void;
}

const TradeList: React.FC<TradeListProps> = ({ trades, onCloseTrade }) => {
  if (trades.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
        <p className="text-gray-400 text-center">No trades yet</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg overflow-x-auto">
      <h2 className="text-lg font-semibold text-white mb-4">Trades</h2>
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Instrument
            </th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Direction
            </th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Entry
            </th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Exit
            </th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Duration
            </th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              P/L
            </th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-2 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {trades.map(trade => (
            <tr key={trade.id}>
              <td className="px-2 py-3 whitespace-nowrap text-sm text-white">
                {trade.instrument}
              </td>
              <td className="px-2 py-3 whitespace-nowrap text-sm">
                <span className={`flex items-center ${
                  trade.direction === 'LONG' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {trade.direction === 'LONG' ? (
                    <ArrowUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 mr-1" />
                  )}
                  {trade.direction}
                </span>
              </td>
              <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-300">
                <div>{formatPrice(trade.instrument, trade.entryPrice)}</div>
                <div className="text-xs text-gray-400">{formatTime(trade.entryTime)}</div>
              </td>
              <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-300">
                {trade.exitPrice ? (
                  <>
                    <div>{formatPrice(trade.instrument, trade.exitPrice)}</div>
                    <div className="text-xs text-gray-400">{formatTime(trade.exitTime!)}</div>
                  </>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </td>
              <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-300">
                {trade.exitTime ? (
                  formatDuration(trade.entryTime, trade.exitTime)
                ) : (
                  <span className="flex items-center text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    Active
                  </span>
                )}
              </td>
              <td className="px-2 py-3 whitespace-nowrap text-sm">
                {trade.pl !== undefined && (
                  <div className={`${
                    trade.pl > 0 ? 'text-green-500' : 
                    trade.pl < 0 ? 'text-red-500' : 
                    'text-gray-400'
                  }`}>
                    <div>{formatCurrency(trade.pl)}</div>
                    <div className="text-xs">
                      {trade.plPoints!.toFixed(2)} pts
                    </div>
                  </div>
                )}
              </td>
              <td className="px-2 py-3 whitespace-nowrap text-sm">
                {trade.status === 'ACTIVE' ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
                    Active
                  </span>
                ) : trade.status === 'CLOSED' ? (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    (trade.pl || 0) >= 0 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-red-900 text-red-300'
                  }`}>
                    {(trade.pl || 0) >= 0 ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {getExitReason(trade, trade.exitPrice || 0)}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                    Pending
                  </span>
                )}
              </td>
              <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-300">
                {trade.status === 'ACTIVE' && (
                  <button
                    onClick={() => onCloseTrade(trade.id)}
                    className="text-red-500 hover:text-red-400 px-2 py-1 rounded text-xs bg-gray-800"
                  >
                    Close
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradeList;