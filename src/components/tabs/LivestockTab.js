import React from 'react';
import KpiCard from '../KpiCard';
import DairyChart from '../DairyChart';

function LivestockTab({ data }) {
  return (
    <div>
      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>가축사육통계 · 젖소검정현황</p>
      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <KpiCard title="젖소 사육두수" value={data.kpi.cowCount.value} unit={data.kpi.cowCount.unit} yoy={data.kpi.cowCount.yoy} />
        <KpiCard title="사육 농가수" value="4,892" unit="호" yoy={-3.2} />
        <KpiCard title="농가당 평균 두수" value="79.7" unit="두" yoy={2.1} />
        <KpiCard title="검정 참여율" value="62.4" unit="%" yoy={0.8} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <DairyChart title="젖소 사육두수 추세 (만두)" data={data.productionTrend} lines={[{ key: 'value', name: '사육두수', color: '#8b5cf6' }]} />
        <DairyChart title="사육 농가수 추세 (호)" data={data.productionTrend} lines={[{ key: 'value', name: '농가수', color: '#f59e0b' }]} />
      </div>
    </div>
  );
}

export default LivestockTab;
