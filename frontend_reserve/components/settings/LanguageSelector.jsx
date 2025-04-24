import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

const LanguageSelector = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || "en");

  useEffect(() => {
    const storedLang = localStorage.getItem("USDTg-lang");
    if (storedLang) {
      i18n.changeLanguage(storedLang);
      setLanguage(storedLang);
    }
  }, []);

  const handleChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    i18n.changeLanguage(selectedLang);
    localStorage.setItem("USDTg-lang", selectedLang);
  };

  return (
    <div className="text-sm text-white">
      <label htmlFor="lang" className="mr-2">🌐 {t("languageSelector.label")}</label>
      <select
        id="lang"
        value={language}
        onChange={handleChange}
        className="bg-zinc-800 border border-zinc-600 text-white px-2 py-1 rounded"
      >
        <option value="en">🇺🇸 EN</option>
        <option value="tr">🇹🇷 TR</option>
        <option value="de">🇩🇪 DE</option>
        <option value="fr">🇫🇷 FR</option>
        <option value="es">🇪🇸 ES</option>
        <option value="ar">🇸🇦 AR</option>
        <option value="zh-CN">🇨🇳 ZH</option>
        <option value="ru">🇷🇺 RU</option>
        <option value="hi">🇮🇳 HI</option>
        <option value="pt-BR">🇧🇷 PT</option>
        <option value="ja">🇯🇵 JA</option>
        <option value="ko">🇰🇷 KO</option>
        <option value="vi">🇻🇳 VI</option>
        <option value="uk">🇺🇦 UK</option>
        <option value="fa">🇮🇷 FA</option>
        <option value="id">🇮🇩 ID</option>
        <option value="it">🇮🇹 IT</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
