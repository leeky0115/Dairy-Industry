import React, { useState } from 'react';
import { useData } from './data/DataContext';
import { filterMonthly, filterQuarterly } from './utils/filter';
import TabNav from './components/TabNav';
import DateFilter from './components/DateFilter';
import OverviewTab from './components/tabs/OverviewTab';
import ProductionTab from './components/tabs/ProductionTab';
import PriceTab from './components/tabs/PriceTab';
import SupplyTab from './components/tabs/SupplyTab';
import TradeTab from './components/tabs/TradeTab';
import LivestockTab from './components/tabs/LivestockTab';
import CsvUploader from './components/CsvUploader';

const QUARTER_TABS = ['livestock'];

function App() {
  const { state } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedYear, setSelectedYear] = useState('전체');
  const [selectedMonth, setSelectedMonth] = useState('전체');
  const [selectedQuarter, setSelectedQuarter] = useState('전체');

  const isQuarterTab = QUARTER_TABS.includes(activeTab);

  const prodTrend = filterMonthly(state.productionMonthly, selectedYear, selectedMonth);
  const priceTrend = filterMonthly(state.priceMonthly, selectedYear, selectedMonth);
  const supplyTrend = filterMonthly(state.supplyMonthly, selectedYear, selectedMonth);
  const tradeTrend = filterMonthly(state.tradeMonthly, selectedYear, selectedMonth);
  const livestockTrend = filterQuarterly(state.livestockQuarterly, selectedYear, selectedQuarter);

  const tabProps = {
    kpi: state.kpi,
    alerts: state.alerts,
    productionTrend: prodTrend,
    priceTrend: priceTrend,
    supplyTrend: supplyTrend,
    tradeTrend: tradeTrend,
    livestockTrend: livestockTrend
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':   return <OverviewTab {...tabProps} />;
      case 'production': return <ProductionTab {...tabProps} />;
      case 'price':      return <PriceTab {...tabProps} />;
      case 'supply':     return <SupplyTab {...tabProps} />;
      case 'trade':      return <TradeTab {...tabProps} />;
      case 'livestock':  return <LivestockTab {...tabProps} />;
      case 'upload':     return <CsvUploader />;
      default:           return <OverviewTab {...tabProps} />;
    }
  };

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '500', margin: '0', color: '#111827' }}>🥛 낙농 통계 대시보드</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>마지막 갱신: {state.lastUpdated || '-'}</span>
          <span style={{ background: state.alerts?.length > 0 ? '#f0fdf4' : '#f9fafb', color: '#059669', fontSize: '12px', padding: '4px 10px', borderRadius: '6px' }}>● {state.alerts?.length > 0 ? '데이터 로드됨' : '데이터 없음'}</span>
        </div>
      </div>
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab !== 'upload' && (
        <DateFilter
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedQuarter={selectedQuarter}
          onYearChange={setSelectedYear}
          onMonthChange={setSelectedMonth}
          onQuarterChange={setSelectedQuarter}
          showQuarter={isQuarterTab}
        />
      )}
      {renderTab()}
    </div>
  );
}

export default App;
