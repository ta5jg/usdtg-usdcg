import os
import time
from dotenv import load_dotenv
from tronpy import Tron
from tronpy.exceptions import TransactionError

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../../justland/.env'))

PRIVATE_KEY = os.getenv("PRIVATE_KEY")
USDTG_CONTRACT = os.getenv("USDTG_CONTRACT")
OWNER_ADDRESS = os.getenv("OWNER_ADDRESS")

client = Tron()
wallet = client.generate_address()
account = client.get_account(OWNER_ADDRESS)

contract = client.get_contract(USDTG_CONTRACT)

def load_recipients(filepath):
    with open(filepath, 'r') as file:
        return [line.strip() for line in file.readlines() if line.strip().startswith('T')]

def send_airdrop(recipient, amount_sun):
    try:
        txn = (
            contract.functions.transfer(recipient, amount_sun)
            .with_owner(OWNER_ADDRESS)
            .build()
            .sign(PRIVATE_KEY)
            .broadcast()
        )
        txn.wait()
        print(f"✅ Sent to {recipient} | TxID: {txn.txid}")
    except TransactionError as e:
        print(f"❌ Failed to send to {recipient}: {e}")
    except Exception as ex:
        print(f"❌ General error: {ex}")

def main():
    print("🚀 USDTg Airdrop Başlatıldı...")

    recipients = load_recipients('recipients.txt')
    amount = 100 * 1_000_000  # 6 decimals for USDTg

    for idx, recipient in enumerate(recipients, 1):
        print(f"📤 {idx}/{len(recipients)}: {recipient}")
        send_airdrop(recipient, amount)
        time.sleep(0.25)

    print("🎉 Airdrop tamamlandı!")

if __name__ == "__main__":
    main()