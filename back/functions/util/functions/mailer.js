const nodemailer = require("nodemailer");
const { MAILER } = require('../constants/constant');

exports.onboardMail = async (receiver, inviteLink) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: MAILER.EMAIL,
      pass: MAILER.PASSWORD
    },
  });

  let info = await transporter.sendMail({
    from: MAILER.EMAIL, 
    to: receiver, 
    subject: "Platform invite link",
    text: "Hello! We are happy to welcome you to our comunity!",
    html: `<a href=${inviteLink}>Click here for redirect</a>`,
  });

  console.log("Message sent: %s", info.messageId);
}

exports.generatedLinkMail = async (receiver, link) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: MAILER.EMAIL,
        pass: MAILER.PASSWORD
      },
    });
  
    let info = await transporter.sendMail({
      from: MAILER.EMAIL, 
      to: receiver, 
      subject: "Platform link",
      text: "Hello! This is the link your clients will access to use our services!",
      html: `<a>${link}</a>`,
    });
  
    console.log("Message sent: %s", info.messageId);
  }