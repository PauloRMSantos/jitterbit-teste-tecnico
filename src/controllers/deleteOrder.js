const pool = require('../db/connection');

async function deleteOrder(req, res, orderId) {
  try {
    const result = await pool.query(
      `DELETE FROM "Order" WHERE "orderId" = $1 RETURNING *`,
      [orderId]
    );

    if (result.rows.length === 0) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Pedido não encontrado.' }));
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Pedido deletado com sucesso.', order: result.rows[0] }));

  } catch (err) {
    console.error(err.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro ao deletar pedido.' }));
  }
}

module.exports = deleteOrder;