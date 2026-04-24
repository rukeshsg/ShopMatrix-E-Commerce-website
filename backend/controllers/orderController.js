import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = catchAsync(async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return next(new AppError('No order items', 400));
  } else {
    // 1. Verify products and stock from DB (never trust frontend prices/quantities)
    const productIds = orderItems.map((x) => x.product);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    if (dbProducts.length !== productIds.length) {
       return next(new AppError('One or more products not found', 404));
    }

    const verifiedItems = [];
    let itemsPrice = 0;

    for (const item of orderItems) {
      const dbProduct = dbProducts.find(p => p._id.toString() === item.product);
      
      if (dbProduct.countInStock < item.qty) {
        return next(new AppError(`Product ${dbProduct.name} is out of stock`, 400));
      }

      verifiedItems.push({
        name: dbProduct.name,
        qty: item.qty,
        image: dbProduct.images[0],
        price: dbProduct.price,
        product: dbProduct._id
      });

      itemsPrice += dbProduct.price * item.qty;
    }

    // 2. Calculate prices securely on backend
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    // 3. Update stock (atomic)
    for (const item of verifiedItems) {
       await Product.findByIdAndUpdate(item.product, {
         $inc: { countInStock: -item.qty }
       });
    }

    // 4. Create Order
    const order = new Order({
      orderItems: verifiedItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: true, // Mocking successful payment for internship demo
      paidAt: Date.now(),
      status: 'Processing'
    });

    const createdOrder = await order.save();

    res.status(201).json({
      status: 'success',
      data: { order: createdOrder }
    });
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ status: 'success', data: { orders } });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Ensure user only sees their own order, unless admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to view this order', 403));
  }

  res.status(200).json({ status: 'success', data: { order } });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.user.toString() !== req.user._id.toString()) {
     return next(new AppError('Not authorized', 403));
  }

  if (['Shipped', 'Delivered', 'Cancelled'].includes(order.status)) {
     return next(new AppError(`Cannot cancel order that is already ${order.status.toLowerCase()}`, 400));
  }

  order.status = 'Cancelled';
  await order.save();

  // Restore stock
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { countInStock: item.qty }
    });
  }

  res.status(200).json({ status: 'success', message: 'Order cancelled successfully', data: { order } });
});

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
  res.status(200).json({ status: 'success', data: { orders } });
});

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  order.status = req.body.status || order.status;

  if (order.status === 'Delivered') {
    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();

  res.status(200).json({ status: 'success', data: { order: updatedOrder } });
});
