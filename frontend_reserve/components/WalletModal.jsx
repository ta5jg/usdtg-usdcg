import React from "react";
import { FaTimes, FaPlus } from "react-icons/fa";

const WalletModal = ({
  isOpen,
  onClose,
  importMethod,
  setImportMethod,
  inputValue,
  setInputValue,
  handleImport,
}) => {
  if (!isOpen) return null;

  const onSubmit = () => {
    if (!inputValue.trim()) return;
    handleImport();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 bg-zinc-900 rounded-xl space-y-4">
        <h2 className="text-xl font-bold text-white">
          {importMethod === "privateKey" ? "Private Key ile Cüzdan Ekle" : "Mnemonic ile Cüzdan Ekle"}
        </h2>

        <label className="block text-white font-semibold">
          Ekleme Yöntemi
          <select
            value={importMethod}
            onChange={(e) => setImportMethod(e.target.value)}
            className="w-full mt-1 p-2 bg-zinc-800 text-white border border-zinc-600 rounded"
          >
            <option value="privateKey">Private Key</option>
            <option value="mnemonic">12/24 Kelime (Mnemonic)</option>
          </select>
        </label>

        <label className="block text-white font-semibold">
          Giriş Yap
          <textarea
            rows={importMethod === "mnemonic" ? 3 : 1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              importMethod === "mnemonic"
                ? "örnek: yol ses kasaba ... (12/24 kelime)"
                : "örnek: 0xabc123..."
            }
            className="w-full mt-1 p-2 bg-zinc-800 text-white border border-zinc-600 rounded resize-none"
          />
        </label>

        <div className="flex justify-end gap-4 pt-2">
          <button onClick={onClose} className="cancel-btn">
            İptal
          </button>
          <button onClick={onSubmit} className="confirm-btn">
            Cüzdanı Ekle
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;