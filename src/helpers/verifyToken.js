const jwt = require('jsonwebtoken');

function verifyToken(req, res) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Token não informado.' }));
    return false;
  }

  const token = authHeader.split(' ')[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch (err) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Token inválido ou expirado.' }));
    return false;
  }
}

module.exports = verifyToken;