import React from "react";
import { useTranslation } from "react-i18next";
import "../WalletDashboard"

function TokenCard({ balance, price }) {
  const { t } = useTranslation();
  const tokenMetadata = JSON.parse(localStorage.getItem("tokenMetadata")) || {};
  const parsedBalance = parseFloat(balance) / Math.pow(10, tokenMetadata.decimals || 18) || 0;
  const parsedPrice = parseFloat(price) || 0;
  const totalValue = parsedBalance * parsedPrice;

  function getTokenLogo() {
    try {
      const metadata = JSON.parse(localStorage.getItem("tokenMetadata")) || {};
      return metadata.logoURI || "../public/tether-usdt-logo.png";
    } catch {
      return "./default-token-logo.png";
    }
  }

  return (
    <div className="w-full flex justify-center items-start p-4">
      <div className="w-full max-w-md mt-2 p-6 bg-zinc-900 text-white rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-bold mb-2 text-center">{t("tokenCard.title")}</h2>
          <div className="inline-flex flex-col items-center">
            <img
              src={getTokenLogo()}
              alt="Token Logo"
              className="mx-auto mb-2 w-10 h-10"
            />
            <div className="text-center">
              <p className="text-lg">
                {parsedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm">{tokenMetadata.symbol || "USDTg"}</span>
              </p>
              <p className="text-sm text-gray-300 mt-1">
                1 {tokenMetadata.symbol || "USDTg"} = {parsedPrice > 0 ? `$${parsedPrice.toFixed(3)}` : "—"}
              </p>
              <p className="mt-3 text-green-400 font-semibold text-lg">
                {t("tokenCard.totalValue")}: ${totalValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
      </div>
    </div>
  );
}

export default TokenCard;