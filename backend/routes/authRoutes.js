import express from 'express';
import { register, login, logout, refresh, getMe, verifyOTP } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';
import AppError from '../utils/AppError.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Validation middleware generator
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  next();
};

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per window
  message: 'Too many login attempts from this IP, please try again after 15 minutes'
});

router.post('/register', validate(registerSchema), register);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/logout', protect, logout);
router.post('/refresh', refresh);
router.get('/me', protect, getMe);

export default router;
