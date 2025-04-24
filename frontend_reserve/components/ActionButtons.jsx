import React from "react";
import { ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ActionButtons = ({ onSwapClick, onSendClick, onReceiveClick }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap justify-center items-center gap-6 w-full max-w-2xl mx-auto mt-4 md:mt-6 pb-6">
      <button
        className="flex flex-col items-center justify-center bg-blue-600 text-white p-4 rounded-xl shadow-md hover:bg-blue-700 hover:scale-105 transition duration-200"
        onClick={onSendClick}
      >
        <ArrowUpRight className="w-6 h-6 mb-1" />
        <span className="text-sm">{t('actions.send')}</span>
      </button>
      <button
        className="flex flex-col items-center justify-center bg-green-600 text-white p-4 rounded-xl shadow-md hover:bg-green-700 hover:scale-105 transition duration-200"
        onClick={onReceiveClick}
      >
        <ArrowDownLeft className="w-6 h-6 mb-1" />
        <span className="text-sm">{t('actions.receive')}</span>
      </button>
      <button
        className="flex flex-col items-center justify-center bg-gray-700 text-white p-4 rounded-xl shadow-md hover:bg-gray-800 hover:scale-105 transition duration-200"
        onClick={onSwapClick}
      >
        <RefreshCw className="w-6 h-6 mb-1" />
        <span className="text-sm">{t('actions.swap')}</span>
      </button>
    </div>
  );
};

export default ActionButtons;
