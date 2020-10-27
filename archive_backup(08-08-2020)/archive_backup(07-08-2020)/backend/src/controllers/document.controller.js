const Document = require('../models/document.model');
const MailController = require('./mail.controller');
const multer = require('multer');
const path = require('path');
let fs = require('fs');

/**
 *
 * Upload Profile picture
 *
 */
let storage = multer.diskStorage({
  //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, './public/uploads/documents');
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
    req.fileName = file.originalname;
    req.fileType = file.originalname.split('.')[
      file.originalname.split('.').length - 1
    ];
    cb(null, tempFileName);
  },
});

let upload = multer({
  storage: storage,
}).single('document');

exports.createDocument = async (req, res) => {
  await upload(req, res, async function (err) {
    if (err) {
      return res.status(200).send({
        status: false,
        status_code: 200,
        error: err,
        error_fields: ['document'],
        message: 'Error in file size/extension.',
      });
    }
    var stats = fs.statSync('./public/uploads/documents/' + req.fileUrl);

    const body = req.body;
    body.tags = body.tags.split(',');
    body.tags = await body.tags.map((tag) => {
      return tag.trim();
    });
    body.url = 'documents/' + req.fileUrl;
    body.name = req.fileName;
    body.documentExtension = req.fileType;
    body.size = stats.size;
    body.uploadedBy = req.logged_in_user._id;
    body.permissions = [req.logged_in_user._id];
    body.period = {
      period: body.period,
      politicalParty: body.party,
    };

    const document = new Document(body);

    try {
      const data = await document.save();
      return res.status(200).send({
        status: true,
        status_code: 200,
        result: data,
        message: 'Document created successfully.',
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
        message: error.message
          ? error.message
          : 'Error while creating document.',
      });
    }
  });
};

exports.fetchDocuments = async (req, res) => {
  try {
    if (req.query.search == 'undefined') {
      return res.status(200).send({
        status: true,
        status_code: 200,
        result: [],
        message: 'documents fetched successfully',
      });
    }
    const options = {};
    let forDate = undefined;
    let start;
    let end;
    if (req.query.date != 'undefined') {
      forDate = new Date(req.query.date);
      start = forDate.setHours(0, 0, 0, 0);
      end = forDate.setHours(23, 59, 59, 999);
    }
    options.type = decodeURIComponent(req.query.docType);
    if (forDate != undefined) {
      options.createdAt = { $gte: start, $lte: end };
    }
    if (req.query.sector != 'undefined') {
      options.sector = decodeURIComponent(req.query.sector);
    }
    if (req.query.period != 'undefined') {
      options['period.period'] = decodeURIComponent(req.query.period);
    }

    let result;
    switch (req.logged_in_user.role) {
      case 0:
        result = await Document.find(options)
          .sort({ createdAt: -1 })
          .populate([
            { path: 'companyId' },
            { path: 'uploadedBy' },
            { path: 'permissions' },
          ]);
        break;
      case 1:
        options.companyId = req.logged_in_user.companyId;
        result = await Document.find(options)
          .sort({ createdAt: -1 })
          .populate([
            { path: 'companyId' },
            { path: 'uploadedBy' },
            { path: 'permissions' },
          ]);
        break;
      case 2:
        options.uploadedBy = req.logged_in_user._id;
        result = await Document.find(options)
          .sort({ createdAt: -1 })
          .populate([
            { path: 'companyId' },
            { path: 'uploadedBy' },
            { path: 'permissions' },
          ]);
        break;
      default:
        break;
    }

    if (!result) {
      throw new Error('Server Error Occured');
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: 'documents fetched successfully',
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error_msg: error.message,
    });
  }
};

exports.fetchSingleDocument = async (req, res) => {
  try {
    let result;
    switch (req.logged_in_user.role) {
      case 0:
        result = await Document.findById(req.params.id).populate([
          { path: 'companyId' },
          { path: 'uploadedBy' },
          { path: 'permissions' },
        ]);
        break;
      case 1:
        result = await Document.findOne({
          _id: req.params.id,
          companyId: req.logged_in_user.companyId,
        }).populate([
          { path: 'companyId' },
          { path: 'uploadedBy' },
          { path: 'permissions' },
        ]);
        break;
      case 2:
        result = await Document.findOne({
          _id: req.params.id,
          permissions: req.logged_in_user._id,
        }).populate([
          { path: 'companyId' },
          { path: 'uploadedBy' },
          { path: 'permissions' },
        ]);
        break;
      default:
        break;
    }
    if (!result) {
      throw new Error(
        "Document not found or you don't have permissions to access this document"
      );
    }

    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: 'Document details fetched successfully',
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error_msg: error.message,
    });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      throw new Error('Document not found');
    }

    document.documentType = req.body.documentType;

    const result = await document.save();
    if (!result) {
      throw new Error('Server error occured');
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: 'document updated.',
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: 'Error while updating document.',
    });
  }
};

exports.downloadDocument = async (req, res) => {
  try {
    const docId = req.params.id;
    const result = await Document.findById(docId);

    const file = path.resolve(__dirname, `../../public/uploads/${result.url}`);
    res.download(file);
  } catch (error) {
    console.log(error);
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: 'Error while downloading file.',
    });
  }
};

exports.grantPermission = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      throw new Error('Document not found');
    }
    req.body.users.map((user) => {
      document.permissions.push(user);
    });

    const result = await document.save();

    if (!result) {
      throw new Error('Server error occured');
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result: document,
      message: 'permission granted',
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error_msg: error.message,
    });
  }
};

exports.removePermission = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      throw new Error('Document not found');
    }
    document.permissions = document.permissions.map((user) => {
      if (user != req.body.user) {
        return user;
      }
    });
    const result = await document.save();

    if (!result) {
      throw new Error('server error occured');
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error_msg: error.message,
    });
  }
};
