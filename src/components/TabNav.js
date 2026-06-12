import React from 'react';

const tabs = [
  { id: 'overview', label: '전체 개요' },
  { id: 'production', label: '생산' },
  { id: 'price', label: '가격' },
  { id: 'supply', label: '수급' },
  { id: 'trade', label: '수출입' },
  { id: 'livestock', label: '가축' },
  { id: 'upload', label: '📂 데이터 업로드' }
];

function TabNav({ activeTab, onTabChange }) {
  return (
    <div style={{ display: 'flex', gap: '2px', marginBottom: '20px', borderBottom: '1px solid #e5e7eb', flexWrap: 'wrap' }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onTabChange(tab.id)} style={{
          padding: '10px 16px', fontSize: '13px',
          fontWeight: activeTab === tab.id ? '500' : '400',
          color: activeTab === tab.id ? '#111827' : '#6b7280',
          background: 'none', border: 'none',
          borderBottom: activeTab === tab.id ? '2px solid #111827' : '2px solid transparent',
          cursor: 'pointer', marginBottom: '-1px', transition: 'all 0.15s'
        }}>{tab.label}</button>
      ))}
    </div>
  );
}

export default TabNav;
