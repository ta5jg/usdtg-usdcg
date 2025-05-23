import requests
import time
import json

TOKEN_ADDRESS = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'  # USDT
PAGE_SIZE = 50  # max 50
MAX_PAGES = 200  # 50 x 200 = 10.000 adres
OUTPUT_FILE = 'tron_addresses.txt'

def get_holders(page):
    url = f'https://apilist.tronscanapi.com/api/token_trc20/holders'
    params = {
        'contract_address': TOKEN_ADDRESS,
        'start': page * PAGE_SIZE,
        'limit': PAGE_SIZE,
        'sortType': 'desc'
    }

    headers = {
        'User-Agent': 'Mozilla/5.0'
    }

    try:
        res = requests.get(url, params=params, headers=headers)
        res.raise_for_status()
        data = res.json()
        return [item['holder_address'] for item in data.get('data', [])]
    except Exception as e:
        print(f'❌ Error on page {page}: {e}')
        return []

def main():
    all_addresses = set()

    for page in range(MAX_PAGES):
        print(f'🚀 Getting page {page + 1}...')
        addresses = get_holders(page)
        if not addresses:
            print('⚠️ No more data or error occurred.')
            break
        all_addresses.update(addresses)
        time.sleep(0.6)  # politeness delay

    print(f'✅ Total unique addresses: {len(all_addresses)}')

    with open(OUTPUT_FILE, 'w') as f:
        for addr in all_addresses:
            f.write(addr + '\n')

    print(f'📦 Addresses saved to: {OUTPUT_FILE}')

if __name__ == '__main__':
    main()