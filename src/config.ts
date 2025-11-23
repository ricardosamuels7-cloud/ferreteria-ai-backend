import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 4000,
  pg: {
    host: process.env.PGHOST || "localhost",
    port: Number(process.env.PGPORT) || 5432,
    database: process.env.PGDATABASE || "ferreteria_ai",
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || ""
  },
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  openaiApiKey: process.env.OPENAI_API_KEY || ""
};
