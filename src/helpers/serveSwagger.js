const fs = require('fs');
const path = require('path');
const swaggerUiDist = require('swagger-ui-dist');

const swaggerUiPath = swaggerUiDist.getAbsoluteFSPath();

function serveSwagger(req, res) {
  const { url } = req;

  // Serve o swagger.json da nossa spec
  if (url === '/docs/swagger.json') {
    const spec = fs.readFileSync(path.join(__dirname, '../swagger.json'));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(spec);
  }

  // Serve o HTML principal do Swagger UI com a URL da nossa spec
  if (url === '/docs' || url === '/docs/') {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order API - Docs</title>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" type="text/css" href="/docs/swagger-ui.css" >
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="/docs/swagger-ui-bundle.js"> </script>
          <script>
            SwaggerUIBundle({
              url: "/docs/swagger.json",
              dom_id: '#swagger-ui',
              presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
              layout: "BaseLayout"
            })
          </script>
        </body>
      </html>
    `;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(html);
  }

  // Serve os arquivos estáticos do swagger-ui-dist (css, js...)
  const fileName = url.replace('/docs/', '');
  const filePath = path.join(swaggerUiPath, fileName);

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath);
    const mimeTypes = {
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.png': 'image/png',
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    return res.end(fs.readFileSync(filePath));
  }

  res.writeHead(404);
  res.end('Not found');
}

module.exports = serveSwagger;