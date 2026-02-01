import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: "localhost",
  port: 5432,
});

export default pool;
