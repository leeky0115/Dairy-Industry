import React from 'react';
import KpiCard from '../KpiCard';
import DairyChart from '../DairyChart';

function PriceTab({ kpi, priceTrend }) {
  return (
    <div>
      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>원유수취가격 · 전국 기준 · 월별</p>
      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <KpiCard title="원유수취가격" {...kpi.rawMilkPrice} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <DairyChart title="원유수취가격 전체 추세 (원/kg)" data={priceTrend} lines={[{ key: 'rawMilk', name: '수취가격', color: '#10b981' }]} />
        <DairyChart title="최근 3년 추세" data={priceTrend.filter(d => ['2024','2025','2026'].includes(d.year))} lines={[{ key: 'rawMilk', name: '수취가격', color: '#3b82f6' }]} />
      </div>
    </div>
  );
}

export default PriceTab;
