const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const DocumentSchema = new mongoose.Schema(
  {
    // document original name
    name: {
      type: String,
      required: true,
    },
    // document url
    url: {
      type: String,
    },
    // file extension png, jpg, mp3, mp4, pdf. for filters
    documentExtension: {
      type: String,
      required: true,
    },
    // two types of files public and classified
    documentType: {
      type: String,
      default: 'public',
    },
    // document size, for filters
    size: {
      type: String,
      required: true,
    },
    // category type of the document i.e speeches, letters, reports etc.
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Type",
      required: true,
    },
    // category sector(to which sector document belongs) i.e education, school, hospital etc.
    sector: {
      type: String,
      required: true,
    },
    // category period(to which time period document belongs) i.e senate Term One: 2011 – 2015, Senate Term Two: 2015 – 2019
    period: {
      type: {
        period: String,
        politicalParty: String
      },
      required: true,
    },
    // id of the compnay, to which this doc belongs
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    // id of the user, who uploaded the doc
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // id of the users, who have permission to access this file
    permissions: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      default: [],
    },
    // tags, so that admin can search doc easily
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

DocumentSchema.plugin(mongoose_delete);
DocumentSchema.plugin(beautifyUnique);

// Error handling
DocumentSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(error);
  } else {
    next();
  }
});

const Document = mongoose.model('Document', DocumentSchema);

module.exports = Document;
