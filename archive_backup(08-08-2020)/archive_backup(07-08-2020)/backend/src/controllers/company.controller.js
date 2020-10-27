const Company = require('../models/company.model');

exports.createCompany = async (req, res) => {
  try {
    const company = new Company(req.body);
    const result = await company.save();

    if (!result) {
      throw new Error('server error occured');
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: 'Company created successfully',
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error_msg: error.message,
    });
  }
};

exports.fetchCompanies = async (req, res) => {
  try {
    const result = await Company.find({
      deleted: false,
    }).sort({ createdAt: -1 });

    if (!result) {
      throw new Error('Server Error Occured');
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: 'Companies fetched successfully',
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
      message: error.message ? error.message : 'Error while creating company.',
    });
  }
};

exports.fetchCompany = async (req, res) => {
  try {
    const result = await Company.findById(req.params.id);

    if (!result) {
      throw new Error('Server Error Occured');
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: 'Company details fetched successfully',
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error_msg: error.message,
    });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const result = await Company.deleteById(req.params.id);

    if (!result) {
      throw new Error('Server error occured');
    }

    return res.status(200).send({
      status: true,
      status_code: 200,
      result: req.params.id,
      message: 'Company deleted successfully',
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      status_code: 400,
      error_msg: error.message,
    });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const result = await Company.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      req.body,
      {
        new: true
      }
    );
    if (!result) {
      throw new Error('Server error occured');
    }
    return res.status(200).send({
      status: true,
      status_code: 200,
      result,
      message: 'Company updated successfully',
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
      message: error.message ? error.message : 'Error while creating company.',
    });
  }
};
