require ('dotenv').config();

const http = require('http');
const pool = require('./db/connection');
const router = require('./router');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await pool.query('SELECT 1')
        console.log('Conexão ok')

        const server = http.createServer((req, res) => {
            router(req, res);
        })

        server.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        })
    } catch (err) {
        console.error('Erro de conexão:', err);
        process.exit(1);
    }
}

startServer();