const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You don't have the required permissions!" });
    }
    next();
  };
};

export default verifyRole;
