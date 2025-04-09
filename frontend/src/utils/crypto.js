import CryptoJS from "crypto-js";

const SECRET = "🔥usdtz-secret🔥";

export const encryptLog = (data) => {
  return CryptoJS.AES.encrypt(data, SECRET).toString();
};

export const decryptLog = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return "[DECRYPTION_FAILED]";
  }
};