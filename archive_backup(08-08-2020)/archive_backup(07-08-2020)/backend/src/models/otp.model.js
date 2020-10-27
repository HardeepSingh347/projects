const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema(
  {
    otp: {
      type: Number,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    expired: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Error handling
OtpSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(error);
  } else {
    next();
  }
});

const Otp = mongoose.model('Otp', OtpSchema);

module.exports = Otp;
