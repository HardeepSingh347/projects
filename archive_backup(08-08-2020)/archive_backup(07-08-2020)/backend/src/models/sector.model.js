const mongoose = require('mongoose');

const SectorSchema = new mongoose.Schema(
  {
    sector: {
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
SectorSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(error);
  } else {
    next();
  }
});

const Sector = mongoose.model('Sector', SectorSchema);

module.exports = Sector;
