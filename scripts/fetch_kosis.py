import requests
import json
import os
from datetime import datetime

API_KEY = os.environ.get('KOSIS_API_KEY')
BASE_URL = 'https://kosis.kr/openapi/Param/statisticsParameterData.do'

def fetch(tbl_id, itm_id='T10+'):
    params = {
        'method': 'getList',
        'apiKey': API_KEY,
        'itmId': itm_id,
        'objL1': 'ALL',
        'objL2': '',
        'format': 'json',
        'jsonVD': 'Y',
        'prdSe': 'M',
        'startPrdDe': '202401',
        'endPrdDe': datetime.now().strftime('%Y%m'),
        'orgId': '101',
        'tblId': tbl_id
    }
    try:
        res = requests.get(BASE_URL, params=params, timeout=10)
        return res.json()
    except Exception as e:
        print(f'오류: {e}')
        return []

def parse_monthly(raw, value_key):
    result = []
    if not raw or not isinstance(raw, list):
        return result
    for item in raw:
        try:
            period = item.get('PRD_DE', '')
            if len(period) == 6:
                year = period[:4]
                month = str(int(period[4:6]))
                label = f"{year}-{period[4:6]}"
                value = float(item.get('DT', 0))
                result.append({
                    'year': year,
                    'month': month,
                    'label': label,
                    value_key: value
                })
        except:
            continue
    return sorted(result, key=lambda x: x['label'])

def main():
    print('KOSIS API 호출 시작...')

    cow_raw = fetch('DT_1EO019')
    milk_raw = fetch('DT_1EO020')

    cow_data = parse_monthly(cow_raw, 'cowCount')
    milk_data = parse_monthly(milk_raw, 'rawMilkTon')

    merged_production = []
    for m in milk_data:
        merged_production.append({
            'year': m['year'],
            'month': m['month'],
            'label': m['label'],
            'rawMilkTon': round(m.get('rawMilkTon', 0)),
        })

    merged_livestock = []
    for c in cow_data:
        merged_livestock.append({
            'year': c['year'],
            'month': c['month'],
            'label': c['label'],
            'cowCount': round(c.get('cowCount', 0) / 10000, 1),
        })

    output_path = os.path.join(
        os.path.dirname(__file__),
        '../src/data/dairyData.json'
    )

    try:
        with open(output_path, 'r', encoding='utf-8') as f:
            existing = json.load(f)
    except:
        existing = {}

    existing['productionMonthly'] = merged_production
    existing['livestockMonthly'] = merged_livestock
    existing['lastUpdated'] = datetime.now().strftime('%Y.%m')

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)

    print(f'완료! 생산 {len(merged_production)}개, 가축 {len(merged_livestock)}개 저장됨')

if __name__ == '__main__':
    main()
