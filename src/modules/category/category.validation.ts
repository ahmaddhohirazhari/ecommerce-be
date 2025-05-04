import Joi from 'joi';

export const categoryValidationScheme = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Product name is required',
    'string.base': 'Product name must be a string',
    'string.empty': 'Product name cannot be empty',
  }),
});
