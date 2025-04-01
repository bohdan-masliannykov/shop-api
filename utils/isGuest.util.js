export const isGuest = (userId) => {
  return typeof userId === "string" && userId.startsWith("guest_");
};
