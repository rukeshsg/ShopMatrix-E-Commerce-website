import express from 'express';
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.route('/').post(protect, addOrderItems);
router.route('/my').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/cancel').put(protect, cancelOrder);

// Admin routes
router.route('/admin/all').get(protect, admin, getOrders);
router.route('/admin/:id/status').put(protect, admin, updateOrderStatus);

export default router;
