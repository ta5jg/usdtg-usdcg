import json
from pathlib import Path
from deep_translator import GoogleTranslator
import sys

base_path = Path(__file__).parent

# Supported languages and their translation targets
language_codes = {
    "tr": "turkish",
    "ar": "arabic",
    "de": "german",
    "es": "spanish",
    "fa": "persian",
    "fr": "french",
    "hi": "hindi",
    "id": "indonesian",
    "it": "italian",
    "ja": "japanese",
    "ko": "korean",
    "pt-BR": "portuguese",
    "ru": "russian",
    "uk": "ukrainian",
    "vi": "vietnamese",
    "zh-CN": "chinese (simplified)"
}

def flatten(d, parent_key='', sep='.'):
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)

def unflatten(d, sep='.'):
    result_dict = {}
    for k, v in d.items():
        keys = k.split(sep)
        current = result_dict
        for part in keys[:-1]:
            current = current.setdefault(part, {})
        current[keys[-1]] = v
    return result_dict

def main():
    if len(sys.argv) != 2:
        print("Usage: python translate_all.py <language_code>")
        return

    target_lang = sys.argv[1]
    if target_lang not in language_codes:
        print(f"Language code '{target_lang}' not supported.")
        return

    lang_code = language_codes[target_lang]
    print(f"Translating to {target_lang}...")

    with open(base_path / "en.json", "r", encoding="utf-8") as f:
        en_data = json.load(f)
    flat_en = flatten(en_data)

    target_path = base_path / f"{target_lang}.json"
    if target_path.exists():
        with open(target_path, "r", encoding="utf-8") as tf:
            target_data = json.load(tf)
        flat_target = flatten(target_data)
    else:
        flat_target = {}

    translated = {}
    for key, val in flat_en.items():
        if key in flat_target and flat_target[key].strip():
            translated[key] = flat_target[key]
        else:
            try:
                translated_text = GoogleTranslator(source='en', target=lang_code).translate(val)
                translated[key] = translated_text
            except Exception as e:
                print(f"Error translating {key}: {e}")
                translated[key] = val

    nested = unflatten(translated)
    with open(target_path, "w", encoding="utf-8") as f:
        json.dump(nested, f, ensure_ascii=False, indent=2)

    print(f"Translation for {target_lang} completed.")

if __name__ == "__main__":
    main()