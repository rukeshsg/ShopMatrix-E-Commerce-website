import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  updateProfile,
  updatePassword,
  deleteAccount,
  addAddress,
  deleteAddress,
  getWishlist,
  toggleWishlist
} from '../controllers/userController.js';

const router = express.Router();

router.use(protect); // All user routes require authentication

router.route('/profile').put(updateProfile);
router.route('/password').put(updatePassword);
router.route('/account').delete(deleteAccount);

router.route('/addresses').post(addAddress);
router.route('/addresses/:id').delete(deleteAddress);

router.route('/wishlist')
  .get(getWishlist)
  .post(toggleWishlist);

export default router;
