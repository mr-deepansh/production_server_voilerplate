import bcrypt from "bcrypt";
import { User } from "./auth.model.js";
import ApiError from "../../utils/apiError.js";
import { generateResetToken } from "../../utils/jwt.utils.js";

export const register = async ({
  firstName,
  lastName,
  email,
  username,
  password,
  confirmPassword,
}) => {
  if (password !== confirmPassword) {
    throw ApiError.conflict("Passwords do not match");
  }
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw ApiError.conflict("User already exists");
  }
  const { rawToken, hashedToken } = generateResetToken();
  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    password,
    verificationToken: hashedToken,
  });
  // TODO: send verification email with rowToken

  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

export const login = async (identifier, password) => {};
