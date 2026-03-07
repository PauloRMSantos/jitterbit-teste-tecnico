const getBody = require("./helpers/getBody");

async function router(req, res) {
  const { method, url } = req;

  if (method === 'GET' && url === '/order/list') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'listar pedidos' }));

  } else if (method === 'GET' && url.startsWith('/order/')) {
    const orderId = url.split('/')[2]; // extrai o ID da URL
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: `buscar pedido ${orderId}` }));

  } else if (method === 'POST' && url === '/order') {
    const body = await getBody(req);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Body recebido: ', body }));

  } else if (method === 'PUT' && url.startsWith('/order/')) {
    const orderId = url.split('/')[2];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: `atualizar pedido ${orderId}` }));

  } else if (method === 'DELETE' && url.startsWith('/order/')) {
    const orderId = url.split('/')[2];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: `deletar pedido ${orderId}` }));

  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada.' }));
  }
}

module.exports = router;