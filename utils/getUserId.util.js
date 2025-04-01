import jws from "jsonwebtoken";

const getUserId = (req) => {
  const { jwt } = req.cookies;
  if (jwt) {
    const { userId } = jws.decode(jwt);
    return userId;
  }

  return req.cookies.guestId;
};

export default getUserId;
