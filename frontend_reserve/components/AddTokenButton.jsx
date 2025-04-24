import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../assets/styles/SwapModal.css";

const AddTokenButton = ({ tokenList, handleAddToken, isModalOpen, setIsModalOpen }) => {
  const { t } = useTranslation();

  const addedTokens = new Set();

  if (!isModalOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="text-xl font-semibold text-white mb-4">
          {t("addTokenButton.selectToken")}
        </h2>

        <div className="modal-body">
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {tokenList.map((token) => (
              <li key={token.address !== 'N/A' ? token.address : token.symbol}>
                <button
                  onClick={() => {
                    if (!addedTokens.has(token.address)) {
                      handleAddToken(token);
                      addedTokens.add(token.address);
                      toast.success(`${token.symbol} başarıyla eklendi!`, {
                        position: "top-center",
                        autoClose: 2000,
                        theme: "dark",
                      });
                      setIsModalOpen(false);
                    }
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-zinc-700 rounded flex items-center gap-3"
                >
                  <img
                    src={token.logoURI || "/default-token-logo.png"}
                    alt={token.symbol}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-medium">{token.symbol}</span>
                  <span className="text-sm text-gray-400">— {token.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="modal-buttons">
          <button onClick={() => setIsModalOpen(false)} className="cancel-btn">
            {t("common.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTokenButton;