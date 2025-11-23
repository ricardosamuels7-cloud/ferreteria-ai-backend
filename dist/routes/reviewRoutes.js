"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = require("express");
const db_1 = require("../db");
const sentimentService_1 = require("../services/sentimentService");
exports.reviewRoutes = (0, express_1.Router)();
exports.reviewRoutes.post("/reviews", async (req, res) => {
    const { user_id, product_id, rating, title, review_text } = req.body;
    try {
        const { rows: prodRows } = await db_1.pool.query("SELECT retailer_id FROM products WHERE id=$1", [product_id]);
        if (prodRows.length === 0) {
            return res.status(400).json({ error: "Invalid product" });
        }
        const retailerId = prodRows[0].retailer_id;
        const textForSentiment = review_text || title || "";
        const { sentiment, score } = await (0, sentimentService_1.analyzeSentiment)(textForSentiment);
        const { rows } = await db_1.pool.query(`INSERT INTO reviews (user_id, product_id, retailer_id, rating, title, review_text, sentiment, sentiment_score)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`, [user_id, product_id, retailerId, rating, title, review_text, sentiment, score]);
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not create review" });
    }
});
exports.reviewRoutes.get("/products/:id/reviews", async (req, res) => {
    const productId = req.params.id;
    try {
        const summaryRes = await db_1.pool.query(`SELECT average_rating, review_count
       FROM product_rating_summary
       WHERE product_id=$1`, [productId]);
        const reviewsRes = await db_1.pool.query(`SELECT * FROM reviews
       WHERE product_id=$1
       ORDER BY created_at DESC`, [productId]);
        res.json({
            summary: summaryRes.rows[0] || { average_rating: 0, review_count: 0 },
            reviews: reviewsRes.rows
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not fetch reviews" });
    }
});
