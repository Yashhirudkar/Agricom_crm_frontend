const getSecondsFromMidnight = (timeData) => {
  if (!timeData) return 0;
  if (typeof timeData === 'string') {
    const timeMatch = timeData.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (timeMatch && !timeData.includes('T')) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const modifier = timeMatch[3];
      if (modifier) {
        if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
        if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
      }
      return (hours * 3600) + (minutes * 60);
    }
  }
  const date = new Date(timeData);
  if (isNaN(date.getTime())) return 0;
  return (date.getHours() * 3600) + (date.getMinutes() * 60) + date.getSeconds();
};

// Safe time percentage calculator relative to shift duration
export const calculateTimePercent = (timeData, shiftStart = "09:30", shiftEnd = "18:00") => {
  if (!timeData) return 0;
  
  const timeSecs = getSecondsFromMidnight(timeData);
  const startSecs = getSecondsFromMidnight(shiftStart);
  const endSecs = getSecondsFromMidnight(shiftEnd);
  
  const totalShiftSecs = endSecs - startSecs;
  if (totalShiftSecs <= 0) return 0;

  // Clamp percentage between 0 and 100
  let percent = ((timeSecs - startSecs) / totalShiftSecs) * 100;
  return Math.max(0, Math.min(100, percent));
};

// Safe display formatter
export const formatDisplayTime = (timeData, withSeconds = false) => {
  if (!timeData) return '';
  if (typeof timeData === 'string' && !timeData.includes('T') && timeData.length <= 10) return timeData;
  const d = new Date(timeData);
  if (!isNaN(d.getTime())) {
    return d.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      ...(withSeconds ? { second: '2-digit' } : {})
    });
  }
  return '';
};

// Helper to format date string to YYYY-MM-DD for API matching
export const formatDateString = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
