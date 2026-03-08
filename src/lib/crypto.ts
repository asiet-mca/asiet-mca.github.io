/**
 * Decrypt an AES-256-GCM encrypted token using a passphrase.
 * Format: base64(salt):base64(iv):base64(ciphertext)
 *
 * Must match the encryption in scripts/encrypt-token.mjs
 */

async function deriveKey(
  passphrase: string,
  salt: ArrayBuffer
): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 600_000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
}

function b64ToBuffer(b64: string): ArrayBuffer {
  const bin = atob(b64);
  const buf = new ArrayBuffer(bin.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < bin.length; i++) view[i] = bin.charCodeAt(i);
  return buf;
}

export async function decryptToken(
  encrypted: string,
  passphrase: string
): Promise<string> {
  const parts = encrypted.split(":");
  if (parts.length !== 3) throw new Error("Invalid encrypted token format");

  const salt = b64ToBuffer(parts[0]!);
  const iv = b64ToBuffer(parts[1]!);
  const data = b64ToBuffer(parts[2]!);

  const key = await deriveKey(passphrase, salt);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  return new TextDecoder().decode(decrypted);
}
