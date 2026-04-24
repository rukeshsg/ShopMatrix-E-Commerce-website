import express from 'express';
import { getCart, syncCart, clearCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getCart);

router.route('/items')
  .post(protect, syncCart);

router.route('/clear')
  .delete(protect, clearCart);

export default router;
