import { useState, useEffect } from 'react';
import { subDays, format } from 'date-fns';
import { Instrument, HistoricalPrice } from '../types';

const useHistoricalData = (instrument: Instrument) => {
  const [historicalData, setHistoricalData] = useState<HistoricalPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setLoading(true);
      try {
        // Simulate fetching 365 days of historical data
        const endDate = new Date();
        const startDate = subDays(endDate, 365);
        
        // Generate simulated historical data
        const data: HistoricalPrice[] = [];
        let currentDate = startDate;
        let lastPrice = instrument === 'NQ' ? 18500 : 5200;
        
        while (currentDate <= endDate) {
          if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // Skip weekends
            const volatility = instrument === 'NQ' ? 100 : 30;
            const dailyChange = (Math.random() - 0.5) * volatility;
            
            const open = lastPrice;
            const close = lastPrice + dailyChange;
            const high = Math.max(open, close) + (Math.random() * volatility * 0.5);
            const low = Math.min(open, close) - (Math.random() * volatility * 0.5);
            const volume = Math.floor(Math.random() * 1000000);
            
            data.push({
              timestamp: new Date(currentDate),
              open,
              high,
              low,
              close,
              volume
            });
            
            lastPrice = close;
          }
          currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
        }
        
        setHistoricalData(data);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [instrument]);

  return {
    historicalData,
    loading
  };
};

export default useHistoricalData;