import React from 'react';
import { BacktestResult } from '../types';
import { formatCurrency } from '../utils/tradeUtils';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

interface BacktestResultsProps {
  results: BacktestResult;
}

const BacktestResults: React.FC<BacktestResultsProps> = ({ results }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <div className="flex items-center mb-4">
        <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
        <h2 className="text-lg font-semibold text-white">Backtest Results</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 rounded p-3">
          <div className="text-sm text-gray-400">Total P/L</div>
          <div className={`text-xl font-bold ${
            results.totalPL >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {formatCurrency(results.totalPL)}
          </div>
        </div>
        
        <div className="bg-gray-700 rounded p-3">
          <div className="text-sm text-gray-400">Win Rate</div>
          <div className="text-xl font-bold text-white">
            {(results.winRate * 100).toFixed(1)}%
          </div>
        </div>
        
        <div className="bg-gray-700 rounded p-3">
          <div className="text-sm text-gray-400">Max Drawdown</div>
          <div className="text-xl font-bold text-red-500">
            {formatCurrency(results.maxDrawdown)}
          </div>
        </div>
        
        <div className="bg-gray-700 rounded p-3">
          <div className="text-sm text-gray-400">Average Win</div>
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-lg font-bold text-green-500">
              {formatCurrency(results.averageWin)}
            </span>
          </div>
        </div>
        
        <div className="bg-gray-700 rounded p-3">
          <div className="text-sm text-gray-400">Average Loss</div>
          <div className="flex items-center">
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-lg font-bold text-red-500">
              {formatCurrency(results.averageLoss)}
            </span>
          </div>
        </div>
        
        <div className="bg-gray-700 rounded p-3">
          <div className="text-sm text-gray-400">Sharpe Ratio</div>
          <div className="text-xl font-bold text-white">
            {results.sharpeRatio.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacktestResults;