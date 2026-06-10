import React from 'react';
import KpiCard from '../KpiCard';
import DairyChart from '../DairyChart';

function PriceTab({ data }) {
  return (
    <div>
      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>젖소산지가격 · 원유수취가격 · 젖소검정현황</p>
      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <KpiCard title="원유 기본가격" value={data.kpi.rawMilkPrice.value} unit={data.kpi.rawMilkPrice.unit} yoy={data.kpi.rawMilkPrice.yoy} />
        <KpiCard title="시유 소매가" value={data.kpi.retailPrice.value} unit={data.kpi.retailPrice.unit} yoy={data.kpi.retailPrice.yoy} />
        <KpiCard title="가격 갭" value={(data.kpi.retailPrice.value - data.kpi.rawMilkPrice.value).toLocaleString()} unit="원" yoy={1.4} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <DairyChart title="원유가 vs 소매가 추세 (원)" data={data.priceTrend} lines={[{ key: 'rawMilk', name: '원유가', color: '#10b981' }, { key: 'retail', name: '소매가', color: '#ef4444' }]} />
        <DairyChart title="원유 수취가격 추세 (원/kg)" data={data.priceTrend} lines={[{ key: 'rawMilk', name: '수취가격', color: '#f59e0b' }]} />
      </div>
    </div>
  );
}

export default PriceTab;
