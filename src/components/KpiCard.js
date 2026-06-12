import React from 'react';

function KpiCard({ title, value, unit, yoy, sub }) {
  const isPositive = yoy > 0;
  const isZero = yoy === 0 || yoy === null;
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', flex: '1', minWidth: '160px' }}>
      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px' }}>{title}</p>
      <p style={{ fontSize: '24px', fontWeight: '500', margin: '0', color: '#111827' }}>
        {value}
        <span style={{ fontSize: '12px', fontWeight: '400', color: '#6b7280', marginLeft: '4px' }}>{unit}</span>
      </p>
      {yoy !== null && (
        <p style={{ fontSize: '12px', margin: '4px 0 0', color: isZero ? '#6b7280' : isPositive ? '#059669' : '#dc2626' }}>
          {isZero ? '─' : isPositive ? '▲' : '▼'} {Math.abs(yoy)}% YoY
        </p>
      )}
      {sub && <p style={{ fontSize: '11px', color: '#9ca3af', margin: '3px 0 0' }}>{sub}</p>}
    </div>
  );
}

export default KpiCard;
