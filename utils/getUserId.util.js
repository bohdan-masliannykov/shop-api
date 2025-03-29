const getUserId = (req) => {
  const _id = req.user?._id;
  return _id || req.cookies.guestId;
};

export default getUserId;
