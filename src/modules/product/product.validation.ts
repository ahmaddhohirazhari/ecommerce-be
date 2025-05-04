import Joi from 'joi';

export const productValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Product name is required',
    'string.base': 'Product name must be a string',
    'string.empty': 'Product name cannot be empty',
  }),
  description: Joi.string().required().messages({
    'any.required': 'Description is required',
    'string.base': 'Description must be a string',
  }),
  price: Joi.number().required().positive().messages({
    'any.required': 'Price is required',
    'number.base': 'Price must be a number',
    'number.positive': 'Price must be a positive number',
  }),
  stock: Joi.number().integer().min(0).required().messages({
    'any.required': 'Stock quantity is required',
    'number.base': 'Stock must be a number',
    'number.integer': 'Stock must be an integer',
    'number.min': 'Stock cannot be negative',
  }),
  image_url: Joi.string().uri().messages({
    'string.uri': 'Image URL must be a valid URI',
    'string.base': 'Image URL must be a string',
  }),
  category_id: Joi.string()
    .guid({
      version: ['uuidv4'],
    })
    .required()
    .messages({
      'any.required': 'Category ID is required',
      'string.guid': 'Category ID must be a valid UUID',
      'string.base': 'Category ID must be a string',
    }),
});
