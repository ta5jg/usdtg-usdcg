import csv
import json

csv_file_path = './Token_Holders_20250511.csv'         # CSV dosya adını gir
json_file_path = 'tokenholders.json'       # Çıkış JSON dosyası

with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    data = [row for row in csv_reader]

with open(json_file_path, mode='w', encoding='utf-8') as json_file:
    json.dump(data, json_file, indent=4)

print(f"✅ {json_file_path} oluşturuldu.")
