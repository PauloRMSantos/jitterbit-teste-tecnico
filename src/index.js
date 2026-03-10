require('dotenv').config({ override: false });

const http = require('http');
const pool = require('./db/connection');
const router = require('./router');
const keepAlive = require("./helpers/keepAlive");

const PORT = process.env.PORT || 3000;

async function startServer() {
    // Sobe o servidor primeiro — o Render detecta a porta
    const server = http.createServer((req, res) => {
        router(req, res);
    });

    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });

    keepAlive();

    // Testa a conexão com o banco em background — não bloqueia o boot
    try {
        await pool.query('SELECT 1');
        console.log('Conexão com banco ok');
    } catch (err) {
        console.error('Aviso: erro ao conectar no banco:', err.message);
        // Não faz process.exit — o servidor continua no ar
    }
}

startServer();