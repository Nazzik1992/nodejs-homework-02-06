const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require('fs/promises');
const gravatar = require('gravatar');
const Jimp = require('jimp');

const { User } = require("../models/user");
const { ctrlWrapper } = require("../decoretors");

const { SECRET_KEY } = process.env;
const avatarDir = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    res.status(409).json({ message: 'Email in use'});
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email)
  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
  },
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
    res.status(401).json({ message: 'Email or password is wrong'});
  }
  const {_id: id, subscription} = user;
  const payload = {
    id
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(id, {token});
  res.json({token, user: { email, subscription}})
};

const getCurrent = async(req, res)=> {
  const {email, subscription} = req.user;

  res.json({
    email,
    subscription
      
  })
}

const logout = async(req, res)=> {
  const {_id} = req.user;
  await User.findByIdAndUpdate(_id, {token: ""});

  res.status(204).send();
}

const avatar = async (req, res) => {
  const { _id } = req.user;
  
  const { path: oldPath, originalname } = req.file;
  const filename = `${_id}_${originalname}`;

  const resultUpload = path.join(avatarDir, filename);
  await fs.rename(oldPath, resultUpload);

  const avatarURL = path.join("avatars", filename);

  const image = await Jimp.read(resultUpload);
  await image.resize(250, 250).writeAsync(resultUpload);

  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({ avatarURL });
}


module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout:ctrlWrapper(logout),
  avatar: ctrlWrapper(avatar),
};