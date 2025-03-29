import jws from "jsonwebtoken";
import { throwError } from "../utils/appError.util.js";

const verifyToken = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    return throwError(401, "Unauthorzied");
  }

  try {
    const decoded = jws.verify(jwt, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return throwError(403, "Invalid or expired token!");
  }
};

export default verifyToken;
