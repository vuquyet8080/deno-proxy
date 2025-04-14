const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/v1/proxy", async (req, res) => {
  const { url, method, headers = {}, body } = req.body;

  if (!url || !method) {
    return res.status(400).json({ error: "Missing url or method" });
  }

  try {
    const response = await axios.request({
      url,
      method,
      headers,
      data: body,
      validateStatus: () => true, // allow forwarding of all HTTP statuses
    });
    const ipResponse = await axios.get("https://api.ipify.org?format=json");
    const proxyIP = ipResponse.data.ip;
    res.status(200).json({
      status: response.status,
      // headers: response.headers,
      proxyIP,
      data: response.data,
    });
  } catch (error) {
    console.error("🔥 Proxy error:", error.message);
    res.status(500).json({ error: error.message || "Proxy error" });
  }
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`🚀 Axios proxy server running on port ${PORT}`);
});
