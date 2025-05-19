import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { HistoricalPrice } from '../types';

interface PriceChartProps {
  data: HistoricalPrice[];
  trades?: {
    time: Date;
    price: number;
    type: 'entry' | 'exit';
    direction: 'long' | 'short';
  }[];
}

const PriceChart: React.FC<PriceChartProps> = ({ data, trades }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1F2937' },
        textColor: '#9CA3AF',
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
    });

    const candlestickSeries = chartRef.current.addCandlestickSeries({
      upColor: '#10B981',
      downColor: '#EF4444',
      borderVisible: false,
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
    });

    candlestickSeries.setData(
      data.map(item => ({
        time: item.timestamp.getTime() / 1000,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }))
    );

    if (trades) {
      const markers = trades.map(trade => ({
        time: trade.time.getTime() / 1000,
        position: trade.type === 'entry' ? 'belowBar' : 'aboveBar',
        color: trade.direction === 'long' ? '#10B981' : '#EF4444',
        shape: trade.type === 'entry' ? 'arrowUp' : 'arrowDown',
        text: `${trade.type === 'entry' ? 'Enter' : 'Exit'} ${trade.price.toFixed(2)}`,
      }));

      candlestickSeries.setMarkers(markers);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [data, trades]);

  return <div ref={chartContainerRef} className="w-full h-[300px]" />;
};

export default PriceChart;