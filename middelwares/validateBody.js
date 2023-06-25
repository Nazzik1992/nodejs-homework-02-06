const { HttpError } = require("../utils");

const validateBody = schema => {
  const fn = (req, res, next) => {
    console.log(req.method);
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      if (req.method === 'PATCH') {
        res.status(400).json({ message: 'missing field favorite'});
      }
      res.status(400).json({ message: 'missing field'});
    }
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json(error.message);
    }

    next(error);
  };
  return fn;
};
module.exports = validateBody;