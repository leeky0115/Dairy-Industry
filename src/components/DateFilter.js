import React from 'react';

const years = ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
const months = ['전체', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

function DateFilter({ selectedYear, selectedMonth, onYearChange, onMonthChange }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '20px',
      flexWrap: 'wrap'
    }}>
      <span style={{ fontSize: '13px', color: '#6b7280' }}>기간 선택</span>
      <div style={{ display: 'flex', gap: '6px' }}>
        {years.map(year => (
          <button
            key={year}
            onClick={() => onYearChange(year)}
            style={{
              padding: '5px 10px',
              fontSize: '12px',
              fontWeight: selectedYear === year ? '500' : '400',
              color: selectedYear === year ? '#ffffff' : '#6b7280',
              background: selectedYear === year ? '#111827' : '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            {year}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {months.map(month => (
          <button
            key={month}
            onClick={() => onMonthChange(month)}
            style={{
              padding: '5px 8px',
              fontSize: '12px',
              fontWeight: selectedMonth === month ? '500' : '400',
              color: selectedMonth === month ? '#ffffff' : '#6b7280',
              background: selectedMonth === month ? '#3b82f6' : '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DateFilter;
