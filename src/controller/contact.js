const nodemailer = require("nodemailer");
const env = require("dotenv");
env.config();

//using nodemailer to send emails
const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

//sending email
exports.sendEmail = (req, res) => {
  const { name, email, msg } = req.body;

  var emailobj = {
    to: "MS_pvf83A@test-z0vklo6j2jvl7qrx.mlsender.net",
    from: "MS_pvf83A@test-z0vklo6j2jvl7qrx.mlsender.net",
    subject: "New Contact - Message",
    html: `<h3>Name: ${name}</h3> </br>
<h3>Email: ${email}</h3> </br>
<h3>Message: ${msg}</h3> </br>
`,
  };

  // send email asynchronously; log errors but don't block response
  try {
    transporter.sendMail(emailobj)
      .then((info) => {
        console.log("Contact email sent:", info?.response || info);
      })
      .catch((err) => {
        console.error("Error sending contact email:", err);
      });
  } catch (err) {
    console.error("Synchronous error creating email:", err);
  }

  // respond to client regardless of email outcome
  return res.status(200).json({ res: "Success!" });
};
