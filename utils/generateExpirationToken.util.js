export const generateExpirationToken = () => {
  const data = crypto.randomBytes(32).toString("hex");
  const token = crypto.createHash("sha256").update(data).digest("hex");
  const expiritationDate = Date.now() + 24 * 60 * 60 * 1000;
  return { token, expiritationDate };
};
