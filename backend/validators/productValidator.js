import Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  images: Joi.array().items(Joi.string()).min(1).required(),
  brand: Joi.string().required(),
  category: Joi.string().required(),
  countInStock: Joi.number().integer().min(0).required(),
  description: Joi.string().required(),
});

export const reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().required(),
});
