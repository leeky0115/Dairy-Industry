import React from 'react';

const years = ['전체', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
const months = ['전체', '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const quarters = ['전체', '1분기', '2분기', '3분기', '4분기'];

function Btn({ label, active, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      padding: '5px 10px', fontSize: '12px',
      fontWeight: active ? '500' : '400',
      color: active ? '#fff' : '#6b7280',
      background: active ? (color || '#111827') : '#fff',
      border: '1px solid #e5e7eb', borderRadius: '6px',
      cursor: 'pointer', transition: 'all 0.15s'
    }}>{label}</button>
  );
}

function DateFilter({ selectedYear, selectedMonth, selectedQuarter, onYearChange, onMonthChange, onQuarterChange, showQuarter }) {
  return (
    <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', color: '#6b7280', minWidth: '28px' }}>연도</span>
        {years.map(y => <Btn key={y} label={y} active={selectedYear === y} onClick={() => onYearChange(y)} />)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', color: '#6b7280', minWidth: '28px' }}>{showQuarter ? '분기' : '월'}</span>
        {showQuarter
          ? quarters.map(q => <Btn key={q} label={q} active={selectedQuarter === q} onClick={() => onQuarterChange(q)} color="#3b82f6" />)
          : months.map(m => <Btn key={m} label={m} active={selectedMonth === m} onClick={() => onMonthChange(m)} color="#3b82f6" />)
        }
      </div>
    </div>
  );
}

export default DateFilter;
