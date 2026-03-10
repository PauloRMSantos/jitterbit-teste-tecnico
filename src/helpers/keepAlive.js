const https = require("https");
const http = require("http");

function keepAlive() {
  const rawUrl = process.env.RENDER_EXTERNAL_URL;

  if (!rawUrl) {
    // Em ambiente local não faz nada
    return;
  }

  const url = `${rawUrl}/health`;
  const client = url.startsWith("https") ? https : http;

  setInterval(() => {
    client
      .get(url, (res) => {
        // Drena a resposta para não vazar memória
        res.resume();
      })
      .on("error", (err) => {
        console.error("[keep-alive] Falha ao pingar /health:", err.message);
      });
  }, 15 * 1000); // 15 segundos

  console.log(`[keep-alive] Pingando ${url} a cada 15s`);
}

module.exports = keepAlive;