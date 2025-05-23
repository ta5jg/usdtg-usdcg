def estimate_energy_cost(transfers, energy_per_tx=50000, energy_per_trx=400000):
    total_energy = transfers * energy_per_tx
    required_trx = total_energy / energy_per_trx
    return total_energy, required_trx

def main():
    print("🔋 TRC20 Enerji Hesaplayıcı")
    try:
        transfers = int(input("Kaç transfer yapacaksın? "))
        total_energy, required_trx = estimate_energy_cost(transfers)
        print(f"\n🧮 Tahmini enerji: {total_energy:,} birim")
        print(f"💸 Gerekli TRX (yaklaşık): {required_trx:.2f} TRX")
    except Exception as e:
        print(f"❌ Hata: {e}")

if __name__ == "__main__":
    main()