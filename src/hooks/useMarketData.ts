import { useState, useEffect } from 'react';
import { PriceUpdate, Instrument } from '../types';

const useMarketData = (instruments: Instrument[]) => {
  const [prices, setPrices] = useState<Record<Instrument, number>>({
    NQ: 18500,
    ES: 5200
  });
  
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isConnected, setIsConnected] = useState(false);

  // Simulate price updates with random variations
  useEffect(() => {
    setIsConnected(true);
    
    const updateInterval = setInterval(() => {
      setPrices(prev => {
        const updates = { ...prev };
        instruments.forEach(instrument => {
          // Add small random price movements (-0.5% to +0.5%)
          const currentPrice = prev[instrument];
          const change = currentPrice * (Math.random() * 0.01 - 0.005);
          updates[instrument] = +(currentPrice + change).toFixed(2);
        });
        return updates;
      });
      setLastUpdate(new Date());
    }, 1000); // Update every second

    return () => {
      clearInterval(updateInterval);
      setIsConnected(false);
    };
  }, [instruments]);

  const getMarketPrice = (instrument: Instrument): number => {
    return prices[instrument];
  };

  const getAllPrices = (): PriceUpdate[] => {
    return instruments.map(instrument => ({
      instrument,
      price: prices[instrument],
      timestamp: lastUpdate
    }));
  };

  return {
    prices,
    lastUpdate,
    isConnected,
    getMarketPrice,
    getAllPrices
  };
};

export default useMarketData;