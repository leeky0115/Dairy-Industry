import React from 'react';

const levelStyle = {
  danger:  { bg: '#fef2f2', color: '#dc2626', label: '주의' },
  warning: { bg: '#fffbeb', color: '#d97706', label: '모니터' },
  success: { bg: '#f0fdf4', color: '#059669', label: '정상' }
};

function AlertPanel({ alerts }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px'
    }}>
      <p style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 14px', color: '#111827' }}>의사결정 알림</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {alerts.map((alert, i) => {
          const s = levelStyle[alert.level];
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{
                background: s.bg, color: s.color,
                fontSize: '11px', padding: '2px 8px',
                borderRadius: '6px', whiteSpace: 'nowrap', marginTop: '1px'
              }}>{s.label}</span>
              <p style={{ fontSize: '13px', color: '#374151', margin: '0', lineHeight: '1.5' }}>
                {alert.message}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AlertPanel;
