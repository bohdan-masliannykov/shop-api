import jws from "jsonwebtoken";

const userAuth = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    return res.status(401).json({ message: "Unauthorzied" });
  }

  try {
    const decoded = jws.verify(jwt, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token!" });
  }
};

export default userAuth;
