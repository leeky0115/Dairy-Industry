import React from 'react';
import KpiCard from '../KpiCard';
import DairyChart from '../DairyChart';

function SupplyTab({ data }) {
  return (
    <div>
      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>원유수급개황 · 원유사용실적 · 원유사용실적(신분류)</p>
      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <KpiCard title="원유 총 공급량" value="210" unit="만톤" yoy={-1.2} />
        <KpiCard title="시유 사용량" value="142" unit="만톤" yoy={-0.8} />
        <KpiCard title="가공유 사용량" value="48" unit="만톤" yoy={1.1} />
        <KpiCard title="수급 균형률" value="98.4" unit="%" yoy={0.2} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <DairyChart title="원유 수급 추세 (만톤)" data={data.productionTrend} lines={[{ key: 'value', name: '공급량', color: '#3b82f6' }]} />
        <DairyChart title="용도별 원유 사용실적" data={data.priceTrend} lines={[{ key: 'rawMilk', name: '시유', color: '#10b981' }, { key: 'retail', name: '가공유', color: '#f59e0b' }]} />
      </div>
    </div>
  );
}

export default SupplyTab;
