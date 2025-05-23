import requests
from bs4 import BeautifulSoup
import time

BASE_URL = "https://tronscan.org/#/token20/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t/holders"
API_URL = "https://tronscan.org/#/token20/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t/holders"
OUTPUT_FILE = "tron_addresses.txt"

headers = {
    "User-Agent": "Mozilla/5.0"
}

def fetch_page_html(page_num):
    url = f"https://tronscan.org/#/token20/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t/holders?p={page_num}"
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"❌ Page {page_num} fetch error:", e)
        return None

def parse_addresses(html):
    soup = BeautifulSoup(html, "html.parser")
    addresses = []
    for link in soup.find_all("a", href=True):
        href = link['href']
        if href.startswith("#/address/") and len(href.split('/')[-1]) == 34:
            address = href.split('/')[-1]
            addresses.append(address)
    return list(set(addresses))

def main():
    all_addresses = set()
    for page in range(1, 101):  # 100 pages attempt
        print(f"🔍 Fetching page {page}")
        html = fetch_page_html(page)
        if not html:
            break
        addresses = parse_addresses(html)
        if not addresses:
            print("⚠️ No addresses found on this page. Stopping.")
            break
        all_addresses.update(addresses)
        print(f"✅ Collected: {len(addresses)} addresses from page {page}")
        time.sleep(2)  # politeness delay

    with open(OUTPUT_FILE, "w") as f:
        for addr in sorted(all_addresses):
            f.write(addr + "\n")

    print(f"🎉 Done. Total unique addresses saved: {len(all_addresses)}")

if __name__ == "__main__":
    main()