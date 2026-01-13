import express from 'express';
import { createSale } from '../services/saleService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { employeeId, priceCategoryId, soldPrice, quantity } = req.body;

    if (!employeeId || !priceCategoryId || !soldPrice || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await createSale({
      employeeId,
      priceCategoryId,
      soldPrice,
      quantity,
    });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
