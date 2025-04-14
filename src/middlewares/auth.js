const jwt = require("jsonwebtoken");
const { User } = require("../models");

const userAuth = async (req, res, next) => {
  const cookies = req.cookies;

  try {
    const { token } = cookies;
    const decodedObj = await jwt.verify(token, "ThisIsSecretToken");
    const { _id } = decodedObj;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not Found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
};

module.exports = { userAuth };
