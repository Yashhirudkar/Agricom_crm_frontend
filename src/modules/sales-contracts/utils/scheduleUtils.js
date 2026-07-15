export const getScheduleStatus = (contractDate) => {
  if (!contractDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(contractDate);
  targetDate.setHours(0, 0, 0, 0);

  const timeDiff = targetDate.getTime() - today.getTime();
  const daysDiff = Math.round(timeDiff / (1000 * 3600 * 24));

  return daysDiff;
};
