const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "content-type,authorization,x-client-info,x-line-signature",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method === "GET") {
    const data = { ok: true, items: [] };
    return new Response(JSON.stringify(data), { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
  }

  if (req.method === "POST") {
    const data = { ok: true, items: [] };
    return new Response(JSON.stringify(data), { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
  }

  return new Response("Method Not Allowed", { status: 405, headers: CORS_HEADERS });
});
