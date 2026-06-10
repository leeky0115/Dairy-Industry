import React, { useState, useEffect } from 'react';
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

function App() {
  const [data] = useState(dairyData);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('전체');

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':     return <OverviewTab data={data} />;
      case 'production':   return <ProductionTab data={data} year={selectedYear} month={selectedMonth} />;
      case 'price':        return <PriceTab data={data} />;
      case 'supply':       return <SupplyTab data={data} />;
      case 'distribution': return <DistributionTab data={data} />;
      case 'trade':        return <TradeTab data={data} />;
      case 'livestock':    return <LivestockTab data={data} />;
      default:             return <OverviewTab data={data} />;
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
          <span style={{ fontSize: '12px', color: '#6b7280' }}>마지막 갱신: 2026.06</span>
          <span style={{ background: '#f0fdf4', color: '#059669', fontSize: '12px', padding: '4px 10px', borderRadius: '6px' }}>● 정상</span>
        </div>
      </div>
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      <DateFilter selectedYear={selectedYear} selectedMonth={selectedMonth} onYearChange={setSelectedYear} onMonthChange={setSelectedMonth} />
      {renderTab()}
    </div>
  );
}

export default App;
