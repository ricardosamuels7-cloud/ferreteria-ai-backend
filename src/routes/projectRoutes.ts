import { Router } from "express";
import { pool } from "../db";

export const projectRoutes = Router();

projectRoutes.post("/", async (req, res) => {
  const { user_id, description, project_type, location_text, bom_json } = req.body;

  try {
    const { rows } = await pool.query(
      `INSERT INTO projects (user_id, description, project_type, location_text, bom_json)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [user_id, description, project_type, location_text, bom_json || {}]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create project" });
  }
});
