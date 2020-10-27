const User = require('../models/user.model');
const DocType = require('../models/doc-type.model');

// Initial Seeder to create Admin
exports.initial_seeder = async (req, res) => {
  const body = {
    email: 'admin@mail.com',
    password: 'admin1234',
    firstname: 'DAS',
    lastname: 'Admin',
  };

  body.role = 0; // 0 - Admin
  const user = new User(body);

  try {
    const data = await user.save();

    return res.status(200).send({
      status: true,
      status_code: 200,
      data,
    });
  } catch (error) {
    let error_fields = [];
    if (error.hasOwnProperty('errors')) {
      for (let key in error.errors) {
        error_fields.push(key);
      }
    }

    return res.status(400).send({
      status: false,
      status_code: 400,
      error,
      error_fields,
    });
  }
};
// Initial Seeder to create Admin
exports.initial_folders = async (req, res) => {
  try {
    const data = await DocType.insertMany([
      {
        type: 'Speeches',
        colorCode: '#7F8C8D',
      },
      {
        type: 'Letters',
        colorCode: '#BDC3C7',
      },
      {
        type: 'Reports',
        colorCode: '#EB984E',
      },
      {
        type: 'Memos & Approvals',
        colorCode: '#F8C471',
      },
      {
        type: 'Publications & Op-Eds',
        colorCode: '#F4D03F',
      },
      {
        type: 'Studies',
        colorCode: '#F7DC6F',
      },
      {
        type: 'Proposals & Requests',
        colorCode: '#C4E272',
      },
      {
        type: 'Presentations',
        colorCode: '#58D68D',
      },
      {
        type: 'Social Calendar: Invitations etc',
        colorCode: '#85C1E9',
      },
      {
        type: 'Campaigns',
        colorCode: '#AF7FE9',
      },
      {
        type: 'Miscelleanous',
        colorCode: '#7F8C8D',
      },
    ]);

    return res.status(200).send({
      status: true,
      status_code: 200,
      data,
    });
  } catch (error) {
    return res.status(400).send({
      status: false,
      status_code: 400,
      error,
      error_fields,
    });
  }
};
