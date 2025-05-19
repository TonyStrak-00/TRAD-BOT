import React, { useState } from 'react';
import { Instrument, TradeDirection } from '../types';
import { ArrowUp, ArrowDown, Clock } from 'lucide-react';

interface TradeFormProps {
  instruments: Instrument[];
  onScheduleTrade: (
    instruments: Instrument[],
    direction: TradeDirection,
    stopLoss?: number,
    takeProfit?: number,
    targetExitTime?: Date
  ) => void;
  onExecuteTrade: (
    instrument: Instrument,
    direction: TradeDirection,
    stopLoss?: number,
    takeProfit?: number,
    targetExitTime?: Date
  ) => void;
  currentPrices: Record<Instrument, number>;
}

const TradeForm: React.FC<TradeFormProps> = ({
  instruments,
  onScheduleTrade,
  onExecuteTrade,
  currentPrices
}) => {
  const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>(['NQ', 'ES']);
  const [direction, setDirection] = useState<TradeDirection>('LONG');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [exitHour, setExitHour] = useState<string>('13');
  const [exitMinute, setExitMinute] = useState<string>('30');
  const [useScheduled, setUseScheduled] = useState<boolean>(true);
  const [useStopLoss, setUseStopLoss] = useState<boolean>(false);
  const [useTakeProfit, setUseTakeProfit] = useState<boolean>(false);
  const [useTimeExit, setUseTimeExit] = useState<boolean>(true);

  const handleToggleInstrument = (instrument: Instrument) => {
    if (selectedInstruments.includes(instrument)) {
      setSelectedInstruments(selectedInstruments.filter(i => i !== instrument));
    } else {
      setSelectedInstruments([...selectedInstruments, instrument]);
    }
  };

  const calculateDefaultStopLoss = (instrument: Instrument): number => {
    const price = currentPrices[instrument];
    const modifier = direction === 'LONG' ? -1 : 1;
    const stopDistance = instrument === 'NQ' ? 30 : 10; // Example distances
    return price + (stopDistance * modifier);
  };

  const calculateDefaultTakeProfit = (instrument: Instrument): number => {
    const price = currentPrices[instrument];
    const modifier = direction === 'LONG' ? 1 : -1;
    const profitDistance = instrument === 'NQ' ? 60 : 20; // Example distances
    return price + (profitDistance * modifier);
  };

  const handleSetDefaultLevels = () => {
    if (selectedInstruments.length > 0) {
      const instrument = selectedInstruments[0];
      setStopLoss(calculateDefaultStopLoss(instrument).toString());
      setTakeProfit(calculateDefaultTakeProfit(instrument).toString());
    }
  };

  const handleScheduleTrade = () => {
    if (selectedInstruments.length === 0) return;
    
    const parsedStopLoss = useStopLoss ? parseFloat(stopLoss) : undefined;
    const parsedTakeProfit = useTakeProfit ? parseFloat(takeProfit) : undefined;
    
    let targetExitTime: Date | undefined;
    
    if (useTimeExit) {
      targetExitTime = new Date();
      targetExitTime.setHours(parseInt(exitHour, 10));
      targetExitTime.setMinutes(parseInt(exitMinute, 10));
      targetExitTime.setSeconds(0);
    }
    
    onScheduleTrade(
      selectedInstruments,
      direction,
      parsedStopLoss,
      parsedTakeProfit,
      targetExitTime
    );
  };

  const handleExecuteTrade = (instrument: Instrument) => {
    const parsedStopLoss = useStopLoss ? parseFloat(stopLoss) : undefined;
    const parsedTakeProfit = useTakeProfit ? parseFloat(takeProfit) : undefined;
    
    let targetExitTime: Date | undefined;
    
    if (useTimeExit) {
      targetExitTime = new Date();
      targetExitTime.setHours(parseInt(exitHour, 10));
      targetExitTime.setMinutes(parseInt(exitMinute, 10));
      targetExitTime.setSeconds(0);
    }
    
    onExecuteTrade(
      instrument,
      direction,
      parsedStopLoss,
      parsedTakeProfit,
      targetExitTime
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <h2 className="text-lg font-semibold text-white mb-4">Trade Setup</h2>
      
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-medium mb-2">
          Select Instruments
        </label>
        <div className="flex space-x-2">
          {instruments.map(instrument => (
            <button
              key={instrument}
              onClick={() => handleToggleInstrument(instrument)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                selectedInstruments.includes(instrument)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {instrument}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-medium mb-2">
          Direction
        </label>
        <div className="flex space-x-2">
          <button
            onClick={() => setDirection('LONG')}
            className={`flex items-center px-3 py-1 rounded-md text-sm font-medium ${
              direction === 'LONG'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            <ArrowUp className="h-4 w-4 mr-1" />
            LONG
          </button>
          <button
            onClick={() => setDirection('SHORT')}
            className={`flex items-center px-3 py-1 rounded-md text-sm font-medium ${
              direction === 'SHORT'
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            <ArrowDown className="h-4 w-4 mr-1" />
            SHORT
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="useStopLoss"
            checked={useStopLoss}
            onChange={() => setUseStopLoss(!useStopLoss)}
            className="h-4 w-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500"
          />
          <label htmlFor="useStopLoss" className="ml-2 text-sm text-gray-300">
            Stop Loss
          </label>
        </div>
        {useStopLoss && (
          <input
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            className="mt-1 w-full bg-gray-700 text-white rounded-md border-gray-600 p-2 text-sm"
            placeholder="Enter stop loss price"
          />
        )}
      </div>
      
      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="useTakeProfit"
            checked={useTakeProfit}
            onChange={() => setUseTakeProfit(!useTakeProfit)}
            className="h-4 w-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500"
          />
          <label htmlFor="useTakeProfit" className="ml-2 text-sm text-gray-300">
            Take Profit
          </label>
        </div>
        {useTakeProfit && (
          <input
            type="number"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
            className="mt-1 w-full bg-gray-700 text-white rounded-md border-gray-600 p-2 text-sm"
            placeholder="Enter take profit price"
          />
        )}
      </div>
      
      {(useStopLoss || useTakeProfit) && (
        <button
          onClick={handleSetDefaultLevels}
          className="mb-4 text-xs px-2 py-1 bg-gray-700 text-blue-400 rounded"
        >
          Set Default Levels
        </button>
      )}
      
      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="useTimeExit"
            checked={useTimeExit}
            onChange={() => setUseTimeExit(!useTimeExit)}
            className="h-4 w-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500"
          />
          <label htmlFor="useTimeExit" className="ml-2 text-sm text-gray-300 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Exit Time (NY)
          </label>
        </div>
        {useTimeExit && (
          <div className="mt-1 flex space-x-2">
            <input
              type="number"
              value={exitHour}
              onChange={(e) => setExitHour(e.target.value)}
              min="0"
              max="23"
              className="w-16 bg-gray-700 text-white rounded-md border-gray-600 p-2 text-sm"
              placeholder="HH"
            />
            <span className="text-white self-center">:</span>
            <input
              type="number"
              value={exitMinute}
              onChange={(e) => setExitMinute(e.target.value)}
              min="0"
              max="59"
              className="w-16 bg-gray-700 text-white rounded-md border-gray-600 p-2 text-sm"
              placeholder="MM"
            />
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="useScheduled"
            checked={useScheduled}
            onChange={() => setUseScheduled(!useScheduled)}
            className="h-4 w-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500"
          />
          <label htmlFor="useScheduled" className="ml-2 text-sm text-gray-300">
            Schedule for 1:00 PM (NY Time)
          </label>
        </div>
      </div>
      
      {useScheduled ? (
        <button
          onClick={handleScheduleTrade}
          disabled={selectedInstruments.length === 0}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50"
        >
          Schedule Trade
        </button>
      ) : (
        <div className="space-y-2">
          {selectedInstruments.map(instrument => (
            <button
              key={instrument}
              onClick={() => handleExecuteTrade(instrument)}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
            >
              Execute {instrument} Trade Now
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TradeForm;