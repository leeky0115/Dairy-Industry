import React from 'react';
import KpiCard from '../KpiCard';
import DairyChart from '../DairyChart';

function ProductionTab({ data }) {
  return (
    <div>
      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>원유생산통계 · 낙농진흥회 원유생산통계 · 우유생산비 · 원유검사현황</p>
      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <KpiCard title="원유 생산량" value={data.kpi.milkProduction.value} unit={data.kpi.milkProduction.unit} yoy={data.kpi.milkProduction.yoy} />
        <KpiCard title="우유 생산비" value="856" unit="원/kg" yoy={1.2} />
        <KpiCard title="원유 검사 합격률" value="99.2" unit="%" yoy={0.1} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <DairyChart
          title="원유 생산량 추세 (톤)"
          data={data.productionTrend}
          lines={[{ key: 'rawMilkTon', name: '생산량', color: '#3b82f6' }]}
        />
        <DairyChart
          title="월별 생산량 비교"
          data={data.productionTrend}
          lines={[{ key: 'rawMilkTon', name: '생산량', color: '#8b5cf6' }]}
        />
      </div>
    </div>
  );
}

export default ProductionTab;
