import React, { useState } from 'react';
import TabNav from './components/TabNav';
import DateFilter from './components/DateFilter';
import OverviewTab from './components/tabs/OverviewTab';
import ProductionTab from './components/tabs/ProductionTab';
import PriceTab from './components/tabs/PriceTab';
import SupplyTab from './components/tabs/SupplyTab';
import DistributionTab from './components/tabs/DistributionTab';
import TradeTab from './components/tabs/TradeTab';
import LivestockTab from './components/tabs/LivestockTab';
import dairyData from './data/dairyData.json';

function filterData(data, year, month) {
  if (!data) return [];
  return data.filter(d => {
    const yearMatch = d.year === year;
    const monthMatch = month === '전체' || d.month === String(parseInt(month));
    return yearMatch && monthMatch;
  });
}

function getLatestKpi(data, key) {
  if (!data || data.length === 0) return null;
  return data[data.length - 1][key];
}

function calcYoy(data, key) {
  if (!data || data.length < 13) return null;
  const latest = data[data.length - 1][key];
  const prev = data[data.length - 13][key];
  if (!prev) return null;
  return parseFloat(((latest - prev) / prev * 100).toFixed(1));
}

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('전체');

  const production = dairyData.productionMonthly || [];
  const price = dairyData.priceMonthly || [];
  const livestock = dairyData.livestockMonthly || [];

  const kpi = {
    milkProduction: {
      value: getLatestKpi(production, 'rawMilkTon') || 189,
      unit: '톤',
      yoy: calcYoy(production, 'rawMilkTon') || -1.6
    },
    rawMilkPrice: {
      value: getLatestKpi(price, 'rawMilk') || 1121,
      unit: '원/kg',
      yoy: calcYoy(price, 'rawMilk') || 1.8
    },
    cowCount: {
      value: getLatestKpi(livestock, 'cowCount') || 38.7,
      unit: '만두',
      yoy: calcYoy(livestock, 'cowCount') || -1.3
    },
    retailPrice: {
      value: getLatestKpi(price, 'retail') || 3178,
      unit: '원/1L',
      yoy: calcYoy(price, 'retail') || 3.2
    }
  };

  const alerts = [
    { level: 'danger', message: '원유 생산량 지속 감소 추세 → 원가 상승 리스크' },
    { level: 'warning', message: '소매-원유 가격 갭 확대, 마진 구조 변화 추적 필요' },
    { level: 'success', message: '수출입 균형 안정권, 전년 동기 대비 유사 수준' }
  ];

  const importExport = dairyData.tradeMonthly
    ? [
        { item: '치즈', import: getLatestKpi(dairyData.tradeMonthly, 'cheeseImport') || 1.3, export: 0.3, yoy: 4.1 },
        { item: '버터', import: getLatestKpi(dairyData.tradeMonthly, 'butterImport') || 0.2, export: 0.1, yoy: -1.2 },
        { item: '분유', import: getLatestKpi(dairyData.tradeMonthly, 'powderImport') || 0.53, export: 0.1, yoy: 2.8 }
      ]
    : [];

  const filteredProduction = filterData(production, selectedYear, selectedMonth);
  const filteredPrice = filterData(price, selectedYear, selectedMonth);
  const filteredLivestock = filterData(livestock, selectedYear, selectedMonth);

  const tabData = {
    kpi,
    alerts,
    importExport,
    productionTrend: filteredProduction.length > 0 ? filteredProduction : production,
    priceTrend: filteredPrice.length > 0 ? filteredPrice : price,
    livestockTrend: filteredLivestock.length > 0 ? filteredLivestock : livestock,
    lastUpdated: dairyData.lastUpdated || '2026.06'
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':     return <OverviewTab data={tabData} />;
      case 'production':   return <ProductionTab data={tabData} />;
      case 'price':        return <PriceTab data={tabData} />;
      case 'supply':       return <SupplyTab data={tabData} />;
      case 'distribution': return <DistributionTab data={tabData} />;
      case 'trade':        return <TradeTab data={tabData} />;
      case 'livestock':    return <LivestockTab data={tabData} />;
      default:             return <OverviewTab data={tabData} />;
    }
  };

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '500', margin: '0', color: '#111827' }}>🥛 낙농 통계 대시보드</h1>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0' }}>by hy 마케팅팀</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>마지막 갱신: {tabData.lastUpdated}</span>
          <span style={{ background: '#f0fdf4', color: '#059669', fontSize: '12px', padding: '4px 10px', borderRadius: '6px' }}>● 정상</span>
        </div>
      </div>
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      <DateFilter
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
      />
      {renderTab()}
    </div>
  );
}

export default App;
