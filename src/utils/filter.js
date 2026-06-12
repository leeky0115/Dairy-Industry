export function filterMonthly(data, year, month) {
  if (!data || data.length === 0) return data;
  return data.filter(d => {
    const yearMatch = year === '전체' || d.year === year;
    const monthMatch = month === '전체' || d.month === String(parseInt(month));
    return yearMatch && monthMatch;
  });
}

export function filterQuarterly(data, year, quarter) {
  if (!data || data.length === 0) return data;
  return data.filter(d => {
    const yearMatch = year === '전체' || d.year === year;
    const quarterMatch = quarter === '전체' || d.quarter === quarter;
    return yearMatch && quarterMatch;
  });
}
