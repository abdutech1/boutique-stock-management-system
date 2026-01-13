import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import saleRouter from "./api/sale/sale.route.js";
import reportsRoutes from "./api/reports/reports.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/sales", saleRouter);
app.use("/api/reports", reportsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
