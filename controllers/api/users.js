const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const bcrypt = require('bcrypt');

module.exports = {
  create,
  login,
  checkToken 
};


async function login(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("User not found");
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) throw new Error("Incorrect password");
    const token = createJWT(user);
    if (!token) throw new Error("Token creation failed");
    res.json(token);
  } catch (error) {
    console.error(error);
    res.status(400).json("Bad Credentials");
  }
}

async function create(req, res) {
  try {
    const user = await User.create(req.body);
    const token = createJWT(user);
    res.json(token);
  } catch (err) {
    res.status(400).json(err);
  }
}

/*--- Helper Functions --*/

function createJWT(user) {
  return jwt.sign(
    // data payload
    { user },
    process.env.SECRET,
    { expiresIn: '24h' }
  );
}

function checkToken(req, res) {
  console.log('req.user', req.user);
  res.json(req.exp);
}