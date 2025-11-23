"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const authRoutes_1 = require("./routes/authRoutes");
const projectRoutes_1 = require("./routes/projectRoutes");
const retailerImportRoutes_1 = require("./routes/retailerImportRoutes");
const retailerRoutes_1 = require("./routes/retailerRoutes");
const reviewRoutes_1 = require("./routes/reviewRoutes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});
app.use("/auth", authRoutes_1.authRoutes);
app.use("/projects", projectRoutes_1.projectRoutes);
app.use("/retailer", retailerImportRoutes_1.retailerImportRoutes);
app.use("/", reviewRoutes_1.reviewRoutes);
app.use("/api/retailer", retailerRoutes_1.retailerRoutes);
app.listen(config_1.config.port, () => {
    console.log(`Ferreteria-AI backend listening on port ${config_1.config.port}`);
});
