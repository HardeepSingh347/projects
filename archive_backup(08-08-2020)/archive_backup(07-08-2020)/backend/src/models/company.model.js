const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    companyId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
  },
  {
    timestamps: true,
  }
);

CompanySchema.plugin(mongoose_delete);
CompanySchema.plugin(beautifyUnique);

// Error handling
CompanySchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(error);
  } else {
    next();
  }
});

const Company = mongoose.model('Company', CompanySchema);

module.exports = Company;
