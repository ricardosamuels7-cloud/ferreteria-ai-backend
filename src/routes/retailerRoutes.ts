import { Router } from "express";
import { pool } from "../db";
import { authMiddleware } from "../middleware/auth";

export const retailerRoutes = Router();

retailerRoutes.use(authMiddleware);

retailerRoutes.get("/products", async (req, res) => {
  const retailerId = req.user!.retailer_id;
  const limit = Number(req.query.limit || 500);
  try {
    const { rows } = await pool.query(
      `SELECT * FROM products
       WHERE retailer_id=$1
       ORDER BY updated_at DESC
       LIMIT $2`,
      [retailerId, limit]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

retailerRoutes.get("/reviews", async (req, res) => {
  const retailerId = req.user!.retailer_id;
  try {
    const { rows } = await pool.query(
      `SELECT r.*, p.name AS product_name
       FROM reviews r
       JOIN products p ON r.product_id = p.id
       WHERE r.retailer_id = $1
       ORDER BY r.created_at DESC`,
      [retailerId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});
