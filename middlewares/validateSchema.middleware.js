import { throwError } from "../utils/appError.util.js";

const validateUserSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) return throwError(400, error.details[0].message);
    next();
  };
};

export { validateUserSchema };
