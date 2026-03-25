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
  role,
}) => {

  if (password !== confirmPassword) {
    throw new ApiError.conflict("Passwords do not match");
  }
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError.conflict("User already exists");
  }
  const { rowToken, hashedToken } = generateResetToken();
  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    password,
    role,
    verificationToken: hashedToken,
  });
  // TODO: send verification email with rowToken

  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

export const login = async (identifier, password) => {};
