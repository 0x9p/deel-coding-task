const { StatusCodes } = require("http-status-codes");
const { validationResult } = require("express-validator");

const validateRequest = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }

  next();
};

module.exports = { validateRequest };
