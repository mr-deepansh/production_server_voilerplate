import { z } from "zod";
import {
  emailSchema,
  usernameSchema,
  firstNameSchema,
  lastNameSchema,
  passwordSchema,
  confirmPasswordSchema,
} from "../../common/schemas/field.schemas.js";

export const registerSchema = z
  .object({
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  identifier: z
    .string({ required_error: "Email or username is required" })
    .trim()
    .min(3, "Email or username is too short"),
  password: z.string({ required_error: "Password is required" }).min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string({ required_error: "Reset token is required" }).min(1),
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
