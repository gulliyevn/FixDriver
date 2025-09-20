// Time utilities for earnings screen
export const formatTime = (totalSeconds: number): string => {
  const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const ss = String(totalSeconds % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
};

export const formatHoursToSeconds = (hours: number): number => {
  return Math.max(0, Math.floor(hours * 3600));
};

export const getCurrentTimeString = (vipCurrentHours: number): string => {
  const totalSeconds = formatHoursToSeconds(vipCurrentHours);
  return formatTime(totalSeconds);
};
