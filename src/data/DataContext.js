import React, { createContext, useContext, useState, useCallback } from 'react';

const DataContext = createContext();

function parseMonth(col) {
  const m = col.trim().match(/(\d{4})년\s*(\d{1,2})월/);
  if (m) {
    const month = m[2].padStart(2, '0');
    return { year: m[1], month: String(parseInt(m[2])), label: `${m[1]}-${month}` };
  }
  return null;
}

function parseQuarter(col) {
  const m = col.trim().match(/(\d{4})년\s*(\d)분기/);
  if (m) return { year: m[1], quarter: `${m[2]}분기`, label: `${m[1]}-Q${m[2]}` };
  return null;
}

function parseNum(val) {
  if (!val) return null;
  const n = parseFloat(val.replace(/,/g, '').trim());
  return isNaN(n) ? null : n;
}

function parseCSVText(text) {
  const lines = text.replace(/\r/g, '').split('\n').filter(l => l.trim());
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i] || ''; });
    return obj;
  }).filter(row => Object.values(row).some(v => v.trim()));
}

function transformProduction(rows) {
  const result = [];
  const headers = Object.keys(rows[0] || {});
  for (const row of rows) {
    if ((row['구분'] || '').trim() !== '전체') continue;
    for (const col of headers) {
      if (col === '구분') continue;
      const period = parseMonth(col);
      if (!period) continue;
      const val = parseNum(row[col]);
      if (val !== null) result.push({ ...period, rawMilkTon: val });
    }
    break;
  }
  return result.sort((a, b) => a.label.localeCompare(b.label));
}

function transformPrice(rows) {
  const result = [];
  const headers = Object.keys(rows[0] || {});
  for (const row of rows) {
    if ((row['구분'] || '').trim() !== '전국') continue;
    for (const col of headers) {
      if (col === '구분') continue;
      const period = parseMonth(col);
      if (!period) continue;
      const val = parseNum(row[col]);
      if (val !== null && val > 100) result.push({ ...period, rawMilk: val });
    }
    break;
  }
  return result.sort((a, b) => a.label.localeCompare(b.label));
}

function transformLivestock(rows) {
  const map = {};
  const headers = Object.keys(rows[0] || {});
  const targets = ['착유우두수', '낙농가수', '호당사육두수', '호당생산량'];
  for (const row of rows) {
    const key = (row['구분'] || '').trim();
    if (!targets.includes(key)) continue;
    for (const col of headers) {
      if (col === '구분') continue;
      const period = parseQuarter(col);
      if (!period) continue;
      const val = parseNum(row[col]);
      if (val !== null) {
        if (!map[period.label]) map[period.label] = { ...period };
        map[period.label][key] = val;
      }
    }
  }
  return Object.values(map).sort((a, b) => a.label.localeCompare(b.label));
}

function transformSupply(rows) {
  const result = [];
  const headers = Object.keys(rows[0] || {});
  for (const row of rows) {
    const col0 = (row['구분'] || '').trim();
    const col1 = (row[''] || row[Object.keys(row)[1]] || '').trim();
    if (col0 === '생산' && col1 === '국내생산') {
      for (const col of headers) {
        if (col === '구분' || col === '') continue;
        const period = parseMonth(col);
        if (!period) continue;
        const val = parseNum(row[col]);
        if (val !== null) result.push({ ...period, domesticProduction: val });
      }
      break;
    }
  }
  return result.sort((a, b) => a.label.localeCompare(b.label));
}

function transformTrade(rows) {
  const map = {};
  const headers = Object.keys(rows[0] || {});
  const tmap = { '총괄': 'total', '밀크와 크림': 'milkCream', '탈지분유': 'skimMilk', '전지분유': 'wholeMilk' };
  for (const row of rows) {
    const key = (row['구분'] || '').trim();
    const field = tmap[key];
    if (!field) continue;
    for (const col of headers) {
      if (col === '구분') continue;
      const period = parseMonth(col);
      if (!period) continue;
      const val = parseNum(row[col]);
      if (val !== null) {
        if (!map[period.label]) map[period.label] = { ...period };
        map[period.label][field] = val;
      }
    }
  }
  return Object.values(map).sort((a, b) => a.label.localeCompare(b.label));
}

function transformData(key, rows) {
  switch (key) {
    case 'productionMonthly': return transformProduction(rows);
    case 'priceMonthly': return transformPrice(rows);
    case 'livestockQuarterly': return transformLivestock(rows);
    case 'supplyMonthly': return transformSupply(rows);
    case 'tradeMonthly': return transformTrade(rows);
    default: return rows;
  }
}

function generateAlerts(state) {
  const alerts = [];
  const prod = state.productionMonthly || [];
  const price = state.priceMonthly || [];
  const livestock = state.livestockQuarterly || [];
  const supply = state.supplyMonthly || [];

  const safeYoy = (data, key, period) => {
    if (data.length <= period) return null;
    const l = data[data.length - 1][key];
    const p = data[data.length - 1 - period][key];
    return (l && p) ? parseFloat(((l - p) / p * 100).toFixed(1)) : null;
  };

  if (prod.length >= 3) {
    const r = prod.slice(-3).map(p => p.rawMilkTon);
    const yoy = safeYoy(prod, 'rawMilkTon', 12);
    const yoyStr = yoy !== null ? ` (YoY ${yoy}%)` : '';
    if (r[2] < r[1] && r[1] < r[0])
      alerts.push({ level: 'danger', message: `원유 생산량 3개월 연속 감소 (${r[0].toLocaleString()}→${r[2].toLocaleString()}톤)${yoyStr}` });
    else if (r[2] > r[1] && r[1] > r[0])
      alerts.push({ level: 'success', message: `원유 생산량 3개월 연속 증가 (${r[0].toLocaleString()}→${r[2].toLocaleString()}톤)${yoyStr}` });
    else
      alerts.push({ level: 'warning', message: `원유 생산량 등락 반복 중 (최근: ${r[2].toLocaleString()}톤${yoyStr})` });
  }

  if (price.length >= 13) {
    const lp = price[price.length - 1].rawMilk;
    const pp = price[price.length - 13].rawMilk;
    const yoy = parseFloat(((lp - pp) / pp * 100).toFixed(1));
    if (yoy > 3) alerts.push({ level: 'danger', message: `원유수취가격 전년比 +${yoy}% 상승 (${pp.toFixed(0)}→${lp.toFixed(0)}원/kg)` });
    else if (yoy > 0) alerts.push({ level: 'warning', message: `원유수취가격 소폭 상승 YoY +${yoy}% (현재 ${lp.toFixed(0)}원/kg)` });
    else alerts.push({ level: 'success', message: `원유수취가격 안정 YoY ${yoy}% (현재 ${lp.toFixed(0)}원/kg)` });
  }

  if (livestock.length >= 2) {
    const lc = livestock[livestock.length - 1]['착유우두수'] || 0;
    const pc = livestock[livestock.length - 2]['착유우두수'] || 0;
    if (lc && pc) {
      const chg = parseFloat(((lc - pc) / pc * 100).toFixed(1));
      if (chg < -1) alerts.push({ level: 'danger', message: `착유우 두수 감소 중 (${lc.toLocaleString()}두, 전분기比 ${chg}%) → 장기 공급 감소 우려` });
      else if (chg > 1) alerts.push({ level: 'success', message: `착유우 두수 증가 (${lc.toLocaleString()}두, 전분기比 +${chg}%)` });
      else alerts.push({ level: 'warning', message: `착유우 두수 보합세 (${lc.toLocaleString()}두, 전분기比 ${chg}%)` });
    }
  }

  if (supply.length >= 13) {
    const ls = supply[supply.length - 1].domesticProduction;
    const ps = supply[supply.length - 13].domesticProduction;
    if (ls && ps) {
      const yoy = parseFloat(((ls - ps) / ps * 100).toFixed(1));
      if (yoy < -2) alerts.push({ level: 'warning', message: `국내 원유 생산 전년比 ${yoy}% 감소 (${ls.toLocaleString()}톤) → 수급 불안 가능성` });
      else if (yoy > 2) alerts.push({ level: 'success', message: `국내 원유 생산 전년比 +${yoy}% 증가 (${ls.toLocaleString()}톤)` });
    }
  }

  return alerts;
}

function calcKpi(state) {
  const prod = state.productionMonthly || [];
  const price = state.priceMonthly || [];
  const lv = state.livestockQuarterly || [];

  const safeYoy = (data, key, period) => {
    if (data.length <= period) return 0;
    const l = data[data.length - 1][key];
    const p = data[data.length - 1 - period][key];
    return (l && p) ? parseFloat(((l - p) / p * 100).toFixed(1)) : 0;
  };

  return {
    milkProduction: {
      value: prod.length ? prod[prod.length - 1].rawMilkTon.toLocaleString() : '-',
      unit: '톤', yoy: safeYoy(prod, 'rawMilkTon', 12),
      sub: prod.length ? `기준: ${prod[prod.length - 1].label}` : ''
    },
    rawMilkPrice: {
      value: price.length ? price[price.length - 1].rawMilk.toFixed(0) : '-',
      unit: '원/kg', yoy: safeYoy(price, 'rawMilk', 12),
      sub: price.length ? `기준: ${price[price.length - 1].label}` : ''
    },
    cowCount: {
      value: lv.length ? (lv[lv.length - 1]['착유우두수'] || 0).toLocaleString() : '-',
      unit: '두(착유우)', yoy: safeYoy(lv, '착유우두수', 4),
      sub: lv.length ? `기준: ${lv[lv.length - 1].label}` : ''
    },
    farmCount: {
      value: lv.length ? (lv[lv.length - 1]['낙농가수'] || 0).toLocaleString() : '-',
      unit: '호', yoy: safeYoy(lv, '낙농가수', 4),
      sub: lv.length ? `기준: ${lv[lv.length - 1].label}` : ''
    }
  };
}

const initialState = {
  productionMonthly: [], priceMonthly: [],
  livestockQuarterly: [], supplyMonthly: [], tradeMonthly: [],
  alerts: [], uploadLog: [],
  kpi: {
    milkProduction: { value: '-', unit: '톤', yoy: 0, sub: '' },
    rawMilkPrice: { value: '-', unit: '원/kg', yoy: 0, sub: '' },
    cowCount: { value: '-', unit: '두(착유우)', yoy: 0, sub: '' },
    farmCount: { value: '-', unit: '호', yoy: 0, sub: '' }
  }
};

export function DataProvider({ children }) {
  const [state, setState] = useState(initialState);

  const uploadCSV = useCallback((key, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const rows = parseCSVText(e.target.result);
        const transformed = transformData(key, rows);
        console.log(`[${key}] 파싱 결과: ${transformed.length}건`, transformed.slice(0, 2));
        setState(prev => {
          const next = { ...prev, [key]: transformed };
          next.alerts = generateAlerts(next);
          next.kpi = calcKpi(next);
          next.uploadLog = [...(prev.uploadLog || []), {
            key, fileName: file.name,
            count: transformed.length,
            time: new Date().toLocaleString('ko-KR')
          }];
          return next;
        });
      } catch (err) {
        console.error(`[${key}] CSV 파싱 오류:`, err);
      }
    };
    reader.readAsText(file, 'utf-8');
  }, []);

  return (
    <DataContext.Provider value={{ state, uploadCSV }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
