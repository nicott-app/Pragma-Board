import { describe, it, expect } from 'vitest';
import { encryptApiKey, decryptApiKey } from './cryptoUtils';

describe('cryptoUtils', () => {
  const originalKey = 'AIzaSyA_FAKE_KEY_FOR_TESTING_PURPOSES';
  const ownerUid = 'user_12345';
  const differentUid = 'user_67890';

  describe('encryptApiKey & decryptApiKey', () => {
    it('should correctly encrypt and decrypt an API key with the correct UID', () => {
      const encrypted = encryptApiKey(originalKey, ownerUid);
      
      // The encrypted string should not be the same as the original key
      expect(encrypted).not.toBe(originalKey);
      expect(encrypted).not.toContain(originalKey);
      
      const decrypted = decryptApiKey(encrypted, ownerUid);
      
      // Decrypting with the same UID should yield the original key
      expect(decrypted).toBe(originalKey);
    });

    it('should return empty string or garbage when decrypting with a wrong UID', () => {
      const encrypted = encryptApiKey(originalKey, ownerUid);
      const decrypted = decryptApiKey(encrypted, differentUid);
      
      expect(decrypted).not.toBe(originalKey);
    });

    it('should return empty string if no text is provided', () => {
      expect(encryptApiKey('', ownerUid)).toBe('');
      expect(decryptApiKey('', ownerUid)).toBe('');
    });
  });
});
