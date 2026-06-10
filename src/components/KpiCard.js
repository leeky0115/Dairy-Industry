import React from 'react';

function KpiCard({ title, value, unit, yoy }) {
  const isPositive = yoy > 0;
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
      flex: '1',
      minWidth: '160px'
    }}>
      <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 8px' }}>{title}</p>
      <p style={{ fontSize: '26px', fontWeight: '500', margin: '0', color: '#111827' }}>
        {value}
        <span style={{ fontSize: '13px', fontWeight: '400', color: '#6b7280', marginLeft: '4px' }}>{unit}</span>
      </p>
      <p style={{ fontSize: '12px', margin: '6px 0 0', color: isPositive ? '#059669' : '#dc2626' }}>
        {isPositive ? '▲' : '▼'} {Math.abs(yoy)}% YoY
      </p>
    </div>
  );
}

export default KpiCard;
