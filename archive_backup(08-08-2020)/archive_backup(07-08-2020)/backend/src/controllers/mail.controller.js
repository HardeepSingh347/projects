const nodemailer = require('nodemailer');

const smtpTransport = nodemailer.createTransport({
  // ENV
  service: process.env.MAIL_SECRET_SERVICE,
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

sendMail = (to, subject, html) => {
  const mailOptions = {
    from: 'Trucker',
    to,
    subject,
    html,
  };
  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent: ' + response.message);
    }
  });
};

exports.send_otp = async (email, otp) => {
  const sub = 'Change Password';
  const text = `<p>You requested for a password reset, kindly use this otp ${otp}</p>`;

  sendMail(email, sub, text);
};

exports.account_suspend = async (data) => {
  const sub = 'Account Suspended';
  const text = `<p>${data.userName}, we wanted to inform you that, your account has been suspended by ${data.adminName}</p>`;

  sendMail(data.email, sub, text);
};
