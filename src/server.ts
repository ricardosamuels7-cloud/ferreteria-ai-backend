import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "./config";
import { authRoutes } from "./routes/authRoutes";
import { projectRoutes } from "./routes/projectRoutes";
import { retailerImportRoutes } from "./routes/retailerImportRoutes";
import { retailerRoutes } from "./routes/retailerRoutes";
import { reviewRoutes } from "./routes/reviewRoutes";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/retailer", retailerImportRoutes);
app.use("/", reviewRoutes);
app.use("/api/retailer", retailerRoutes);

app.listen(config.port, () => {
  console.log(`Ferreteria-AI backend listening on port ${config.port}`);
});
