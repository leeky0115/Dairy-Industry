import React from 'react';
import KpiCard from '../KpiCard';
import DairyChart from '../DairyChart';

function DistributionTab({ data }) {
  return (
    <div>
      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>유통소비통계 · 유제품수급 · 분유재고현황</p>
      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <KpiCard title="1인당 우유 소비량" value="31.2" unit="kg/년" yoy={-1.8} />
        <KpiCard title="유제품 총 소비량" value="184" unit="만톤" yoy={0.9} />
        <KpiCard title="분유 재고량" value="2.4" unit="만톤" yoy={-3.1} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <DairyChart
          title="소매가 추세 (원/1L)"
          data={data.priceTrend}
          lines={[{ key: 'retail', name: '소매가', color: '#ec4899' }]}
        />
        <DairyChart
          title="원유 생산량 추세 (톤)"
          data={data.productionTrend}
          lines={[{ key: 'rawMilkTon', name: '생산량', color: '#f59e0b' }]}
        />
      </div>
    </div>
  );
}

export default DistributionTab;
