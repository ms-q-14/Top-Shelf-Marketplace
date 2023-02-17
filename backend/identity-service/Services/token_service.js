const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign({ user }, process.env.TOKEN_KEY, { expiresIn: "20m" });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ user }, process.env.REFRESH_TOKEN_KEY);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
