import aes256 from 'aes256';
import { Config } from '../config/config.js';

export const DoEncrypt = (text) => {
  let encrypted = aes256.encrypt(Config.KEY, text);
  return encrypted;
};
