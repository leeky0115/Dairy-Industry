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
        data = res.json()
        print(f'KOSIS ({tbl_id}) 응답 타입: {type(data)}')
        print(f'KOSIS ({tbl_id}) 응답 미리보기: {str(data)[:300]}')
        return data
    except Exception as e:
        print(f'KOSIS 오류 ({tbl_id}): {e}')
        return []

def fetch_kamis():
    today = datetime.now().strftime('%Y-%m-%d')
    params = {
        'action': 'periodProductList',
        'p_cert_key': KAMIS_KEY,
        'p_cert_id': KAMIS_ID,
        'p_returntype': 'json',
        'p_startday': '2024-01-01',
        'p_endday': today,
        'p_itemcategorycode': '200',
        'p_itemcode': '2011',
        'p_kindcode': '00',
        'p_productrankcode': '04',
        'p_countrycode': '1101',
        'p_convert_kg_yn': 'N'
    }
    try:
        res = requests.get(KAMIS_URL, params=params, timeout=10)
        data = res.json()
        print(f'KAMIS 응답 타입: {type(data)}')
        print(f'KAMIS 응답 미리보기: {str(data)[:500]}')
        return data
    except Exception as e:
        print(f'KAMIS 오류: {e}')
        return {}

def parse_kosis_monthly(raw, value_key):
    result = []
    if not raw:
        print(f'{value_key}: 데이터 없음')
        return result
    if isinstance(raw, dict):
        print(f'{value_key}: dict 응답 → {list(raw.keys())}')
        if 'err' in raw:
            print(f'{value_key}: 오류 응답 → {raw}')
        return result
    if not isinstance(raw, list):
        print(f'{value_key}: 예상치 못한 타입 → {type(raw)}')
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
        except Exception as e:
            print(f'파싱 오류: {e}, item: {item}')
            continue
    return sorted(result, key=lambda x: x['label'])

def parse_kamis(data):
    result = []
    try:
        items = data.get('data', {})
        print(f'KAMIS data 타입: {type(items)}, 내용: {str(items)[:200]}')
        if isinstance(items, dict):
            items = items.get('item', [])
        if isinstance(items, list):
            for item in items:
                try:
                    if not isinstance(item, dict):
                        continue
                    price = item.get('price', '0').replace(',', '')
                    if price and price != '-':
                        year = item.get('yyyy', '')
                        regday = item.get('regday', '00/00')
                        month = str(int(regday[:2]))
                        label = f"{year}-{regday[:2].zfill(2)}"
                        result.append({
                            'year': year,
                            'month': month,
                            'label': label,
                            'retail': int(price),
                            'rawMilk': 1121
                        })
                except Exception as e:
                    print(f'KAMIS 아이템 파싱 오류: {e}')
                    continue
    except Exception as e:
        print(f'KAMIS 파싱 오류: {e}')
    return result

def update_github_file(content_dict):
    if not GITHUB_TOKEN or not GITHUB_REPO:
        output_path = os.path.join(os.path.dirname(__file__), '../src/data/dairyData.json')
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(content_dict, f, ensure_ascii=False, indent=2)
        print('로컬 파일 저장 완료')
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
    kamis_raw = fetch_kamis()

    cow_data = parse_kosis_monthly(cow_raw, 'cowCount')
    milk_data = parse_kosis_monthly(milk_raw, 'rawMilkTon')
    price_data = parse_kamis(kamis_raw)

    production_monthly = [
        {'year': m['year'], 'month': m['month'], 'label': m['label'], 'rawMilkTon': round(m.get('rawMilkTon', 0))}
        for m in milk_data
    ]
    livestock_monthly = [
        {'year': c['year'], 'month': c['month'], 'label': c['label'], 'cowCount': round(c.get('cowCount', 0) / 10000, 1)}
        for c in cow_data
    ]

    output_path = os.path.join(os.path.dirname(__file__), '../src/data/dairyData.json')
    try:
        with open(output_path, 'r', encoding='utf-8') as f:
            existing = json.load(f)
    except:
        existing = {}

    existing['productionMonthly'] = production_monthly
    existing['livestockMonthly'] = livestock_monthly
    existing['priceMonthly'] = price_data
    existing['lastUpdated'] = datetime.now().strftime('%Y.%m')

    update_github_file(existing)
    print(f'완료! 생산 {len(production_monthly)}개, 가축 {len(livestock_monthly)}개, 가격 {len(price_data)}개')

if __name__ == '__main__':
    main()
