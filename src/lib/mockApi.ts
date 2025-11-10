import { ApiConfig, DevotionSignature, EdRecordPayload, ScoreEd } from "@/lib/types";

export const defaultApiConfig: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "https://mock.qfi.local",
};

export async function createDevotionSignature(ed: ScoreEd): Promise<DevotionSignature> {
  // 実運用: ウォレット署名 or サーバ署名
  const payload = `${ed.date}:${ed.ed.toFixed(6)}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signatureHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return { edDate: ed.date, edValue: ed.ed, signatureHex };
}

export async function recordEdScore(ed: ScoreEd, cfg: ApiConfig = defaultApiConfig): Promise<{ id: string }>{
  const signature = await createDevotionSignature(ed);
  const payload: EdRecordPayload = { ed, signature };
  // モック送信
  await fetch(`${cfg.baseUrl}/qfi/record`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => undefined);
  return { id: `${ed.date}-${signature.signatureHex.slice(0, 8)}` };
}

export async function mintTokenForQfi(address: string, qfi: number, cfg: ApiConfig = defaultApiConfig): Promise<{ tx: string }>{
  // 実運用: viem/ethers 経由でミント
  await fetch(`${cfg.baseUrl}/token/mint`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, qfi }),
  }).catch(() => undefined);
  return { tx: `0x${Math.floor(Math.random() * 1e16).toString(16)}` };
}



