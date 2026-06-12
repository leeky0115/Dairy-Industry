import React from 'react';
import KpiCard from '../KpiCard';
import DairyChart from '../DairyChart';

function LivestockTab({ kpi, livestockTrend }) {
  return (
    <div>
      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>가축사육통계 · 착유우두수 기준 · 분기별</p>
      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <KpiCard title="착유우 두수" {...kpi.cowCount} />
        <KpiCard title="낙농가수" {...kpi.farmCount} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <DairyChart title="착유우 두수 추세 (두)" data={livestockTrend} lines={[{ key: '착유우두수', name: '착유우두수', color: '#3b82f6' }]} />
        <DairyChart title="낙농가수 추세 (호)" data={livestockTrend} lines={[{ key: '낙농가수', name: '낙농가수', color: '#f59e0b' }]} />
      </div>
    </div>
  );
}

export default LivestockTab;
