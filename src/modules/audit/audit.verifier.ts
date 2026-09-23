import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyAuditSignature(
  rawBody: string,
  signature: string | undefined,
  secret: string
): boolean {
  if (!signature || signature.length === 0) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest();
  const provided = Buffer.from(signature, "hex");
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(expected, provided);
}
