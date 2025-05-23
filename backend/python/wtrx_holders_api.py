import requests
import time
import csv

CONTRACT_ADDRESS = "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR"  # WTRX TRC20 örneği
BASE_URL = "https://apilist.tronscanapi.com/api/token_trc20/holders"
OUTPUT_FILE = "wtrx_addresses.txt"

def get_holders(start: int, limit: int = 50):
    params = {
        "contract_address": CONTRACT_ADDRESS,
        "limit": limit,
        "start": start,
        "sort": "-balance"
    }
    try:
        response = requests.get(BASE_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        holders = []

        if "data" in data:
            holders = [item["holder_address"] for item in data["data"]]

        elif "contractMap" in data:
            holders = list(data["contractMap"].keys())

        return holders
    except Exception as e:
        print(f"❌ Error @ start={start}: {e}")
        return []

def main():
    all_addresses = set()
    for page in range(0, 200):  # 50 * 200 = 10,000
        start = page * 50
        print(f"📦 Fetching holders {start} to {start+49}")
        holders = get_holders(start)
        if not holders:
            print("🚫 No more holders found.")
            break
        all_addresses.update(holders)
        time.sleep(1.2)

    with open(OUTPUT_FILE, "w") as f:
        for address in sorted(all_addresses):
            f.write(address + "\n")

    print(f"✅ DONE. Total unique addresses: {len(all_addresses)}")

if __name__ == "__main__":
    main()

def main():
    all_addresses = set()
    for page in range(0, 200):  # 50 * 200 = 10,000
        start = page * 50
        print(f"📦 Fetching holders {start} to {start+49}")
        holders = get_holders(start)
        if not holders:
            print("🚫 No more holders found.")
            break
        all_addresses.update(holders)
        time.sleep(1.2)

    with open('wtrx_addresses.txt', 'w') as f_txt, open('wtrx_addresses.csv', 'w', newline='') as f_csv:
        writer = csv.writer(f_csv)
        writer.writerow(['address'])  # CSV header

        for address in sorted(all_addresses):  # veya all_addresses
            f_txt.write(f"{address}\n")
            writer.writerow([address])

    print(f"✅ DONE. Total unique addresses: {len(all_addresses)}")