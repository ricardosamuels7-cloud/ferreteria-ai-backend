"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retailerImportRoutes = void 0;
const express_1 = require("express");
const db_1 = require("../db");
exports.retailerImportRoutes = (0, express_1.Router)();
exports.retailerImportRoutes.post("/import", async (req, res) => {
    const { retailer, products } = req.body;
    if (!retailer || !Array.isArray(products)) {
        return res.status(400).json({ error: "Invalid payload" });
    }
    const client = await db_1.pool.connect();
    try {
        await client.query("BEGIN");
        const rRes = await client.query("SELECT id FROM retailers WHERE name=$1", [retailer]);
        if (rRes.rows.length === 0) {
            throw new Error(`Retailer ${retailer} not found`);
        }
        const retailerId = rRes.rows[0].id;
        for (const p of products) {
            await client.query(`INSERT INTO products (retailer_id, store_id, sku, name, category, price, stock, currency, image_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (retailer_id, sku)
         DO UPDATE SET
           name = EXCLUDED.name,
           category = EXCLUDED.category,
           price = EXCLUDED.price,
           stock = EXCLUDED.stock,
           currency = EXCLUDED.currency,
           image_url = EXCLUDED.image_url,
           updated_at = NOW()`, [
                retailerId,
                p.store_id || null,
                p.sku,
                p.name,
                p.category || null,
                p.price,
                p.stock ?? null,
                p.currency || "CRC",
                p.image_url || null
            ]);
        }
        await client.query("COMMIT");
        res.json({ status: "ok", retailer, count: products.length });
    }
    catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).json({ error: "Import failed" });
    }
    finally {
        client.release();
    }
});
