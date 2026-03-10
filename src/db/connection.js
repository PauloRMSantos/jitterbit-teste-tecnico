// Estou usando o Pool ao invés do Client para gerenciar conexões de forma mais eficiente
const { Pool } = require('pg') 

// Como é apenas um teste técnico, até não haveria necessidade, mas preferi usar o dotenv para simular um case real
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_HOST !== "localhost"
        ? { rejectUnauthorized: false }
        : false,
})

module.exports = pool;