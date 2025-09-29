import crypto from 'crypto';
import { logger } from '../config/logger';

export function decryptAes256(encBase64: string, secret: string): string {
  const encBuffer = Buffer.from(encBase64, 'base64');
  const iv = encBuffer.slice(0, 16);
  const encrypted = encBuffer.slice(16);
  const key = crypto.createHash('sha256').update(secret).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, undefined, 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function getDecryptedEnv(varName: string): string | undefined {
  const value = process.env[varName];
  const secret = process.env.ENC_SECRET;
  
  if (!secret) {
    logger.warn('ENC_SECRET environment variable is not set');
    return value;
  }
  
  if (value && value.startsWith('ENC(') && value.endsWith(')')) {
    const encStr = value.slice(4, -1);
    return decryptAes256(encStr, secret);
  }
  return value;
} 