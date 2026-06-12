import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function DairyChart({ title, data, lines }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
        <p style={{ fontSize: '13px', fontWeight: '500', margin: '0 0 12px', color: '#111827' }}>{title}</p>
        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: '13px', color: '#9ca3af' }}>📂 데이터 업로드 탭에서 CSV를 업로드해주세요</p>
        </div>
      </div>
    );
  }
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
      <p style={{ fontSize: '13px', fontWeight: '500', margin: '0 0 16px', color: '#111827' }}>{title}</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} width={70} tickFormatter={v => v.toLocaleString()} />
          <Tooltip formatter={(v) => v.toLocaleString()} />
          <Legend />
          {lines.map(l => (
            <Line key={l.key} type="monotone" dataKey={l.key} name={l.name} stroke={l.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DairyChart;
