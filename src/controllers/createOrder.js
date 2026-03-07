const pool = require('../db/connection');

function generateOrderId() {
  const numbers = Math.floor(10000000 + Math.random() * 90000000);
  return `v${numbers}vdb`;
}

async function createOrder(req, res, body) {
  const { value, items } = body;

  if (!value) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: "O campo 'value' é obrigatório." }));
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: "'items' não pode ser vazio." }));
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Garantindo integridade da transação em caso de falha

    const orderId = generateOrderId();

    const orderResult = await client.query(
      `INSERT INTO "Order" ("orderId", "value", "creationDate")
       VALUES ($1, $2, NOW()) RETURNING *`,
      [orderId, value]
    );

    const insertedItems = [];
    for (const item of items) {
      const itemResult = await client.query(
        `INSERT INTO "Items" ("orderId", "productId", "quantity", "price")
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [orderId, item.productId, item.quantity, item.price]
      );
      insertedItems.push(itemResult.rows[0]);
    }

    await client.query('COMMIT');

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ order: orderResult.rows[0], items: insertedItems }));

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro ao criar pedido.' }));
  } finally {
    client.release();
  }
}

module.exports = createOrder;