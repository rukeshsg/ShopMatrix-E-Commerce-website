import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new AppError('User not found', 404));

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;

  const updatedUser = await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
      }
    }
  });
});

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!user || !(await user.matchPassword(currentPassword))) {
    return next(new AppError('Incorrect current password', 401));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ status: 'success', message: 'Password updated successfully' });
});

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
export const deleteAccount = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError('Incorrect password', 401));
  }

  await User.findByIdAndDelete(req.user._id);

  res.cookie('refreshToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success', message: 'Account deleted successfully' });
});

// @desc    Add address
// @route   POST /api/users/addresses
// @access  Private
export const addAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  
  if (req.body.isDefault) {
    user.addresses.forEach(addr => addr.isDefault = false);
  }

  user.addresses.push(req.body);
  await user.save();

  res.status(201).json({ status: 'success', data: { addresses: user.addresses } });
});

// @desc    Delete address
// @route   DELETE /api/users/addresses/:id
// @access  Private
export const deleteAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  
  user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
  await user.save();

  res.status(200).json({ status: 'success', data: { addresses: user.addresses } });
});

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
export const getWishlist = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.status(200).json({ status: 'success', data: { wishlist: user.wishlist } });
});

// @desc    Toggle item in wishlist
// @route   POST /api/users/wishlist
// @access  Private
export const toggleWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);

  const index = user.wishlist.indexOf(productId);
  if (index === -1) {
    user.wishlist.push(productId);
  } else {
    user.wishlist.splice(index, 1);
  }

  await user.save();
  const updatedUser = await User.findById(req.user._id).populate('wishlist');

  res.status(200).json({ status: 'success', data: { wishlist: updatedUser.wishlist } });
});
