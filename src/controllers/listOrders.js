const pool = require('../db/connection');

async function listOrders(req, res) {
  try {
    const ordersResult = await pool.query(
      `SELECT * FROM "Order" ORDER BY "creationDate" DESC`
    );

    const orders = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await pool.query(
          `SELECT * FROM "Items" WHERE "orderId" = $1`,
          [order.orderId]
        );
        return { ...order, items: itemsResult.rows };
      })
    );

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ total: orders.length, orders }));

  } catch (err) {
    console.error(err.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro ao listar pedidos.' }));
  }
}

module.exports = listOrders;