// backend/src/modules/auth/auth.model.js
import mongoose from "mongoose";
import { maxLength, minLength } from "zod";

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
		trim: true,
		minLength: 5,
		maxLength: 50,
	},
	lastName: {
		type: String,
		required: true,
		trim: true,
		minLength: 5,
		maxLength: 50,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
		index: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
		minlength: 5,
		maxlength: 20,
		index: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
		select: false,
	},
	role: {
		type: String,
		enum: ["user", "admin", "moderator"],
		default: "user",
	}, isEmailVerified: {
		type: Boolean,
		default: false,
	},
	loginAttempts: {
		type: Number,
		default: 0,
	},
	lockUntil: {
		type: Date,
		default: null,
	},
	passwordChangedAt: {
		type: Date,
	},
},
	{
		timestamps: true
	}
);

export const User = mongoose.model("User", userSchema);