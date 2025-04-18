import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

async function handler(req) {
  const { pathname } = new URL(req.url);

  if (pathname === "/api/v1/ping") {
    const ipRes = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipRes.json();

    return new Response(JSON.stringify({ proxyIP: ipData.ip }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (pathname === "/api/v1/proxy" && req.method === "POST") {
    const body = await req.json();
    const { url, method, headers = {}, body: requestBody } = body;

    if (!url || !method) {
      return new Response(JSON.stringify({ error: "Missing url or method" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const proxyRes = await fetch(url, {
        method,
        headers,
        body: requestBody ? JSON.stringify(requestBody) : undefined,
      });

      const data = await proxyRes.text();
      return new Response(
        JSON.stringify({
          status: proxyRes.status,
          data: data,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response("Not found", { status: 404 });
}

serve(handler);
