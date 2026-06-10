import React from 'react';
import KpiCard from '../KpiCard';
import DairyChart from '../DairyChart';
import AlertPanel from '../AlertPanel';
import ImportExportTable from '../ImportExportTable';

function OverviewTab({ data }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <KpiCard title="원유 생산량" value={data.kpi.milkProduction.value} unit={data.kpi.milkProduction.unit} yoy={data.kpi.milkProduction.yoy} />
        <KpiCard title="원유 기본가격" value={data.kpi.rawMilkPrice.value} unit={data.kpi.rawMilkPrice.unit} yoy={data.kpi.rawMilkPrice.yoy} />
        <KpiCard title="젖소 사육두수" value={data.kpi.cowCount.value} unit={data.kpi.cowCount.unit} yoy={data.kpi.cowCount.yoy} />
        <KpiCard title="시유 소매가" value={data.kpi.retailPrice.value} unit={data.kpi.retailPrice.unit} yoy={data.kpi.retailPrice.yoy} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
        <DairyChart title="원유 생산량 추세 (만톤)" data={data.productionTrend} lines={[{ key: 'value', name: '생산량', color: '#3b82f6' }]} />
        <DairyChart title="원유가 vs 소매가 추세 (원)" data={data.priceTrend} lines={[{ key: 'rawMilk', name: '원유가', color: '#10b981' }, { key: 'retail', name: '소매가', color: '#ef4444' }]} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <AlertPanel alerts={data.alerts} />
        <ImportExportTable data={data.importExport} />
      </div>
    </div>
  );
}

export default OverviewTab;
