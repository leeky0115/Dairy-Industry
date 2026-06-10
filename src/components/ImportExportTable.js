import React from 'react';

function ImportExportTable({ data }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px'
    }}>
      <p style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 14px', color: '#111827' }}>수출입 동향 (만톤)</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
            <th style={{ textAlign: 'left', padding: '6px 0', color: '#6b7280', fontWeight: '500' }}>품목</th>
            <th style={{ textAlign: 'right', padding: '6px 0', color: '#6b7280', fontWeight: '500' }}>수입</th>
            <th style={{ textAlign: 'right', padding: '6px 0', color: '#6b7280', fontWeight: '500' }}>수출</th>
            <th style={{ textAlign: 'right', padding: '6px 0', color: '#6b7280', fontWeight: '500' }}>YoY</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '8px 0', color: '#111827' }}>{row.item}</td>
              <td style={{ textAlign: 'right', padding: '8px 0', color: '#111827' }}>{row.import}</td>
              <td style={{ textAlign: 'right', padding: '8px 0', color: '#111827' }}>{row.export}</td>
              <td style={{ textAlign: 'right', padding: '8px 0', color: row.yoy > 0 ? '#dc2626' : '#059669' }}>
                {row.yoy > 0 ? '▲' : '▼'}{Math.abs(row.yoy)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ImportExportTable;
