import { throwError } from "../utils/appError.util.js";

const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return throwError(403, "You don't have the required permissions!");
    }
    next();
  };
};

export default verifyRole;
