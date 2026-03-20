/**
 * Re-encrypt the admin GitHub PAT with the contribution passphrase.
 *
 * Usage:
 *   node scripts/encrypt-contrib.mjs
 *
 * This decrypts VITE_ENCRYPTED_TOKEN using the admin passphrase,
 * then re-encrypts the same PAT with the contribution passphrase.
 * The output goes into VITE_ENCRYPTED_CONTRIB_TOKEN in your .env file.
 */

import { webcrypto } from "node:crypto";
import { createInterface } from "node:readline";
import { readFileSync } from "node:fs";

const subtle = webcrypto.subtle;
const ITERATIONS = 600_000;

async function deriveKey(passphrase, salt, usage) {
  const keyMaterial = await subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    [usage]
  );
}

async function decrypt(encrypted, passphrase) {
  const parts = encrypted.split(":");
  const salt = Buffer.from(parts[0], "base64");
  const iv = Buffer.from(parts[1], "base64");
  const data = Buffer.from(parts[2], "base64");

  const key = await deriveKey(passphrase, salt, "decrypt");
  const decrypted = await subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  return new TextDecoder().decode(decrypted);
}

async function encrypt(plaintext, passphrase) {
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const iv = webcrypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(passphrase, salt, "encrypt");
  const ciphertext = await subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plaintext)
  );

  const b64 = (buf) => Buffer.from(buf).toString("base64");
  return `${b64(salt)}:${b64(iv)}:${b64(ciphertext)}`;
}

// Read .env to get the encrypted token
let envEncrypted = "";
try {
  const envContent = readFileSync(".env", "utf-8");
  const match = envContent.match(/^VITE_ENCRYPTED_TOKEN=(.+)$/m);
  if (match) envEncrypted = match[1].trim();
} catch {}

if (!envEncrypted) {
  console.error("  Error: VITE_ENCRYPTED_TOKEN not found in .env");
  process.exit(1);
}

const rl = createInterface({ input: process.stdin, output: process.stderr });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

console.error("╔═══════════════════════════════════════════════╗");
console.error("║  Re-encrypt PAT for Contribution Form         ║");
console.error("╚═══════════════════════════════════════════════╝\n");
console.error("  Found VITE_ENCRYPTED_TOKEN in .env\n");

const adminPass = await ask("  Admin passphrase (to decrypt): ");

let pat;
try {
  pat = await decrypt(envEncrypted, adminPass.trim());
  console.error("  ✓ Decrypted successfully\n");
} catch {
  console.error("  ✗ Invalid passphrase. Could not decrypt.");
  rl.close();
  process.exit(1);
}

// Read contribution passphrase from .env or ask
let contribPass = "";
try {
  const envContent = readFileSync(".env", "utf-8");
  const match = envContent.match(/^VITE_CONTRIB_PASSPHRASE=(.+)$/m);
  if (match) contribPass = match[1].trim();
} catch {}

if (contribPass) {
  console.error(`  Using VITE_CONTRIB_PASSPHRASE from .env: "${contribPass}"\n`);
} else {
  contribPass = (await ask("  Contribution passphrase: ")).trim();
}
rl.close();

console.error("  Encrypting (600k PBKDF2 iterations)...");
const result = await encrypt(pat, contribPass);

console.error("\n  Add this line to your .env file:\n");
console.log(`VITE_ENCRYPTED_CONTRIB_TOKEN=${result}`);
console.error("\n  This token is decryptable with the contribution passphrase.");
console.error("  The admin passphrase remains separate and secure.\n");
