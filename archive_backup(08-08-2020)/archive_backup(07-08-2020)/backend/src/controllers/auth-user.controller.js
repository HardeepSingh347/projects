const User = require('../models/user.model');
const multer = require('multer');
const path = require('path');
let fs = require('fs');
const otpController = require('./otp.controller');
const mailController = require('./mail.controller');
const bcrypt = require('bcryptjs');

/**
 *
 * Upload Profile picture
 *
 */
let storage = multer.diskStorage({
  //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, './public/uploads/users');
  },
  filename: function (req, file, cb) {
    let datetimestamp = Date.now();
    const tempFileName =
      file.fieldname +
      '-' +
      datetimestamp +
      '.' +
      file.originalname.split('.')[file.originalname.split('.').length - 1];
    req.fileUrl = tempFileName;
    cb(null, tempFileName);
  },
});

let upload = multer({
  storage: storage,
  limits: {
    fileSize: 2097152, // in bytes 2MB
  },
  onFileUploadStart: function (file) {
    const fileMime = file.mimetype;
    const fileMimeSplit = fileMime.split('/');
    if (fileMimeSplit[0] == 'image') {
      cb(null, true);
    } else {
      cb(new Error('Please upload only jpg|jpeg|png'));
    }
  },
}).single('profile_image');

exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.logged_in_user._id);
    if (!user) {
      throw new Error('user not found');
    }
    if (user.suspended) {
      throw new Error('Sorry Your account has been suspended.');
    }
    const isMatch = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );
    if (!isMatch) {
      throw new Error(
        'Current password is not valid, please enter correct password'
      );
    }

    user.password = req.body.newPassword;

    const result = await user.save();
    if (!result) {
      throw new Error('Server error occured');
    }

    return res.status(200).send({
      status: true,
      status_code: 200,
      result: user._id,
      message: 'password changed successfully',
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error_msg: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error('this email is not linked with any account');
    }
    if (user.suspended) {
      throw new Error('Your account has been suspended');
    }
    const otpDetails = await otpController.createOtp(user._id);

    if (!otpDetails) {
      throw new Error('Server error occured');
    }
    await mailController.send_otp(req.body.email, otpDetails.otp);
    return res.status(200).send({
      status: true,
      status_code: 200,
      result: otpDetails._id,
      message: 'Please check your email for otp',
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error_msg: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      throw new Error('user not find');
    }

    if (user.suspended) {
      throw new Error('Your account has been suspended');
    }

    user.password = req.body.password;
    const result = await user.save();

    if (!result) {
      throw new Error('Server error occured, please try again');
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: 'password has been reset successfully',
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error_msg: error.message,
    });
  }
};

// Update user profile
exports.updateUser = async (req, res) => {
  await upload(req, res, async function (err) {
    if (err) {
      return res.status(200).send({
        status: false,
        status_code: 200,
        error: err,
        error_fields: ['profile_image'],
        message: 'Error in file size/extension.',
      });
    }

    const body = req.body;
    let old_image = null;

    if (req.hasOwnProperty('fileUrl')) {
      const user = await User.findById(req.logged_in_user._id);
      old_image = user.profileImage;
      body.profileImage = 'users/' + req.fileUrl;
    }

    try {
      const result = await User.findOneAndUpdate(
        { _id: req.logged_in_user._id },
        body,
        {
          new: true,
        }
      );

      if (!result) {
        return res.status(200).send({
          status: false,
          status_code: 400,
          error: 'No record found.',
          error_fields: [],
          message: 'Error while updating user profile.',
        });
      }

      if (old_image != null) {
        let filePath = path.join(__dirname, '../../public/uploads/');
        filePath += old_image;
        await fs.unlinkSync(filePath);
      }

      return res.status(200).send({
        status: true,
        status_code: 200,
        result,
        message: 'user profile updated.',
      });
    } catch (error) {
      let error_fields = [];
      if (error.hasOwnProperty('errors')) {
        for (let key in error.errors) {
          error_fields.push(key);
        }
      }

      return res.status(200).send({
        status: false,
        status_code: 400,
        error,
        error_fields,
        message: 'Error while updating user.',
      });
    }
  });
};

exports.fetchProfile = async (req, res) => {
  try {
    const user = req.logged_in_user;
    if (!user) {
      throw new Error('User not found');
    }
    if (user.suspended) {
      throw new Error('Your account has been suspended');
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result: user,
      message: 'user profile fetched successfully',
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error_msg: error.message,
    });
  }
};
