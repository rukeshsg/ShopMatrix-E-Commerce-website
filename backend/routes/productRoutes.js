import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { productSchema, reviewSchema } from '../validators/productValidator.js';
import AppError from '../utils/AppError.js';

const router = express.Router();

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  next();
};

router.route('/')
  .get(getProducts)
  .post(protect, admin, validate(productSchema), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, validate(productSchema), updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/:id/reviews')
  .post(protect, validate(reviewSchema), createProductReview);

export default router;
