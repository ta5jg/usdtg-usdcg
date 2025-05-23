import os
from tronpy import Tron
from tronpy.keys import PrivateKey
from dotenv import load_dotenv

load_dotenv()

client = Tron()
pk = PrivateKey(bytes.fromhex(os.getenv("PRIVATE_KEY")))
token_contract = client.get_contract(os.getenv("TOKEN_CONTRACT"))
sender = os.getenv("SENDER_ADDRESS")

def generate_fake_addresses(n):
    from tronpy.keys import PrivateKey
    return [PrivateKey.random().public_key.to_base58check_address() for _ in range(n)]

def send_tokens(to_address, amount):
    try:
        txn = (
            token_contract.functions.transfer(to_address, amount)
            .with_owner(sender)
            .fee_limit(1_000_000)
            .build()
            .sign(pk)
            .broadcast()
        )
        print(f"✅ Sent 100 tokens to {to_address} | TxID: {txn['txid']}")
    except Exception as e:
        print(f"❌ Error sending to {to_address}: {e}")

def main():
    holders = generate_fake_addresses(1000)
    amount = 100 * 10**6  # assuming 6 decimals
    for idx, address in enumerate(holders):
        send_tokens(address, amount)

if __name__ == "__main__":
    main()