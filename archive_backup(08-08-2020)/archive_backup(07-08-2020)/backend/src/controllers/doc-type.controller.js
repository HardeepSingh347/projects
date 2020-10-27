const DocType = require('../models/doc-type.model');

exports.createDocType = async (req, res) => {
  try {
    const docType = new DocType(req.body);
    const result = await docType.save();

    if (!result) {
      throw new Error('server error occured');
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: 'Doc type created successfully',
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      error_msg: error.message,
    });
  }
};

exports.fetchDocTypes = async (req, res) => {
  try {
    const result = await DocType.find().sort({ createdAt: -1 });

    if (!result) {
      throw new Error('Server Error Occured');
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: 'Doc types fetched successfully',
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message ? error.message : 'Error while creating doc type.',
    });
  }
};

exports.fetchDocType = async (req, res) => {
  try {
    const result = await DocType.findById(req.params.id);

    if (!result) {
      throw new Error('Server Error Occured');
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: 'Doc type details fetched successfully',
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      error_msg: error.message,
    });
  }
};

exports.deleteDocType = async (req, res) => {
  try {
    const result = await DocType.deleteOne({ _id: req.params.id });

    if (!result) {
      throw new Error('Server error occured');
    }

    return res.status(200).send({
      status: true,
      status_code: 200,
      result: req.params.id,
      message: 'Doc type deleted successfully',
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      error_msg: error.message,
    });
  }
};

exports.updateDocType = async (req, res) => {
  try {
    const result = await DocType.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      req.body,
      {
        new: true,
      }
    );
    if (!result) {
      throw new Error('Server error occured');
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: 'Doc type updated successfully',
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error,
      message: error.message ? error.message : 'Error while creating doc type.',
    });
  }
};
