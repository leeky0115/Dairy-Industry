import React from 'react';
import DairyChart from '../DairyChart';

function SupplyTab({ supplyTrend }) {
  const latest = supplyTrend[supplyTrend.length - 1] || {};
  return (
    <div>
      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>원유수급개황 · 국내생산 기준 · 월별</p>
      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', flex: '1', minWidth: '160px' }}>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px' }}>국내 원유 생산량</p>
          <p style={{ fontSize: '24px', fontWeight: '500', margin: '0', color: '#111827' }}>
            {(latest.domesticProduction || 0).toLocaleString()}
            <span style={{ fontSize: '12px', fontWeight: '400', color: '#6b7280', marginLeft: '4px' }}>톤</span>
          </p>
          {latest.label && <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0' }}>기준: {latest.label}</p>}
        </div>
      </div>
      <DairyChart title="국내 원유 생산량 추세 (톤)" data={supplyTrend} lines={[{ key: 'domesticProduction', name: '국내생산량', color: '#3b82f6' }]} />
    </div>
  );
}

export default SupplyTab;
