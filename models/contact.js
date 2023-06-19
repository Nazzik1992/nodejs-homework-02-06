const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../utils");
const Joi = require("joi");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `"name" is a required field`,
    "string.empty": `"name" cannot be an empty field`,
  }),
  email: Joi.string().required().messages({
    "any.required": `"email" is a required field`,
    "string.empty": `"email" cannot be an empty field`,
  }),
  phone: Joi.string().required().messages({
    "any.required": `"phone" is a required field`,
    "string.empty": `"phone" cannot be an empty field`,
  }),
  favorite: Joi.boolean()
});
const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required()
})
const schemas = {
    contactAddSchema,
    updateFavoriteSchema
}
const Contact = model("contact", contactSchema);

module.exports = {Contact, schemas };