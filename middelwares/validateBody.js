const { HttpError } = require("../utils");

const validateBody = (schemas) => {
  const fn = (req, res, next) => {
    const { error } = schemas.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
    }
    next(error);
  };
  return fn;
};
module.exports = validateBody;