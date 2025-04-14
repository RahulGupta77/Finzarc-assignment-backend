const { User } = require("../models");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).send("User created successfully");
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.username) {
      return res.status(409).send("Username already exists");
    }

    console.error("Registration error:", err.message);
    res.status(500).send("Something went wrong during registration");
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      throw new Error("User not Found");
    }

    const isPasswordCorrect = await user.validatePassword(password);
    if (!isPasswordCorrect) {
      throw new Error("Incorrect Password");
    }

    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 15 * 3600000),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(201).send("Login Successfull");
  } catch (err) {
    res.status(400).send("Invalid credentials");
    console.log(err.message);
  }
};

module.exports = {
  register,
  login,
};
