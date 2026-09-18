import CryptoJS from 'crypto-js';

export const encryptApiKey = (apiKey: string, projectOwnerUid: string): string => {
  if (!apiKey || apiKey.trim() === '') return '';
  // Si ya está cifrada (empieza por U2Fsd que es 'Salted__' en base64)
  if (apiKey.startsWith('U2FsdGVkX1')) return apiKey;
  
  return CryptoJS.AES.encrypt(apiKey, projectOwnerUid).toString();
};

export const decryptApiKey = (encryptedKey: string, projectOwnerUid: string): string => {
  if (!encryptedKey || encryptedKey.trim() === '') return '';
  
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedKey, projectOwnerUid);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    // Si falla el descifrado devuelve el original (para soportar claves antiguas en texto plano)
    return decrypted || encryptedKey;
  } catch (e) {
    return encryptedKey;
  }
};