// const User = require("../models/users.model");

exports.get_stats = async (req, res) => {
  try {
    res.status(200).send({
      status: true,
      status_code: 200,
      stats: {
        users: 5,
      },
    });
  } catch (error) {
    res.status(200).send({
      status: false,
      status_code: 400,
      error: {
        users: 0,
        properties: 0,
        payments: 0,
      },
      message: 'Error - While fetching stats.',
    });
  }
};

exports.test_api = async (req, res) => {
  res.status(200).send({
    status: true,
    status_code: 200,
    message: 'This is testing route.',
  });
};
