// Safe time percentage calculator
export const calculateTimePercent = (timeData) => {
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
      return ((hours * 60) + minutes) / 1440 * 100;
    }
  }
  const date = new Date(timeData);
  if (isNaN(date.getTime())) return 0;
  return (((date.getHours() * 60) + date.getMinutes()) / 1440) * 100;
};

// Safe display formatter
export const formatDisplayTime = (timeData) => {
  if (!timeData) return '';
  if (typeof timeData === 'string' && !timeData.includes('T') && timeData.length <= 10) return timeData;
  const d = new Date(timeData);
  if (!isNaN(d.getTime())) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return '';
};

// Helper to format date string to YYYY-MM-DD for API matching
export const formatDateString = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
