const pool = require('../db/connection');

function generateOrderId() {
  const numbers = Math.floor(10000000 + Math.random() * 90000000);
  return `v${numbers}vdb`;
}

function mapBody(body) {
  return {
    orderId: body.numeroPedido || generateOrderId(),
    value: body.valorTotal,
    creationDate: new Date(body.dataCriacao).toISOString(),
    items: body.items.map((item) => ({
      productId: parseInt(item.idItem),
      quantity: item.quantidadeItem,
      price: item.valorItem,
    })),
  };
}

async function createOrder(req, res, body) {
  const { valorTotal, dataCriacao, items } = body;

  if (!valorTotal || !dataCriacao) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: "Os campos 'valorTotal' e 'dataCriacao' são obrigatórios." }));
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: "'items' deve ser um array com ao menos um item." }));
  }

  for (const item of items) {
    if (!item.idItem || !item.quantidadeItem || !item.valorItem) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: "Cada item deve conter: idItem, quantidadeItem e valorItem." }));
    }
  }

  const mapped = mapBody(body);

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      `INSERT INTO "Order" ("orderId", "value", "creationDate")
       VALUES ($1, $2, $3) RETURNING *`,
      [mapped.orderId, mapped.value, mapped.creationDate]
    );

    const insertedItems = [];
    for (const item of mapped.items) {
      const itemResult = await client.query(
        `INSERT INTO "Items" ("orderId", "productId", "quantity", "price")
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [mapped.orderId, item.productId, item.quantity, item.price]
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