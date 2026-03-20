/**
 * AES-256-GCM encryption/decryption using a passphrase.
 * Format: base64(salt):base64(iv):base64(ciphertext)
 *
 * Encryption must match scripts/encrypt-token.mjs
 */

const ITERATIONS = 600_000; // OWASP 2023 recommendation for PBKDF2-SHA256

async function deriveKey(
  passphrase: string,
  salt: ArrayBuffer,
  usage: KeyUsage
): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    [usage]
  );
}

function b64ToBuffer(b64: string): ArrayBuffer {
  const bin = atob(b64);
  const buf = new ArrayBuffer(bin.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < bin.length; i++) view[i] = bin.charCodeAt(i);
  return buf;
}

function bufferToB64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary);
}

/**
 * Encrypt plaintext using AES-256-GCM with a passphrase.
 * Returns format: base64(salt):base64(iv):base64(ciphertext)
 */
export async function encryptData(
  plaintext: string,
  passphrase: string
): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(passphrase, salt.buffer as ArrayBuffer, "encrypt");
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plaintext)
  );

  return `${bufferToB64(salt.buffer as ArrayBuffer)}:${bufferToB64(iv.buffer as ArrayBuffer)}:${bufferToB64(ciphertext)}`;
}

/**
 * Decrypt an AES-256-GCM encrypted string using a passphrase.
 */
export async function decryptData(
  encrypted: string,
  passphrase: string
): Promise<string> {
  const parts = encrypted.split(":");
  if (parts.length !== 3) throw new Error("Invalid encrypted format");

  const salt = b64ToBuffer(parts[0]!);
  const iv = b64ToBuffer(parts[1]!);
  const data = b64ToBuffer(parts[2]!);

  const key = await deriveKey(passphrase, salt, "decrypt");
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  return new TextDecoder().decode(decrypted);
}

/** @deprecated Use decryptData instead */
export const decryptToken = decryptData;
