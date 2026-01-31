import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: "localhost",
  port: 5432,
});

pool
  .query("CREATE DATABASE ems")
  .then((Response) => {
    console.log("DB Created");
  })
  .catch((err) => {
    console.log(err);
  });

export default pool;
