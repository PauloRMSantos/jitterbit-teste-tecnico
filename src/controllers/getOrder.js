const pool = require('../db/connection');

async function getOrder(req, res, orderId) {
  try {
    const orderResult = await pool.query(
      `SELECT * FROM "Order" WHERE "orderId" = $1`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Pedido não encontrado.' }));
    }

    const itemsResult = await pool.query(
      `SELECT * FROM "Items" WHERE "orderId" = $1`,
      [orderId]
    );

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ order: orderResult.rows[0], items: itemsResult.rows }));

  } catch (err) {
    console.error(err.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro ao buscar pedido.' }));
  }
}

module.exports = getOrder;