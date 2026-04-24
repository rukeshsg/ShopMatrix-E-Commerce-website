import Product from '../models/Product.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// @desc    Fetch all products with pagination and search
// @route   GET /api/products
// @access  Public
export const getProducts = catchAsync(async (req, res, next) => {
  const pageSize = Number(req.query.pageSize) || 100;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        $or: [
          { name:     { $regex: req.query.keyword, $options: 'i' } },
          { category: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  // Only return non-deleted products
  const query = { ...keyword, isDeleted: false };

  const count = await Product.countDocuments(query);
  const products = await Product.find(query)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.status(200).json({
    status: 'success',
    data: {
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    }
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ _id: req.params.id, isDeleted: false });
  if (!product) {
    return next(new AppError('Product not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { product }
  });
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = catchAsync(async (req, res, next) => {
  const product = new Product({
    ...req.body,
    user: req.user._id,
  });

  const createdProduct = await product.save();
  res.status(201).json({
    status: 'success',
    data: { product: createdProduct }
  });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ _id: req.params.id, isDeleted: false });

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: { product: updatedProduct }
  });
});

// @desc    Soft delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  product.isDeleted = true;
  await product.save();

  res.status(200).json({
    status: 'success',
    message: 'Product soft-deleted successfully'
  });
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = catchAsync(async (req, res, next) => {
  const { rating, comment } = req.body;

  const product = await Product.findOne({ _id: req.params.id, isDeleted: false });

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    return next(new AppError('Product already reviewed', 400));
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ status: 'success', message: 'Review added' });
});
