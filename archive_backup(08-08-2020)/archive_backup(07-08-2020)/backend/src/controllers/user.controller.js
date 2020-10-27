const User = require("../models/user.model");
const Document = require("../models/document.model");
const MailController = require("./mail.controller");
const multer = require("multer");
const path = require("path");
let fs = require("fs");

/**
 *
 * Upload Profile picture
 *
 */
let storage = multer.diskStorage({
  //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/users");
  },
  filename: function (req, file, cb) {
    let datetimestamp = Date.now();
    const tempFileName =
      file.fieldname +
      "-" +
      datetimestamp +
      "." +
      file.originalname.split(".")[file.originalname.split(".").length - 1];
    req.fileUrl = tempFileName;
    // req.fileType = file.originalname.split('.')[file.originalname.split('.').length - 1];
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
    const fileMimeSplit = fileMime.split("/");
    if (fileMimeSplit[0] == "image") {
      cb(null, true);
    } else {
      cb(new Error("Please upload only jpg|jpeg|png"));
    }
  },
}).single("profile_image");

exports.createUser = async (req, res) => {
  await upload(req, res, async function (err) {
    if (err) {
      return res.status(200).send({
        status: false,
        status_code: 200,
        error: err,
        error_fields: ["profile_image"],
        message: "Error in file size/extension.",
      });
    }

    const body = req.body;
    body.createdBy = req.logged_in_user._id;
    body.profileImage = "users/" + req.fileUrl;
    const user = new User(body);

    try {
      const data = await user.save();
      return res.status(200).send({
        status: true,
        status_code: 200,
        result: data,
        message: "User created successfully.",
      });
    } catch (error) {
      let error_fields = [];
      if (error.hasOwnProperty("errors")) {
        for (let key in error.errors) {
          error_fields.push(key);
        }
      }
      return res.status(200).send({
        status: false,
        status_code: 400,
        error,
        error_fields,
        message: error.message ? error.message : "Error while creating user.",
      });
    }
  });
};

exports.fetchUsers = async (req, res) => {
  try {
    let result;
    switch (req.logged_in_user.role) {
      case 1:
        result = await User.find({
          companyId: req.logged_in_user.companyId,
          role: 2,
        })
          .sort({ createdAt: -1 })
          .populate({ path: "companyId" });
        break;
      default:
        result = await User.find({
          role: { $ne: 0 },
        })
          .sort({ createdAt: -1 })
          .populate({ path: "companyId" });
        break;
    }

    if (!result) {
      throw new Error("Server Error Occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "users fetched successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error_msg: error.message,
    });
  }
};

exports.fetchAdmins = async (req, res) => {
  try {
    const result = await User.find({
      deleted: false,
      role: 1,
    })
      .sort({ createdAt: -1 })
      .populate({ path: "companyId" });

    if (!result) {
      throw new Error("Server Error Occured");
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "admins fetched successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error_msg: error.message,
    });
  }
};

exports.fetchSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: "companyId",
    });

    if (!user) {
      throw new Error("user not found");
    }

    return res.status(200).send({
      status: true,
      status_code: 200,
      result: user,
      message: "User details fetched successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error_msg: error.message,
    });
  }
};

exports.banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new Error("user not found");
    }
    if (user.suspended) {
      throw new Error("Account is already banned");
    }

    user.banned = true;
    user.banned = req.logged_in_user._id;

    const result = await user.save();
    if (!result) {
      throw new Error("Server Error Occured");
    }
    // const data = {
    //   email: user.email,
    //   userName: user.firstname + ' ' + user.lastname,
    //   adminName:
    //     req.logged_in_user.firstname + ' ' + req.logged_in_user.lastname,
    // };
    // await MailController.account_suspend(data);
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "user banned successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error_msg: error.message,
    });
  }
};

exports.suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new Error("user not found");
    }
    if (user.deleted) {
      throw new Error("Account is already suspended");
    }

    user.deleted = true;

    const result = await user.save();
    if (!result) {
      throw new Error("Server Error Occured");
    }
    // const data = {
    //   email: user.email,
    //   userName: user.firstname + ' ' + user.lastname,
    //   adminName:
    //     req.logged_in_user.firstname + ' ' + req.logged_in_user.lastname,
    // };
    // await MailController.account_suspend(data);
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: "user suspended successfully",
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error_msg: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  await upload(req, res, async function (err) {
    if (err) {
      return res.status(200).send({
        status: false,
        status_code: 200,
        error: err,
        error_fields: ["profile_image"],
        message: "Error in file size/extension.",
      });
    }

    const body = req.body;
    let old_image = null;

    if (req.hasOwnProperty("fileUrl")) {
      const user = await User.findById(req.params.id);
      old_image = user.profileImage;
      body.profileImage = "users/" + req.fileUrl;
    }

    try {
      const result = await User.findOneAndUpdate({ _id: req.params.id }, body, {
        new: true,
      }).populate({ path: "companyId" });

      if (!result) {
        return res.status(200).send({
          status: false,
          status_code: 400,
          error: "No record found.",
          error_fields: [],
          message: "Error while updating user profile.",
        });
      }

      if (old_image != null) {
        let filePath = path.join(__dirname, "../../public/uploads/");
        filePath += old_image;
        if (filePath) {
          await fs.unlinkSync(filePath);
        }
      }

      return res.status(200).send({
        status: true,
        status_code: 200,
        result,
        message: "user profile updated.",
      });
    } catch (error) {
      let error_fields = [];
      if (error.hasOwnProperty("errors")) {
        for (let key in error.errors) {
          error_fields.push(key);
        }
      }

      return res.status(200).send({
        status: false,
        status_code: 400,
        error,
        error_fields,
        message: "Error while updating user.",
      });
    }
  });
};

// exports.grantAccess = async(req, res) => {
//   try {
//     const document = await Document.findOne({  })
//   } catch (error) {
//     return res.status(200).send({
//       status: false,
//       status_code: 400,
//       error_msg: error.message
//     })
//   }
// }
