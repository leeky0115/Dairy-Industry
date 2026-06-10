import React from 'react';
import KpiCard from '../KpiCard';
import ImportExportTable from '../ImportExportTable';
import DairyChart from '../DairyChart';

function TradeTab({ data }) {
  return (
    <div>
      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>유제품 수출입통계 · 품목별수출입 · 품목별수출입(신분류)</p>
      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <KpiCard title="유제품 총 수입량" value="20.3" unit="만톤" yoy={2.8} />
        <KpiCard title="유제품 총 수출량" value="1.6" unit="만톤" yoy={1.2} />
        <KpiCard title="무역 수지" value="-18.7" unit="만톤" yoy={-3.1} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <ImportExportTable data={data.importExport} />
        <DairyChart
          title="소매가 추세 (원/1L)"
          data={data.priceTrend}
          lines={[{ key: 'retail', name: '소매가', color: '#ef4444' }]}
        />
      </div>
    </div>
  );
}

export default TradeTab;
