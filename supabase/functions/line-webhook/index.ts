// LINE 簽名驗證 + 最小事件處理
const enc = new TextEncoder();

function b64ToUint8(b64: string) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function verifySignature(req: Request, rawBody: string) {
  const secret = Deno.env.get("LINE_CHANNEL_SECRET") ?? "";
  const sig = req.headers.get("x-line-signature") ?? "";
  if (!secret || !sig) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  // LINE 的 signature 是 base64
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    b64ToUint8(sig),
    enc.encode(rawBody),
  );
  return ok;
}

Deno.serve(async (req) => {
  // 讓 LINE 後台 Verify (GET) 能通過
  if (req.method === "GET") return new Response("OK", { status: 200 });

  if (req.method === "POST") {
    const raw = await req.text();

    // 驗簽
    const valid = await verifySignature(req, raw);
    if (!valid) return new Response("Invalid signature", { status: 401 });

    // 如需處理事件，這裡再解析 JSON
    const payload = JSON.parse(raw);

    // （可選）簡單自動回覆文字訊息
    // 需要先在 secrets 設 LINE_CHANNEL_ACCESS_TOKEN
    const token = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN") ?? "";
    if (token && Array.isArray(payload.events)) {
      for (const ev of payload.events) {
        if (ev.type === "message" && ev.message?.type === "text" && ev.replyToken) {
          await fetch("https://api.line.me/v2/bot/message/reply", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              replyToken: ev.replyToken,
              messages: [{ type: "text", text: `收到：${ev.message.text}` }],
            }),
          });
        }
      }
    }

    return new Response("OK", { status: 200 });
  }

  return new Response("Method Not Allowed", { status: 405 });
});
