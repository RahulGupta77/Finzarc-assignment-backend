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

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.username) {
      return res.status(409).json({ error: "Username already exists" });
    }

    console.error("Registration error:", err.message);
    res.status(500).json({ error: "Something went wrong during registration" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordCorrect = await user.validatePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 15 * 3600000),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
};
