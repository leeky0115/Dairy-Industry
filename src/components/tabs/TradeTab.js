import React from 'react';
import KpiCard from '../KpiCard';
import DairyChart from '../DairyChart';

function TradeTab({ tradeTrend }) {
  const latest = tradeTrend[tradeTrend.length - 1] || {};
  const prev12 = tradeTrend.length >= 13 ? tradeTrend[tradeTrend.length - 13] : null;
  const yoy = prev12 && latest.total ? parseFloat(((latest.total - prev12.total) / prev12.total * 100).toFixed(1)) : 0;

  return (
    <div>
      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>품목별수출입(신분류) · 월별</p>
      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <KpiCard title="총 수입량" value={(latest.total || 0).toLocaleString()} unit="톤" yoy={yoy} sub={latest.label ? `기준: ${latest.label}` : ''} />
        <KpiCard title="밀크·크림" value={(latest.milkCream || 0).toLocaleString()} unit="톤" yoy={null} />
        <KpiCard title="탈지분유" value={(latest.skimMilk || 0).toLocaleString()} unit="톤" yoy={null} />
        <KpiCard title="전지분유" value={(latest.wholeMilk || 0).toLocaleString()} unit="톤" yoy={null} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <DairyChart title="유제품 총 수입 추세 (톤)" data={tradeTrend} lines={[{ key: 'total', name: '총수입', color: '#ef4444' }]} />
        <DairyChart title="품목별 수입 추세 (톤)" data={tradeTrend} lines={[
          { key: 'milkCream', name: '밀크·크림', color: '#3b82f6' },
          { key: 'skimMilk', name: '탈지분유', color: '#10b981' },
          { key: 'wholeMilk', name: '전지분유', color: '#f59e0b' }
        ]} />
      </div>
    </div>
  );
}

export default TradeTab;
