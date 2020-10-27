const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.auth_user_login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email });
    if (user == null) {
      throw new Error('Email/Password combination is invalid.');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Email/Password combination is invalid.');
    }

    if (user.deleted) {
      throw new Error('Sorry Your account has been suspended.');
    }
    if (user.banned) {
      throw new Error('Sorry Your account has been banned temporarily.');
    }

    // Generate JWT token
    const token = await jwt.sign(
      { _id: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXP }
    );

    res_user = user.toClean();
    res_user.token = token;
    return res.status(200).send({
      status: true,
      status_code: 200,
      user: res_user,
    });
  } catch (e) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error_msg: e.message,
    });
  }
};
