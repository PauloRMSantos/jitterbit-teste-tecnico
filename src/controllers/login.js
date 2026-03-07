const jwt = require('jsonwebtoken');

async function login(req, res, body) {
  const { username, password } = body;

  if (!username || !password) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: "Os campos 'username' e 'password' são obrigatórios." }));
  }

  if (username !== process.env.API_USER || password !== process.env.API_PASSWORD) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Credenciais inválidas.' }));
  }

  const token = jwt.sign(
    { username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ token }));
}

module.exports = login;