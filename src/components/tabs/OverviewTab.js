import React from 'react';
import KpiCard from '../KpiCard';
import DairyChart from '../DairyChart';
import AlertPanel from '../AlertPanel';

function OverviewTab({ kpi, alerts, productionTrend, priceTrend }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <KpiCard title="원유 생산량" {...kpi.milkProduction} />
        <KpiCard title="원유수취가격" {...kpi.rawMilkPrice} />
        <KpiCard title="착유우 두수" {...kpi.cowCount} />
        <KpiCard title="낙농가수" {...kpi.farmCount} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
        <DairyChart title="원유 생산량 추세 (톤)" data={productionTrend} lines={[{ key: 'rawMilkTon', name: '생산량', color: '#3b82f6' }]} />
        <DairyChart title="원유수취가격 추세 (원/kg)" data={priceTrend} lines={[{ key: 'rawMilk', name: '수취가격', color: '#10b981' }]} />
      </div>
      <AlertPanel alerts={alerts} />
    </div>
  );
}

export default OverviewTab;
