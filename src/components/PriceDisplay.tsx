import React from 'react';
import { Instrument } from '../types';
import { formatPrice } from '../utils/tradeUtils';
import { INSTRUMENTS_CONFIG } from '../constants';
import { ArrowUp, ArrowDown, Wifi, WifiOff } from 'lucide-react';

interface PriceDisplayProps {
  instrument: Instrument;
  price: number;
  previousPrice?: number;
  isConnected: boolean;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ 
  instrument, 
  price, 
  previousPrice,
  isConnected
}) => {
  const priceDirection = 
    !previousPrice ? 'neutral' :
    price > previousPrice ? 'up' :
    price < previousPrice ? 'down' : 'neutral';
  
  return (
    <div className="flex flex-col bg-gray-800 rounded-lg p-4 shadow-lg">
      <div className="flex justify-between items-center mb-1">
        <span className="text-gray-400 text-sm font-semibold">
          {INSTRUMENTS_CONFIG[instrument].symbol}
        </span>
        {isConnected ? (
          <Wifi className="h-4 w-4 text-green-500" />
        ) : (
          <WifiOff className="h-4 w-4 text-red-500" />
        )}
      </div>
      <div className="flex items-center">
        <span 
          className={`text-2xl font-bold ${
            priceDirection === 'up' ? 'text-green-500' : 
            priceDirection === 'down' ? 'text-red-500' : 
            'text-white'
          }`}
        >
          {formatPrice(instrument, price)}
        </span>
        
        {priceDirection === 'up' && (
          <ArrowUp className="h-5 w-5 text-green-500 ml-2" />
        )}
        
        {priceDirection === 'down' && (
          <ArrowDown className="h-5 w-5 text-red-500 ml-2" />
        )}
      </div>
    </div>
  );
};

export default PriceDisplay;