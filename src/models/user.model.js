const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "ThisIsSecretToken", {
    expiresIn: "18h",
  });

  return token;
};

userSchema.methods.validatePassword = async function (incomingPassword) {
  const user = this;
  const isPasswordCorrect = await bcrypt.compare(
    incomingPassword,
    user.password
  );
  return isPasswordCorrect;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
