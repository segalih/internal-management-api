import CryptoJS from 'crypto-js';
import configConstants from '../../config/constants';

export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, configConstants.CRYPTO_KEY).toString();
}

export function decrypt(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, configConstants.CRYPTO_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
