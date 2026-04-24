import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = catchAsync(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });
  
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, cartItems: [] });
  }

  res.status(200).json({ status: 'success', data: { cart } });
});

// @desc    Add or update item in cart
// @route   POST /api/cart/items
// @access  Private
export const syncCart = catchAsync(async (req, res, next) => {
  const { cartItems } = req.body; // Receiving array of items from frontend local storage sync or direct addition
  
  // Basic validation that products exist
  const productIds = cartItems.map(item => item.product);
  const products = await Product.find({ _id: { $in: productIds }, isDeleted: false });

  if (products.length !== productIds.length) {
    return next(new AppError('One or more products in the cart are invalid or unavailable.', 400));
  }

  // Ensure prices are trustworthy by matching with DB
  const validCartItems = cartItems.map(item => {
    const dbProduct = products.find(p => p._id.toString() === item.product);
    return {
      product: item.product,
      name: dbProduct.name,
      image: dbProduct.images[0],
      price: dbProduct.price,
      qty: item.qty > dbProduct.countInStock ? dbProduct.countInStock : item.qty
    };
  });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, cartItems: validCartItems });
  } else {
    cart.cartItems = validCartItems;
    await cart.save();
  }

  res.status(200).json({ status: 'success', data: { cart } });
});

// @desc    Clear user cart
// @route   DELETE /api/cart/clear
// @access  Private
export const clearCart = catchAsync(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.cartItems = [];
    await cart.save();
  }
  res.status(200).json({ status: 'success', message: 'Cart cleared' });
});
