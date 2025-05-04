const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Or use 'Outlook', 'Yahoo', or your custom SMTP
  auth: {
    user: process.env.EMAIL_USER, // set in .env
    pass: process.env.EMAIL_PASS, // set in .env
  },
});

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"EventEase" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
