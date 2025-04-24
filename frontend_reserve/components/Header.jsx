import React from "react";
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-xl shadow-lg text-center mb-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold tracking-wide">USDTg Wallet</h1>
      <p className="text-sm mt-2 text-gray-100">
        {t("header.description")}
      </p>
    </header>
  );
};

export default Header;
