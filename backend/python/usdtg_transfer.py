import random
import pandas as pd
from tronpy import Tron
from tronpy.providers import HTTPProvider
from tronpy.keys import PrivateKey
from decimal import Decimal
from dotenv import load_dotenv
import os
import time

load_dotenv()
YOUR_PRIVATE_KEY = os.getenv('PRIVATE_KEY')
TRONGRID_API_KEY = os.getenv('TRONGRID_API_KEY')

USDTG_CONTRACT = 'TEpGiLGNB7W9W26LbvtU9wdukrLgLZwFgr'
FEE_LIMIT = 6_000_000

client = Tron(provider=HTTPProvider(api_key=TRONGRID_API_KEY))
wallet = PrivateKey(bytes.fromhex(YOUR_PRIVATE_KEY))
sender_address = wallet.public_key.to_base58check_address()
contract = client.get_contract(USDTG_CONTRACT)

base_dir = os.path.dirname(__file__)
addresses_path = os.path.join(base_dir, 'gercek_kullanicilar.csv')
df_all = pd.read_csv(addresses_path)
all_addresses = df_all['address'].dropna().unique().tolist()

sent_addresses_path = os.path.join(base_dir, 'usdtg_basari.csv')
if os.path.exists(sent_addresses_path):
    df_sent = pd.read_csv(sent_addresses_path)
    sent_addresses = set(df_sent['address'].tolist())
else:
    sent_addresses = set()

unsent_addresses = [addr for addr in all_addresses if addr not in sent_addresses]
random.shuffle(unsent_addresses)

results = []
failures = []


def is_contract(address):
    try:
        info = client.get_account(address)
        return info.get('type') == 'Contract'
    except:
        return True


max_tx = 1
counter = 0

for addr in unsent_addresses:
    if counter >= max_tx:
        break

    if is_contract(addr):
        print(f"⚠️ {addr} bir kontrat adresi. Atlanıyor.")
        continue

    amount = round(random.uniform(100, 150), 2)
    success = False

    for attempt in range(3):
        try:
            txn = (
                contract.functions.transfer(addr, int(Decimal(str(amount)) * 10**6))
                .with_owner(sender_address)
                .fee_limit(FEE_LIMIT)
                .build()
                .sign(wallet)
                .broadcast()
            )
            if txn:
                print(f"✅ [{counter+1}] {addr} adresine {amount} USDTg gönderildi. TX: {txn['txid']}")
                results.append({'address': addr, 'amount': amount, 'txid': txn['txid']})
                success = True
                break
        except Exception as e:
            print(f"❌ [{counter+1}] Deneme {attempt+1} başarısız: {e}")
            time.sleep(1)

    if not success:
        failures.append({'address': addr, 'amount': amount, 'txid': 'FAILED'})
        print(f"❌ [{counter+1}] {addr} adresine gönderim başarısız.")

    counter += 1
    sleep_time = random.randint(30, 60)
    print(f"⏱️ {sleep_time} saniye bekleniyor...")
    time.sleep(sleep_time)

if results:
    df_success = pd.DataFrame(results)
    if os.path.exists(sent_addresses_path):
        df_success.to_csv(sent_addresses_path, mode='a', header=False, index=False)
    else:
        df_success.to_csv(sent_addresses_path, index=False)

if failures:
    pd.DataFrame(failures).to_csv(os.path.join(base_dir, 'usdtg_hatalar.csv'), index=False)

print("📄 Gönderim tamamlandı. Dosyalar güncellendi.")