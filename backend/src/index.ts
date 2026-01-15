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
import { authenticate } from "./middleware/authenticate.js";
import { authorize } from "./middleware/authorize.js";

dotenv.config();

const app = express();

/* =========================
   MIDDLEWARE
   ========================= */
app.use(cors());
app.use(express.json());
app.use(authenticate);


/* =========================
   API ROUTES
   ========================= */
app.use("/api/categories", authorize("OWNER"), categoryRoutes);
app.use("/api/price-categories", authorize("OWNER"), priceCategoryRoutes);
app.use("/api/stocks", authorize("OWNER"), stockRoutes);
app.use("/api/expenses", authorize("OWNER"), expenseRoutes);
app.use("/api/salaries", authorize("OWNER"), salaryRoutes);
app.use("/api/reports", authorize("OWNER"), reportsRoutes);


app.use("/api/sales", authorize("OWNER", "EMPLOYEE"), saleRouter);


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

