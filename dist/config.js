"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
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
