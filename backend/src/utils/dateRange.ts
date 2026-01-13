export function getWeeklyRange(referenceDate: Date = new Date()) {
  const start = new Date(referenceDate);
  start.setDate(start.getDate() - start.getDay()); // Sunday
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Saturday
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export function getMonthlyRange(referenceDate: Date = new Date()) {
  const start = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
  const end = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

export function getYearlyRange(referenceDate: Date = new Date()) {
  const start = new Date(referenceDate.getFullYear(), 0, 1);
  const end = new Date(referenceDate.getFullYear(), 11, 31, 23, 59, 59, 999);
  return { start, end };
}
