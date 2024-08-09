import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  // database: "gynger_lending",
  connectionString: process.env.DATABASE_URL,
});

const verifyConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("Successfully connected to database");
    client.release();
  } catch (err) {
    console.error("Error connecting to database:", err);
  }
};

export { pool, verifyConnection };
