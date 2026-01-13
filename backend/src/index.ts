import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import saleRouter from "./api/sale/sale.route.js";
import reportsRoutes from "./api/reports/reports.routes.js";

dotenv.config();

const app = express();

/* =========================
   MIDDLEWARE
   ========================= */
app.use(cors());
app.use(express.json());

/* =========================
   API ROUTES
   ========================= */
app.use("/api/sales", saleRouter);
app.use("/api/reports", reportsRoutes);

/* =========================
   HEALTH CHECK (OPTIONAL)
   ========================= */
app.get("/health", (_, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

/* =========================
   SERVER
   ========================= */
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

