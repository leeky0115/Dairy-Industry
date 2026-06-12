import React, { useState, useCallback } from 'react';
import { useData } from '../data/DataContext';

const CSV_CONFIGS = [
  { key: 'productionMonthly', label: '원유 생산통계', desc: '낙농진흥회 → 원유생산통계.csv', hint: '전체 행 기준 파싱' },
  { key: 'priceMonthly', label: '원유수취가격', desc: '낙농진흥회 → 원유수취가격.csv', hint: '전국 행 기준 파싱' },
  { key: 'livestockQuarterly', label: '가축사육통계', desc: '낙농진흥회 → 가축사육통계.csv', hint: '착유우두수·낙농가수 파싱' },
  { key: 'supplyMonthly', label: '원유수급개황', desc: '낙농진흥회 → 원유수급개황.csv', hint: '국내생산 행 기준 파싱' },
  { key: 'tradeMonthly', label: '품목별수출입', desc: '낙농진흥회 → 품목별수출입(신분류).csv', hint: '총괄·밀크·분유 파싱' }
];

function UploadBox({ config }) {
  const { uploadCSV, state } = useData();
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('');
  const dataLen = (state[config.key] || []).length;

  const handle = useCallback((file) => {
    if (!file || !file.name.endsWith('.csv')) { setStatus('❌ CSV 파일만 가능해요'); return; }
    setStatus('⏳ 파싱 중...');
    uploadCSV(config.key, file);
    setTimeout(() => setStatus(''), 100);
  }, [config.key, uploadCSV]);

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
      <div style={{ marginBottom: '10px' }}>
        <p style={{ fontSize: '13px', fontWeight: '500', color: '#111827', margin: '0 0 2px' }}>{config.label}</p>
        <p style={{ fontSize: '11px', color: '#6b7280', margin: '0' }}>{config.desc}</p>
      </div>
      <div
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handle(e.dataTransfer.files[0]); }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => document.getElementById(`fi-${config.key}`).click()}
        style={{
          border: `2px dashed ${isDragging ? '#3b82f6' : '#d1d5db'}`,
          borderRadius: '8px', padding: '14px', textAlign: 'center',
          cursor: 'pointer', background: isDragging ? '#eff6ff' : '#f9fafb',
          transition: 'all 0.2s'
        }}
      >
        <p style={{ fontSize: '20px', margin: '0 0 4px' }}>📂</p>
        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>드래그 또는 클릭</p>
        {dataLen > 0 && <p style={{ fontSize: '11px', color: '#059669', margin: '6px 0 0', fontWeight: '500' }}>✅ {dataLen}건 로드됨</p>}
        {status && <p style={{ fontSize: '11px', color: '#6b7280', margin: '4px 0 0' }}>{status}</p>}
      </div>
      <input id={`fi-${config.key}`} type="file" accept=".csv" style={{ display: 'none' }} onChange={e => handle(e.target.files[0])} />
    </div>
  );
}

function CsvUploader() {
  const { state } = useData();
  const log = state.uploadLog || [];
  return (
    <div>
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px' }}>
        <p style={{ fontSize: '13px', fontWeight: '500', color: '#1d4ed8', margin: '0 0 4px' }}>📌 CSV 업로드 안내</p>
        <p style={{ fontSize: '12px', color: '#3b82f6', margin: '0', lineHeight: '1.6' }}>
          낙농진흥회 통계광장(idfa.or.kr)에서 CSV를 다운로드 후 해당 항목에 드래그앤드롭하세요.
          업로드 즉시 모든 탭의 차트와 의사결정 알림이 자동으로 업데이트됩니다.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        {CSV_CONFIGS.map(c => <UploadBox key={c.key} config={c} />)}
      </div>
      {log.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
          <p style={{ fontSize: '13px', fontWeight: '500', color: '#111827', margin: '0 0 12px' }}>업로드 기록</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead><tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: '6px 0', color: '#6b7280', fontWeight: '500' }}>항목</th>
              <th style={{ textAlign: 'left', padding: '6px 0', color: '#6b7280', fontWeight: '500' }}>파일명</th>
              <th style={{ textAlign: 'right', padding: '6px 0', color: '#6b7280', fontWeight: '500' }}>건수</th>
              <th style={{ textAlign: 'right', padding: '6px 0', color: '#6b7280', fontWeight: '500' }}>시간</th>
            </tr></thead>
            <tbody>
              {log.map((l, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '7px 0', color: '#111827' }}>{l.key}</td>
                  <td style={{ padding: '7px 0', color: '#111827' }}>{l.fileName}</td>
                  <td style={{ textAlign: 'right', padding: '7px 0', color: '#059669' }}>{l.count}건</td>
                  <td style={{ textAlign: 'right', padding: '7px 0', color: '#6b7280' }}>{l.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CsvUploader;
