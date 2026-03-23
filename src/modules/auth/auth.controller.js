import apiResponse from "../../utils/apiResponse.js";
import * as authService from "./auth.service.js";

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(apiResponse.created(user, "User registered successfully"));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const token = await authService.login(email, password);
    res.json(apiResponse.success({ token }, "Login successful"));
  } catch (error) {
    next(error);
  }
};
