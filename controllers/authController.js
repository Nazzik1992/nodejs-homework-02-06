const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/user");

const { HttpError } = require("../helpers");
const { ctrlWrapper } = require("../decoretors");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    res.status(409).json({ message: 'Email in use'});
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    password: newUser.password,
    email: newUser.email,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ message: 'Email or password is wrong'});
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    res.status(401);
  }
  const {_id: id} = user;
  const payload = {
    id
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(id, {token});
  res.json({
    token,
  });
};

const getCurrent = async(req, res)=> {
  const {email, password} = req.user;

  res.json({
    email,
    password
      
  })
}

const logout = async(req, res)=> {
  const {_id} = req.user;
  await User.findByIdAndUpdate(_id, {token: ""});

  res.json({
      message: "Logout success"
  })
}
module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout:ctrlWrapper(logout)
};