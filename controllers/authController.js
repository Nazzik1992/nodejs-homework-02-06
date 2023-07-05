const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require('fs/promises');
const gravatar = require('gravatar');
const Jimp = require('jimp');
const { nanoid } = require('nanoid');

const { HttpError, sendEmail } = require('../helpers');
const { SECRET_KEY, BASE_URL } = process.env;


const { User } = require("../models/user");
const { ctrlWrapper } = require("../decoretors");

const avatarDir = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    res.status(409).json({ message: 'Email in use'});
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const userAvatar = gravatar.url(user, { s: '100', r: 'x', d: 'retro' }, true);
  const verificationCode = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL: userAvatar,
    verificationToken: verificationCode,
  });

  const verifyEmail = {
    to: email,
    subject: 'Verification email',
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationCode}">Click to verificate email</a>`,
  };

  await sendEmail(verifyEmail);

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
    throw HttpError(401, 'Email or password is wrong');
  }
  if (!user.verify) {
    throw HttpError(401, 'Email, not verified');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }
  const {_id: id, subscription} = user;
  const payload = {
    id
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(id, {token});
  res.json({token, user: { email, subscription}})
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, 'User not found');
  }
  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: '' });

  res.status(200).json({ message: 'Verification successful' });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404);
  }
  if (user.verify) {
    throw HttpError(400, 'Verification has already been passed');
  }

  const verifyEmail = {
    to: email,
    subject: 'Verification email',
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to verificate email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(200).json({ message: 'Verification email sent' });
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
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
  getCurrent: ctrlWrapper(getCurrent),
  logout:ctrlWrapper(logout),
  avatar: ctrlWrapper(avatar),
};