const mongoose = require('mongoose');

const TypeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    colorCode: {
      type: String,
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
TypeSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(error);
  } else {
    next();
  }
});

const Type = mongoose.model('Type', TypeSchema);

module.exports = Type;
