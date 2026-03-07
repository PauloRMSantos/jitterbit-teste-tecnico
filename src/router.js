//Helpers
const getBody = require('./helpers/getBody');
const serveSwagger = require('./helpers/serveSwagger');
const verifyToken = require('./helpers/verifyToken');

//Controllers
const login = require('./controllers/login');
const createOrder = require('./controllers/createOrder');
const getOrder = require('./controllers/getOrder');
const listOrders = require('./controllers/listOrders');
const updateOrder = require('./controllers/updateOrder');
const deleteOrder = require('./controllers/deleteOrder');

async function router(req, res) {
  const { method, url } = req;

  if (url.startsWith('/docs')) {
    return serveSwagger(req, res);
  }

  if (method === 'POST' && url === '/auth/login') {
    const body = await getBody(req);
    return await login(req, res, body);
  }

  if (!verifyToken(req, res)) return;

  if (method === 'GET' && url === '/order/list') {
    await listOrders(req, res);

  } else if (method === 'GET' && url.startsWith('/order/')) {
    const orderId = url.split('/')[2]; // extrai o ID da URL
    await getOrder(req, res, orderId);

  } else if (method === 'POST' && url === '/order') {
    const body = await getBody(req);
    await createOrder(req, res, body);

  } else if (method === 'PUT' && url.startsWith('/order/')) {
    const orderId = url.split('/')[2];
    const body = await getBody(req);
    await updateOrder(req, res, orderId, body);

  } else if (method === 'DELETE' && url.startsWith('/order/')) {
    const orderId = url.split('/')[2];
    await deleteOrder(req, res, orderId);

  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada.' }));
  }
}

module.exports = router;