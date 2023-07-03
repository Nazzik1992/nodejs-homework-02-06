const Joi = require("joi");


const contactAddSchema = Joi.object({
    name: Joi.string().required().messages({
      "any.required": `missing required 'name' field`,
      "string.empty": `"name" cannot be an empty field`,
    }),
    email: Joi.string().required().messages({
      "any.required": `missing required 'email' field`,
      "string.empty": `"email" cannot be an empty field`,
    }),
    phone: Joi.string().required().messages({
      "any.required": `missing required 'phone' field`,
      "string.empty": `"phone" cannot be an empty field`,
    }),
    favorite: Joi.boolean(),
    
  });
  const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required()
  })
  const schemas = {
      contactAddSchema,
      updateFavoriteSchema
  }
  module.exports = {schemas};