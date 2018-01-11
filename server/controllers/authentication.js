const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

const generateUserToken = user => {
  const timestamp = new Date().getTime();
  // create jwt from user's id and secret string,
  // here sub - subject (user id string), iat - 'issued at time' (timestamp)
  return jwt.encode({ sub: user._id, iat: timestamp }, config.secret);
}

exports.signup = async (req, res, next) => {  
  const { email, password } = req.body;

  if (!email || !password) return res.status(422).json({error: 'Please provide email and password'});

  // Check if a user with given email exists
  const existingUser = await User.findOne({ email });

  // If a user with email does exist, return an error
  if (existingUser) return res.status(422).json({ error: 'Email is in use' });
  
  // If a user does not exist, create and save new user record
  const user = await new User({ email, password }).save();

  // Respond with JWT
  res.json({ token: generateUserToken(user) });
};


exports.signin = (req, res, next) => {
  // Users has already auth'd. Just give them a jwt-token
  res.json({ token: generateUserToken(req.user) });
}

// "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1YTU2MTRkMjk1Mjg5NzQ5N2M0N2I2MjEiLCJpYXQiOjE1MTU1OTA4NjY1ODJ9.Gb9h4KiQzsUVh2lhfMbNBEuawoxaLUg8OwP6EmCVq1s"