import React, { useState, useEffect } from 'react';
import PriceDisplay from './components/PriceDisplay';
import TradeForm from './components/TradeForm';
import TradeList from './components/TradeList';
import TradingSummary from './components/TradingSummary';
import useMarketData from './hooks/useMarketData';
import useTrades from './hooks/useTrades';
import { getNYTimeString } from './utils/timeUtils';
import { ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';

const INSTRUMENTS = ['NQ', 'ES'] as const;

function App() {
  const [currentTime, setCurrentTime] = useState(getNYTimeString());
  const [showTradeForm, setShowTradeForm] = useState(true);
  const [previousPrices, setPreviousPrices] = useState<Record<string, number>>({});
  
  const { prices, getMarketPrice, isConnected } = useMarketData(INSTRUMENTS);
  
  const { 
    trades, 
    scheduleTrade, 
    executeTrade, 
    closeTrade,
    getRealizedPL,
    getUnrealizedPL
  } = useTrades(getMarketPrice);

  // Update current time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getNYTimeString());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Track previous prices for direction indicators
  useEffect(() => {
    setPreviousPrices(prev => {
      const hasValues = Object.keys(prev).length > 0;
      return hasValues ? prices : prev;
    });
    
    const interval = setInterval(() => {
      setPreviousPrices(prices);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [prices]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 text-blue-500 mr-2" />
              <h1 className="text-xl font-bold">Futures Trading Assistant</h1>
            </div>
            <div className="text-gray-400 text-sm">
              {currentTime}
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {INSTRUMENTS.map(instrument => (
            <PriceDisplay
              key={instrument}
              instrument={instrument}
              price={prices[instrument]}
              previousPrice={previousPrices[instrument]}
              isConnected={isConnected}
            />
          ))}
          
          <TradingSummary
            trades={trades}
            unrealizedPL={getUnrealizedPL()}
            realizedPL={getRealizedPL()}
            currentTime={currentTime}
            scheduledTime={trades.some(t => t.status === 'PENDING') ? '1:00 PM' : undefined}
          />
        </div>
        
        <div className="mb-6">
          <div 
            className="flex justify-between items-center bg-gray-800 p-3 rounded-t-lg cursor-pointer"
            onClick={() => setShowTradeForm(!showTradeForm)}
          >
            <h2 className="text-lg font-semibold">Trade Setup</h2>
            {showTradeForm ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
          
          {showTradeForm && (
            <TradeForm
              instruments={INSTRUMENTS}
              onScheduleTrade={scheduleTrade}
              onExecuteTrade={executeTrade}
              currentPrices={prices}
            />
          )}
        </div>
        
        <TradeList 
          trades={trades}
          onCloseTrade={closeTrade}
        />
      </main>
    </div>
  );
}

export default App;