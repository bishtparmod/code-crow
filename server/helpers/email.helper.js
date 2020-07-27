var nodemailer = require("nodemailer");

const smtpTransport = nodemailer.createTransport({
  service: 'Code Crow Email',
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  },
  host: 'mail.codecrow.io'
});

exports.sendEmail = ({ $mailTo, $subject, $html }) => {
  const mailOptions = {
    to: $mailTo,
    subject: $subject,
    html: $html,
    from: process.env.EMAIL_ADDRESS
  }

  return new Promise((resolve, reject) => {
    smtpTransport.sendMail(mailOptions, function (error, response) {
      if (error) return reject(error)
      return resolve(response)
    });
  })
};

exports.sendEmailExpress = (req, res) => {
  const { name, email, subject, message } = req.body;
  exports.sendEmail({
    $mailTo: process.env.CODE_CROW_EMAIL,
    $subject: subject,
    $html: `
      <h3>Name: ${name}</h3>
      <h5>Email: ${email}</h5>
      <p>${message}</p>
    `
  })
    .then(info => res.status(200).json(info))
    .catch(error => res.status(500).json(error))
}