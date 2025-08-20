const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "content-type,authorization,x-client-info",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method === "POST") {
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
  }

  return new Response("Method Not Allowed", { status: 405, headers: CORS_HEADERS });
});
