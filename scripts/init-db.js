
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_HOST !== "localhost" ? { rejectUnauthorized: false } : false,
});

async function initDb() {
  const sqlPath = path.join(__dirname, "../init.sql");

  if (!fs.existsSync(sqlPath)) {
    console.log("init.sql não encontrado, pulando inicialização do banco.");
    return;
  }

  const sql = fs.readFileSync(sqlPath, "utf-8");

  try {
    const client = await pool.connect();
    console.log("Executando init.sql...");
    await client.query(sql);
    console.log("Banco inicializado com sucesso.");
    client.release();
  } catch (err) {
    console.error("Erro ao inicializar o banco:", err.message);
    // Não mata o processo — pode ser que as tabelas já existam
  } finally {
    await pool.end();
  }
}

initDb().finally(() => process.exit(0));