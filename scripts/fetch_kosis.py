import requests
import json
import os
import base64
from datetime import datetime

KOSIS_KEY = os.environ.get('KOSIS_API_KEY')
KAMIS_KEY = os.environ.get('KAMIS_API_KEY')
KAMIS_ID = os.environ.get('KAMIS_ID')
GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN')
GITHUB_REPO = os.environ.get('GITHUB_REPO')

KOSIS_URL = 'https://kosis.kr/openapi/Param/statisticsParameterData.do'
KAMIS_URL = 'https://www.kamis.or.kr/service/price/xml.do'

def fetch_kosis(tbl_id):
    params = {
        'method': 'getList',
        'apiKey': KOSIS_KEY,
        'itmId': 'T10+',
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
        res = requests.get(KOSIS_URL, params=params, timeout=10)
        return res.json()
    except Exception as e:
        print(f'KOSIS 오류 ({tbl_id}): {e}')
        return []

def fetch_kamis(item_code, item_name):
    today = datetime.now().strftime('%Y-%m-%d')
    params = {
        'action': 'periodProductList',
        'p_cert_key': KAMIS_KEY,
        'p_cert_id': KAMIS_ID,
        'p_returntype': 'json',
        'p_startday': '2024-01-01',
        'p_endday': today,
        'p_itemcategorycode': '200',
        'p_itemcode': item_code,
        'p_kindcode': '00',
        'p_productrankcode': '04',
        'p_countrycode': '1101',
        'p_convert_kg_yn': 'N'
    }
    try:
        res = requests.get(KAMIS_URL, params=params, timeout=10)
        data = res.json()
        items = data.get('data', {}).get('item', [])
        result = []
        for item in items:
            try:
                price = item.get('price', '0').replace(',', '')
                if price and price != '-':
                    year = item.get('yyyy')
                    month = str(int(item.get('regday', '00/00')[:2]))
                    result.append({
                        'year': year,
                        'month': month,
                        'label': f"{year}-{item.get('regday', '')[:2].zfill(2)}",
                        'retail': int(price)
                    })
            except:
                continue
        return result
    except Exception as e:
        print(f'KAMIS 오류 ({item_name}): {e}')
        return []

def parse_kosis_monthly(raw, value_key):
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

def update_github_file(content_dict):
    if not GITHUB_TOKEN or not GITHUB_REPO:
        print('GitHub 환경변수 없음 — 로컬 파일로 저장')
        output_path = os.path.join(os.path.dirname(__file__), '../src/data/dairyData.json')
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(content_dict, f, ensure_ascii=False, indent=2)
        return

    api_url = f'https://api.github.com/repos/{GITHUB_REPO}/contents/src/data/dairyData.json'
    headers = {
        'Authorization': f'token {GITHUB_TOKEN}',
        'Accept': 'application/vnd.github.v3+json'
    }

    get_res = requests.get(api_url, headers=headers)
    sha = get_res.json().get('sha') if get_res.status_code == 200 else None

    content_bytes = json.dumps(content_dict, ensure_ascii=False, indent=2).encode('utf-8')
    content_b64 = base64.b64encode(content_bytes).decode('utf-8')

    payload = {
        'message': f"자동 갱신: {datetime.now().strftime('%Y년 %m월')} 낙농 통계 업데이트",
        'content': content_b64,
        'branch': 'main'
    }
    if sha:
        payload['sha'] = sha

    put_res = requests.put(api_url, headers=headers, json=payload)
    if put_res.status_code in [200, 201]:
        print('GitHub API로 파일 업데이트 성공!')
    else:
        print(f'GitHub API 오류: {put_res.status_code} {put_res.text}')

def main():
    print('KOSIS + KAMIS API 호출 시작...')

    cow_raw = fetch_kosis('DT_1EO019')
    milk_raw = fetch_kosis('DT_1EO020')
    retail_data = fetch_kamis('2011', '우유')

    cow_data = parse_kosis_monthly(cow_raw, 'cowCount')
    milk_data = parse_kosis_monthly(milk_raw, 'rawMilkTon')

    production_monthly = [
        {'year': m['year'], 'month': m['month'], 'label': m['label'], 'rawMilkTon': round(m.get('rawMilkTon', 0))}
        for m in milk_data
    ]
    livestock_monthly = [
        {'year': c['year'], 'month': c['month'], 'label': c['label'], 'cowCount': round(c.get('cowCount', 0) / 10000, 1)}
        for c in cow_data
    ]
    price_monthly = [
        {'year': r['year'], 'month': r['month'], 'label': r['label'], 'retail': r['retail'], 'rawMilk': 1121}
        for r in retail_data
    ]

    output_path = os.path.join(os.path.dirname(__file__), '../src/data/dairyData.json')
    try:
        with open(output_path, 'r', encoding='utf-8') as f:
            existing = json.load(f)
    except:
        existing = {}

    existing['productionMonthly'] = production_monthly
    existing['livestockMonthly'] = livestock_monthly
    existing['priceMonthly'] = price_monthly
    existing['lastUpdated'] = datetime.now().strftime('%Y.%m')

    update_github_file(existing)
    print(f'완료! 생산 {len(production_monthly)}개, 가축 {len(livestock_monthly)}개, 가격 {len(price_monthly)}개')

if __name__ == '__main__':
    main()
