const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  product: Joi.object({
    name: Joi.string().min(3).max(200).required(),
    description: Joi.string().max(2000).required(),
    price: Joi.number().positive().required(),
    category_id: Joi.string().uuid().required(),
    brand: Joi.string().max(100).required(),
    stock_quantity: Joi.number().integer().min(0).required(),
    images: Joi.array().items(Joi.string().uri()).max(10),
    specifications: Joi.object(),
    weight: Joi.number().positive(),
    dimensions: Joi.object({
      length: Joi.number().positive(),
      width: Joi.number().positive(),
      height: Joi.number().positive()
    })
  }),

  category: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500),
    parent_id: Joi.string().uuid().allow(null)
  }),

  address: Joi.object({
    type: Joi.string().valid('home', 'work', 'other').required(),
    street: Joi.string().max(200).required(),
    city: Joi.string().max(100).required(),
    state: Joi.string().max(100).required(),
    postal_code: Joi.string().max(20).required(),
    country: Joi.string().max(100).required(),
    is_default: Joi.boolean()
  }),

  review: Joi.object({
    product_id: Joi.string().uuid().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().max(1000),
    title: Joi.string().max(200)
  })
};

module.exports = {
  validateRequest,
  schemas
};