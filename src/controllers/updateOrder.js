const pool = require('../db/connection');

async function updateOrder(req, res, orderId, body) {
  const { value, items } = body;

  if (!value && !items) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: "Informe ao menos 'value' ou 'items' para atualizar." }));
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const existing = await client.query(
      `SELECT * FROM "Order" WHERE "orderId" = $1`,
      [orderId]
    );

    if (existing.rows.length === 0) {
      await client.query('ROLLBACK');
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Pedido não encontrado.' }));
    }

    let updatedOrder = existing.rows[0];

    if (value) {
      const result = await client.query(
        `UPDATE "Order" SET "value" = $1 WHERE "orderId" = $2 RETURNING *`,
        [value, orderId]
      );
      updatedOrder = result.rows[0];
    }

    let updatedItems = [];

    if (items && Array.isArray(items) && items.length > 0) {
      await client.query(`DELETE FROM "Items" WHERE "orderId" = $1`, [orderId]);
      for (const item of items) {
        const itemResult = await client.query(
          `INSERT INTO "Items" ("orderId", "productId", "quantity", "price")
           VALUES ($1, $2, $3, $4) RETURNING *`,
          [orderId, item.productId, item.quantity, item.price]
        );
        updatedItems.push(itemResult.rows[0]);
      }
    } else {
      const itemsResult = await client.query(
        `SELECT * FROM "Items" WHERE "orderId" = $1`, [orderId]
      );
      updatedItems = itemsResult.rows;
    }

    await client.query('COMMIT');

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ order: updatedOrder, items: updatedItems }));

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro ao atualizar pedido.' }));
  } finally {
    client.release();
  }
}

module.exports = updateOrder;