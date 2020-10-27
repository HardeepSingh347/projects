const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: Number, // 0 owner, 1 admin, 2 user
    },
    profileImage: {
      type: String,
      default: null,
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    status: {
      type: Number,
      default: 1 // 1 active, 0 deactive or banned(if banned it can be reactivate), -1 suspended 
    },
    banned: {
      type: Boolean,
      default: false,
    },
    bannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(mongoose_delete);
UserSchema.plugin(beautifyUnique);

// Error handling
UserSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(error);
  } else {
    next();
  }
});

// To hash password before saving a user into database
UserSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8); // Here 8 is no of rounds
  }
  next();
});

// To remove password and tokens from user data before sending reaponse to client
UserSchema.methods.toClean = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.__v;
  delete userObject.tokens;

  return userObject;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
