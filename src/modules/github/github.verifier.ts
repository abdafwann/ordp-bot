import crypto from "node:crypto";

const SIGNATURE_PATTERN = /^sha256=([0-9a-fA-F]{64})$/;

export function verifyGitHubSignature(
  payload: string | Buffer,
  signatureHeader: string | undefined,
  secret: string
): boolean {
  if (!signatureHeader || !secret) {
    return false;
  }

  const match = SIGNATURE_PATTERN.exec(signatureHeader);
  if (!match) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest();
  const provided = Buffer.from(match[1], "hex");

  return crypto.timingSafeEqual(expected, provided);
}
