import QRCode from 'qrcode';

// Base32 Alphabet for standard Google Authenticator secrets (RFC 4648 / RFC 6238)
const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

const getCrypto = () => {
  if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    return globalThis.crypto;
  }
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto;
  }
  return null;
};

/**
 * Generate a random Base32 secret string (RFC 4648 compliant 160-bit 32-character key for Google Authenticator)
 */
export function generateTotpSecret(length = 32): string {
  const bytes = new Uint8Array(length);
  const cryptoObj = getCrypto();
  if (cryptoObj?.getRandomValues) {
    cryptoObj.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  let result = '';
  for (let i = 0; i < length; i++) {
    result += BASE32_CHARS.charAt(bytes[i] % BASE32_CHARS.length);
  }
  return result;
}

/**
 * Formats a secret key into spaced chunks for user readability (e.g. ABCD EFGH IJKL)
 */
export function formatSecretKey(secret: string): string {
  return (secret || '').toUpperCase().replace(/[\s\-_=]/g, '').replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Decode Base32 string to Uint8Array (RFC 4648)
 */
export function base32ToBytes(base32: string): Uint8Array {
  const clean = (base32 || '').toUpperCase().replace(/[\s\-_=]/g, '');
  let bits = '';
  for (let i = 0; i < clean.length; i++) {
    const val = BASE32_CHARS.indexOf(clean.charAt(i));
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }

  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.substring(i * 8, (i + 1) * 8), 2);
  }
  return bytes;
}

/**
 * Encode Uint8Array into Base32 string
 */
export function bytesToBase32(bytes: Uint8Array): string {
  let bits = '';
  for (let i = 0; i < bytes.length; i++) {
    bits += bytes[i].toString(2).padStart(8, '0');
  }

  let result = '';
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.substring(i, i + 5);
    if (chunk.length === 5) {
      result += BASE32_CHARS.charAt(parseInt(chunk, 2));
    }
  }
  return result;
}

/**
 * Generates the standard otpauth URI recognized by Google Authenticator,
 * Microsoft Authenticator, Authy, Apple Passwords, etc.
 */
export function getOtpauthUri(
  secret: string,
  userEmail: string,
  issuer: string = 'Fusion Forge Creation'
): string {
  const cleanSecret = (secret || '').toUpperCase().replace(/[\s\-_=]/g, '');
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedEmail = encodeURIComponent(userEmail);
  return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${cleanSecret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}

/**
 * Generates a base64 Data URL QR Code image for scanning in Google Authenticator
 */
export async function generateQrCodeDataUrl(otpauthUri: string): Promise<string> {
  try {
    return await QRCode.toDataURL(otpauthUri, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 240,
      color: {
        dark: '#1E1B2E',
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('Failed to generate QR Code Data URL:', err);
    return '';
  }
}

/**
 * Cryptographically computes the current 6-digit TOTP code (RFC 6238 / RFC 4226)
 * using the Web Cryptography API HMAC-SHA1.
 */
export async function calculateTotpCode(
  secret: string,
  timestampMs: number = Date.now(),
  periodSeconds: number = 30
): Promise<string> {
  try {
    const cleanSecret = (secret || '').toUpperCase().replace(/[\s\-_=]/g, '');
    const keyBytes = base32ToBytes(cleanSecret);
    if (keyBytes.length === 0) return '';

    const counter = Math.floor(timestampMs / 1000 / periodSeconds);

    // 8-byte big endian counter buffer
    const counterBuffer = new ArrayBuffer(8);
    const counterView = new DataView(counterBuffer);
    counterView.setUint32(0, 0, false); // High 32 bits (zero for current unix epoch seconds)
    counterView.setUint32(4, counter, false); // Low 32 bits

    const subtle = getCrypto()?.subtle;
    if (!subtle) {
      throw new Error('Web Cryptography subtle API is unavailable');
    }

    // Import key for HMAC-SHA1
    const cryptoKey = await subtle.importKey(
      'raw',
      keyBytes,
      { name: 'HMAC', hash: { name: 'SHA-1' } },
      false,
      ['sign']
    );

    const signature = await subtle.sign('HMAC', cryptoKey, counterBuffer);
    const hmacBytes = new Uint8Array(signature);

    // Dynamic truncation offset
    const offset = hmacBytes[hmacBytes.length - 1] & 0x0f;
    const binary =
      ((hmacBytes[offset] & 0x7f) << 24) |
      ((hmacBytes[offset + 1] & 0xff) << 16) |
      ((hmacBytes[offset + 2] & 0xff) << 8) |
      (hmacBytes[offset + 3] & 0xff);

    const otp = binary % 1000000;
    return otp.toString().padStart(6, '0');
  } catch (err) {
    console.error('Error calculating TOTP code:', err);
    return '';
  }
}

/**
 * Verifies a 6-digit user-provided code against a secret key using standard RFC 6238
 * with clock skew tolerance window (+/- 1 time step = 30s window).
 */
export async function verifyTotpCode(
  inputCode: string,
  secret: string,
  toleranceWindows: number = 1
): Promise<boolean> {
  const cleanInput = (inputCode || '').trim().replace(/\D/g, '');
  if (cleanInput.length !== 6 || !/^\d{6}$/.test(cleanInput)) {
    return false;
  }

  const cleanSecret = (secret || '').toUpperCase().replace(/[\s\-_=]/g, '');
  if (!cleanSecret) return false;

  const now = Date.now();
  for (let offset = -toleranceWindows; offset <= toleranceWindows; offset++) {
    const time = now + offset * 30 * 1000;
    const generatedCode = await calculateTotpCode(cleanSecret, time);
    if (generatedCode && generatedCode === cleanInput) {
      return true;
    }
  }

  return false;
}

/**
 * Returns a safe non-reversible cryptographic fingerprint of a secret key
 * (Never exposes the actual secret)
 */
export async function getSafeTotpSecretFingerprint(secret: string): Promise<{
  exists: boolean;
  length: number;
  encoding: string;
  hashPrefix: string;
}> {
  const cleanSecret = (secret || '').toUpperCase().replace(/[\s\-_=]/g, '');
  if (!cleanSecret) {
    return {
      exists: false,
      length: 0,
      encoding: 'None',
      hashPrefix: 'NONE'
    };
  }

  try {
    const subtle = getCrypto()?.subtle;
    if (subtle) {
      const msgBuffer = new TextEncoder().encode(cleanSecret);
      const hashBuffer = await subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return {
        exists: true,
        length: cleanSecret.length,
        encoding: 'RFC4648_Base32',
        hashPrefix: `sha256:${hashHex.substring(0, 8)}...${hashHex.substring(hashHex.length - 4)}`
      };
    }
  } catch {}

  return {
    exists: true,
    length: cleanSecret.length,
    encoding: 'RFC4648_Base32',
    hashPrefix: `len_${cleanSecret.length}`
  };
}

/**
 * Generates 8 one-time emergency backup recovery codes (format: XXXX-XXXX)
 */
export function generateRecoveryCodes(count = 8): string[] {
  const codes: string[] = [];
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  for (let i = 0; i < count; i++) {
    let p1 = '';
    let p2 = '';
    for (let j = 0; j < 4; j++) {
      p1 += chars.charAt(Math.floor(Math.random() * chars.length));
      p2 += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    codes.push(`${p1}-${p2}`);
  }
  return codes;
}
