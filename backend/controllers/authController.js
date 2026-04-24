import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { generateTokens, setRefreshCookie, clearRefreshCookie } from '../utils/jwtUtils.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

// @desc    Register a new user (Sends OTP)
// @route   POST /api/auth/register
// @access  Public
export const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user && user.isVerified) {
    return next(new AppError('User already exists', 400));
  }

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

  if (user && !user.isVerified) {
    // Resend OTP for existing unverified user
    user.name = name;
    user.password = password;
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
  } else {
    // Create new unverified user
    user = await User.create({
      name,
      email,
      password,
      isVerified: false,
      otp,
      otpExpires
    });
  }

  // Send Email
  try {
    await sendEmail({
      email: user.email,
      subject: 'ShopMatrix | Verify your account',
      message: `Welcome to ShopMatrix.\n\nYour premium account verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nThank you for choosing ShopMatrix.`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 8px; border: 1px solid #262626;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #d4af37; margin: 0; font-size: 28px; letter-spacing: 2px;">SHOPMATRIX</h1>
            <p style="color: #a0a0a0; font-size: 14px; margin-top: 5px; text-transform: uppercase; letter-spacing: 1px;">Premium E-Commerce</p>
          </div>
          <div style="background-color: #141414; padding: 30px; border-radius: 6px; text-align: center;">
            <h2 style="margin-top: 0; font-size: 20px; font-weight: 500;">Verify Your Account</h2>
            <p style="color: #cccccc; line-height: 1.6; margin-bottom: 25px;">Thank you for registering with ShopMatrix. To complete your setup and access our exclusive collections, please use the verification code below:</p>
            <div style="background-color: #0a0a0a; border: 1px solid #d4af37; padding: 15px 30px; display: inline-block; border-radius: 4px;">
              <span style="font-size: 32px; font-weight: bold; color: #d4af37; letter-spacing: 8px;">${otp}</span>
            </div>
            <p style="color: #888888; font-size: 12px; margin-top: 25px;">This code is valid for 10 minutes. Please do not share this code with anyone.</p>
          </div>
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #262626;">
            <p style="color: #666666; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} ShopMatrix. All rights reserved.</p>
          </div>
        </div>
      `
    });

    res.status(200).json({
      status: 'success',
      message: 'OTP sent to email',
    });
  } catch (error) {
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the email. Try again later!', 500));
  }
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) return next(new AppError('Please provide email and OTP', 400));

  const user = await User.findOne({ email });

  if (!user) return next(new AppError('User not found', 404));
  if (user.isVerified) return next(new AppError('User is already verified', 400));

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    return next(new AppError('Invalid or expired OTP', 400));
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  // Optionally, you can log them in here if you want.
  // The frontend handles login after verify automatically in our implementation.
  res.status(200).json({
    status: 'success',
    message: 'Account verified successfully'
  });
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  if (!user.isVerified) {
    return next(new AppError('Please verify your email to login. You can register again to receive a new OTP.', 403));
  }

  const { accessToken, refreshToken } = generateTokens(user._id, user.role);
  setRefreshCookie(res, refreshToken);

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken
    }
  });
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = catchAsync(async (req, res, next) => {
  clearRefreshCookie(res);
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public (needs refresh cookie)
export const refresh = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return next(new AppError('Not authorized, no refresh token', 401));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError('User not found', 401));
    }

    const tokens = generateTokens(user._id, user.role);
    setRefreshCookie(res, tokens.refreshToken);

    res.status(200).json({
      status: 'success',
      data: {
        accessToken: tokens.accessToken
      }
    });
  } catch (error) {
    return next(new AppError('Not authorized, invalid refresh token', 401));
  }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});
