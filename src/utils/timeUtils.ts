export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'America/New_York'
  }).format(date);
};

export const formatDuration = (startTime: Date, endTime: Date): string => {
  const durationMs = endTime.getTime() - startTime.getTime();
  const seconds = Math.floor(durationMs / 1000) % 60;
  const minutes = Math.floor(durationMs / (1000 * 60)) % 60;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

export const getCurrentNYTime = (): Date => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
};

export const getNYTimeString = (): string => {
  return formatTime(getCurrentNYTime());
};

export const isSpecificTime = (targetHour: number, targetMinute: number): boolean => {
  const now = getCurrentNYTime();
  return now.getHours() === targetHour && now.getMinutes() === targetMinute;
};

export const isWithinTradingHours = (): boolean => {
  const now = getCurrentNYTime();
  const currentTime = now.getHours() * 100 + now.getMinutes();
  
  const [startHour, startMinute] = '09:30'.split(':').map(Number);
  const [endHour, endMinute] = '16:00'.split(':').map(Number);
  
  const startTime = startHour * 100 + startMinute;
  const endTime = endHour * 100 + endMinute;
  
  return currentTime >= startTime && currentTime <= endTime;
};