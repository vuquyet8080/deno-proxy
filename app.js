import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import axiod from "https://deno.land/x/axiod/mod.ts";

// Handle the /ping endpoint
async function handlePing(req) {
  try {
    const ipResponse = await axiod.get("https://api.ipify.org?format=json");
    const proxyIP = ipResponse.data.ip;

    return new Response(JSON.stringify({ proxyIP }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("🚀 ~ handlePing ~ error:", error);
    return new Response(JSON.stringify({ error: "Error getting IP" }), {
      status: 500,
    });
  }
}

// Handle the /proxy endpoint (forward requests)
async function handleProxy(req) {
  try {
    const { url, method, headers, body } = await req.json();

    if (!url || !method) {
      return new Response(JSON.stringify({ error: "Missing url or method" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Make the request using axiod
    const response = await axiod.request({
      url,
      method,
      headers,
      data: body,
    });

    return new Response(
      JSON.stringify({ status: response.status, data: response.data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("🔥 Proxy error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message || "Proxy error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Set up the server and routes
serve(async (req) => {
  const url = new URL(req.url);

  // Check which path to handle
  if (url.pathname === "/api/v1/ping" && req.method === "GET") {
    return handlePing(req);
  } else if (url.pathname === "/api/v1/proxy" && req.method === "POST") {
    return handleProxy(req);
  }

  // Return 404 for other routes
  return new Response("Not found", { status: 404 });
});
