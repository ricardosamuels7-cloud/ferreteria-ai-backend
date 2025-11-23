"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const db_1 = require("../db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
exports.authRoutes = (0, express_1.Router)();
exports.authRoutes.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const { rows } = await db_1.pool.query("SELECT * FROM retailer_users WHERE email=$1", [email]);
        if (rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const user = rows[0];
        const ok = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!ok) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            retailer_id: user.retailer_id,
            role: user.role
        }, config_1.config.jwtSecret, { expiresIn: "7d" });
        res.json({ token });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
});
