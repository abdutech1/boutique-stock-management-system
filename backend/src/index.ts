import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import categoryRoutes from "./api/category/category.routes.js";
import priceCategoryRoutes from "./api/pricecategory/pricecategory.routes.js";
import saleRouter from "./api/sale/sale.route.js";
import reportsRoutes from "./api/reports/reports.routes.js";
import expenseRoutes from './api/expense/expense.routes.js'
import salaryRoutes from "./api/salary/salary.routes.js";
import stockRoutes from "./api/stock/stock.routes.js";

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
app.use("/api/categories", categoryRoutes);
app.use("/api/price-categories", priceCategoryRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/sales", saleRouter);
app.use("/api/reports", reportsRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/salaries", salaryRoutes);

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

