const login = (req, res, next) => {
  res.json({ message: "Login" });
};

const logout = (req, res, next) => {
  res.json({ message: "Logout" });
};

const register = (req, res, next) => {
  res.json({ message: "Register" });
};

export default {
  login,
  logout,
  register,
};
