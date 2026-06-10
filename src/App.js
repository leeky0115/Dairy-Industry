import React, { useState, useEffect } from 'react';
import KpiCard from './components/KpiCard';
import DairyChart from './components/DairyChart';
import AlertPanel from './components/AlertPanel';
import ImportExportTable from './components/ImportExportTable';
import dairyData from './data/dairyData.json';
import { fetchCowCount, fetchMilkProduction } from './data/fetchKosis';

function App() {
  const [data, setData] = useState(dairyData);
  const [lastUpdated] = useState('2026.06');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cowData, milkData] = await Promise.all([
          fetchCowCount(),
          fetchMilkProduction()
        ]);

        if (cowData && milkData) {
          setData(prev => ({
            ...prev,
            kpi: {
              ...prev.kpi,
              cowCount: {
                value: cowData[0]?.DT ? parseFloat(cowData[0].DT / 10000).toFixed(1) : prev.kpi.cowCount.value,
                unit: '만두',
                yoy: prev.kpi.cowCount.yoy
              },
              milkProduction: {
                value: milkData[0]?.DT ? parseFloat(milkData[0].DT / 10000).toFixed(1) : prev.kpi.milkProduction.value,
                unit: '만톤',
                yoy: prev.kpi.milkProduction.yoy
              }
            }
          }));
        }
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p style={{ color: '#6b7280' }}>데이터 불러오는 중...</p>
    </div>
  );

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', padding: '24px' }}>

      {/* 헤더 */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '500', margin: '0', color: '#111827' }}>
            🥛 낙농 통계 대시보드
          </h1>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0' }}>
            by hy 마케팅팀
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>마지막 갱신: {lastUpdated}</span>
          <span style={{
            background: '#f0fdf4', color: '#059669',
            fontSize: '12px', padding: '4px 10px', borderRadius: '6px'
          }}>● 정상</span>
        </div>
      </div>

      {/* KPI 카드 */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <KpiCard title="원유 생산량" value={data.kpi.milkProduction.value} unit={data.kpi.milkProduction.unit} yoy={data.kpi.milkProduction.yoy} />
        <KpiCard title="원유 기본가격" value={data.kpi.rawMilkPrice.value} unit={data.kpi.rawMilkPrice.unit} yoy={data.kpi.rawMilkPrice.yoy} />
        <KpiCard title="젖소 사육두수" value={data.kpi.cowCount.value} unit={data.kpi.cowCount.unit} yoy={data.kpi.cowCount.yoy} />
        <KpiCard title="시유 소매가" value={data.kpi.retailPrice.value} unit={data.kpi.retailPrice.unit} yoy={data.kpi.retailPrice.yoy} />
      </div>

      {/* 차트 2개 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
        <DairyChart
          title="원유 생산량 추세 (만톤)"
          data={data.productionTrend}
          lines={[{ key: 'value', name: '생산량', color: '#3b82f6' }]}
        />
        <DairyChart
          title="원유가 vs 소매가 추세 (원)"
          data={data.priceTrend}
          lines={[
            { key: 'rawMilk', name: '원유가', color: '#10b981' },
            { key: 'retail', name: '소매가', color: '#ef4444' }
          ]}
        />
      </div>

      {/* 알림 + 수출입 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <AlertPanel alerts={data.alerts} />
        <ImportExportTable data={data.importExport} />
      </div>

    </div>
  );
}

export default App;
