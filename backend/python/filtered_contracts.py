import os
from tronpy import Tron
from tronpy.providers import HTTPProvider
import csv
from dotenv import load_dotenv

load_dotenv()
TRONGRID_API_KEY = os.getenv('TRONGRID_API_KEY')

client = Tron(provider=HTTPProvider(api_key=TRONGRID_API_KEY))

# Girdi dosyaları
input_files = ['tron_addresses.txt', 'adresler.txt']
output_csv = 'gercek_kullanicilar.csv'

unique_addresses = set()

# Her iki dosyadan adresleri oku ve birleşik hale getir
for filename in input_files:
    if not os.path.exists(filename):
        print(f"⚠️ Dosya bulunamadı: {filename}")
        continue
    with open(filename, 'r') as f:
        for line in f:
            address = line.strip()
            if address and address.startswith('T'):
                unique_addresses.add(address)

print(f"🔍 Toplam {len(unique_addresses)} benzersiz adres bulundu. Tarama başlıyor...")

# Gerçek kullanıcı adreslerini ayıkla
real_wallets = []

for addr in sorted(unique_addresses):
    try:
        info = client.get_account(addr)
        if not info.get('contract', False):  # contract alanı yoksa bu bir gerçek kullanıcıdır
            real_wallets.append(addr)
            print(f"✅ {addr} -> Gerçek kullanıcı")
        else:
            print(f"❌ {addr} -> Contract")
    except Exception as e:
        print(f"⚠️ {addr} kontrol edilemedi: {e}")

# CSV çıktısı
with open(output_csv, 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['address'])
    for addr in real_wallets:
        writer.writerow([addr])

print(f"\n📦 CSV oluşturuldu: {output_csv} ({len(real_wallets)} gerçek kullanıcı)")