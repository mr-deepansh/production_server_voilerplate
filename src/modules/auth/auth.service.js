import bcrypt from "bcrypt";
import { User } from "./auth.model.js";
import ApiError from "../../utils/apiError.js";

export const register = async ({
  firstName,
  lastName,
  email,
  username,
  password,
  confirmPassword,
}) => {};
export const login = async (identifier, password) => {};
