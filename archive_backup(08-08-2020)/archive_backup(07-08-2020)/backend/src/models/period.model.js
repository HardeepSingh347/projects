const mongoose = require('mongoose');

const PeriodSchema = new mongoose.Schema(
  {
    period: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Error handling
PeriodSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(error);
  } else {
    next();
  }
});

const Period = mongoose.model('Period', PeriodSchema);

module.exports = Period;
