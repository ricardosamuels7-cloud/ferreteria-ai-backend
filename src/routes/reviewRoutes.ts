import { Router } from "express";
import { pool } from "../db";
import { analyzeSentiment } from "../services/sentimentService";

export const reviewRoutes = Router();

reviewRoutes.post("/reviews", async (req, res) => {
  const { user_id, product_id, rating, title, review_text } = req.body;

  try {
    const { rows: prodRows } = await pool.query(
      "SELECT retailer_id FROM products WHERE id=$1",
      [product_id]
    );
    if (prodRows.length === 0) {
      return res.status(400).json({ error: "Invalid product" });
    }
    const retailerId = prodRows[0].retailer_id;

    const textForSentiment = review_text || title || "";
    const { sentiment, score } = await analyzeSentiment(textForSentiment);

    const { rows } = await pool.query(
      `INSERT INTO reviews (user_id, product_id, retailer_id, rating, title, review_text, sentiment, sentiment_score)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [user_id, product_id, retailerId, rating, title, review_text, sentiment, score]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create review" });
  }
});

reviewRoutes.get("/products/:id/reviews", async (req, res) => {
  const productId = req.params.id;
  try {
    const summaryRes = await pool.query(
      `SELECT average_rating, review_count
       FROM product_rating_summary
       WHERE product_id=$1`,
      [productId]
    );
    const reviewsRes = await pool.query(
      `SELECT * FROM reviews
       WHERE product_id=$1
       ORDER BY created_at DESC`,
      [productId]
    );
    res.json({
      summary: summaryRes.rows[0] || { average_rating: 0, review_count: 0 },
      reviews: reviewsRes.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch reviews" });
  }
});
