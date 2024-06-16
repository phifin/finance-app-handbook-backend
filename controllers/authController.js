const jwt = require("jsonwebtoken");
const User = require("../models/Users");

const createToken = (user, secret, expiresIn) => {
  return jwt.sign({ id: user._id, username: user.username }, secret, {
    expiresIn,
  });
};

exports.register = async (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, password });
  await newUser.save();
  console.log(`User ${username} has been registered.`);
  res.status(201).send("User registered");
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).send("Invalid username or password");
  }

  const accessToken = createToken(user, process.env.ACCESS_TOKEN_SECRET, "15m");
  const refreshToken = createToken(
    user,
    process.env.REFRESH_TOKEN_SECRET,
    "7d"
  );

  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
  res.json({ accessToken, refreshToken }); // Trả về cả accessToken và refreshToken
};

exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).send("No refresh token");

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid refresh token");
    const newAccessToken = createToken(
      user,
      process.env.ACCESS_TOKEN_SECRET,
      "15m"
    );
    res.json({ accessToken: newAccessToken });
  });
};
