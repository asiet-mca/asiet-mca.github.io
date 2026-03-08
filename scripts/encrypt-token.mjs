/**
 * Encrypt a GitHub PAT for the faculty admin portal.
 *
 * Usage:
 *   node scripts/encrypt-token.mjs
 *
 * You'll be prompted for the GitHub PAT and a passphrase.
 * The output is a VITE_ENCRYPTED_TOKEN value to add to your .env file.
 */

import { webcrypto } from "node:crypto";
import { createInterface } from "node:readline";

const subtle = webcrypto.subtle;
const ITERATIONS = 600_000; // OWASP 2023 recommendation for PBKDF2-SHA256

async function encrypt(plaintext, passphrase) {
  const encoder = new TextEncoder();
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const iv = webcrypto.getRandomValues(new Uint8Array(12));

  const keyMaterial = await subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  const key = await subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  const ciphertext = await subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(plaintext)
  );

  const b64 = (buf) => Buffer.from(buf).toString("base64");
  return `${b64(salt)}:${b64(iv)}:${b64(ciphertext)}`;
}

function checkPassphraseStrength(passphrase) {
  const issues = [];
  if (passphrase.length < 12)
    issues.push("Too short (minimum 12 characters recommended)");
  if (/^\d+$/.test(passphrase)) issues.push("Numbers only — too guessable");
  if (/^[a-z]+$/i.test(passphrase))
    issues.push("Letters only — add numbers or symbols");
  if (
    /^(password|admin|mca|asiet|123|qwerty)/i.test(passphrase) ||
    /^(.)\1+$/.test(passphrase)
  )
    issues.push("Common/predictable pattern");
  return issues;
}

const rl = createInterface({ input: process.stdin, output: process.stderr });

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

console.error("╔══════════════════════════════════════╗");
console.error("║  Encrypt GitHub PAT for Admin Portal ║");
console.error("╚══════════════════════════════════════╝\n");

const token = await ask("  GitHub PAT: ");
const passphrase = await ask("  Admin passphrase: ");
rl.close();

if (!token.trim() || !passphrase.trim()) {
  console.error("\n  Both values are required.");
  process.exit(1);
}

// Check passphrase strength
const issues = checkPassphraseStrength(passphrase.trim());
if (issues.length > 0) {
  console.error("\n  ⚠ Passphrase strength issues:");
  issues.forEach((i) => console.error(`    - ${i}`));
  console.error(
    "\n  Tip: Use a phrase like 'mca-materials-kalady-2026!' (easy to remember, hard to guess)\n"
  );
}

console.error("  Encrypting (600k PBKDF2 iterations)...");
const result = await encrypt(token.trim(), passphrase.trim());

console.error("\n  Add this line to your .env file:\n");
console.log(`VITE_ENCRYPTED_TOKEN=${result}`);
console.error(
  "\n  Then share the passphrase with faculty (verbally or via secure channel)."
);
console.error("  Never commit the .env file to git.\n");
