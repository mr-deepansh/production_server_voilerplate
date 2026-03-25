import crypto from "crypto";

export const generateResetToken = () => {
  const rowToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rowToken).digest("hex");
  // const expiresIn = Date.now() + 10 * 60 * 1000; // 10 minutes
  return { rowToken, hashedToken };
};
