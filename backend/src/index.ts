import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import saleRouter from "./routes/sale.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/sales", saleRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
