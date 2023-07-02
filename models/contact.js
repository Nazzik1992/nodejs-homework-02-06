const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
      required: [true, 'Set email for contact'],
    },
    phone: {
      type: String,
      required: [true, 'Set phone for contact'],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `missing required 'name' field`,
    "string.empty": `'name' cannot be an empty field`,
  }),
  email: Joi.string().required().messages({
    "any.required": `missing required 'email' field`,
    "string.empty": `"email" cannot be an empty field`,
  }),
  phone: Joi.string().required().messages({
    "any.required": `missing required 'phone' field`,
    "string.empty": `'email' cannot be an empty field`,
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