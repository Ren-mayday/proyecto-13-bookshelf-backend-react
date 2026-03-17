const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    favouriteGenres: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema, "users");
module.exports = User;
