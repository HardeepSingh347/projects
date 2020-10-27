const Otp = require('../models/otp.model');
const otpGenerator = require('otp-generator');

exports.createOtp = async (userId) => {
  try {
    const otpData = {
      userId,
      otp: otpGenerator.generate(6, {
        alphabets: false,
        upperCase: false,
        specialChars: false,
      }),
    };

    const otp = new Otp(otpData);
    const result = await otp.save();

    if (!result) {
      throw new Error('Server error occured');
    }

    return result;
  } catch (error) {
    return {
      error_msg: error.message,
    };
  }
};

exports.validateOtp = async (req, res) => {
  try {
    const otp = await Otp.findOne({ _id: req.body.otpId, otp: req.body.otp });
    if (!otp) {
      throw new Error('Invalid otp, please enter a valid otp');
    }
    if (otp.expired) {
      throw new Error('This otp has been expired, please try with a new otp');
    }
    otp.expired = true;
    const result = await otp.save();

    if (!result) {
      throw new Error('Server error occured');
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result: otp.userId,
      message: 'otp validation successfull',
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error_msg: error.message,
    });
  }
};
