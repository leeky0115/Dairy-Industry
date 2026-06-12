import React from 'react';
import KpiCard from '../KpiCard';
import DairyChart from '../DairyChart';

function ProductionTab({ kpi, productionTrend, supplyTrend }) {
  return (
    <div>
      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>원유생산통계 · 원유수급개황 · 월별</p>
      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <KpiCard title="원유 생산량" {...kpi.milkProduction} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <DairyChart title="원유 생산량 추세 (톤)" data={productionTrend} lines={[{ key: 'rawMilkTon', name: '생산량', color: '#3b82f6' }]} />
        <DairyChart title="국내 원유 생산량 추세 (톤)" data={supplyTrend} lines={[{ key: 'domesticProduction', name: '국내생산', color: '#8b5cf6' }]} />
      </div>
    </div>
  );
}

export default ProductionTab;
