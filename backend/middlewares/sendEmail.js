const nodeMailer = require("nodemailer");

exports.sendEmail = async (options) => {
  //   const transpoter = nodeMailer.createTransport({
  //     host: process.env.SMPT_HOST,
  //     port: process.env.SMPT_PORT,
  //     auth: {
  //       user: process.env.SMPT_MAIL,
  //       pass: process.env.SMPT_PASSWORD,
  //     },
  //     service: process.env.SMPT_SERVICE,
  //   });

  var transporter = nodeMailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "f6a425b54342fe",
      pass: "e9d1e2d36c7816",
    },
  });

  const mailOptions = {
    from: "pramodbhoite143@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};
