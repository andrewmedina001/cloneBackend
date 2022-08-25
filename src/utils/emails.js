import nodemailer from "nodemailer";

const client = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const validateEmail = async ({ recipient, name, lastname, token }) => {
  try {
    const result = await client.sendMail({
      from: process.env.EMAIL,
      to: recipient,
      subject: "Please confirm your email",
      text: `Hi ${name} ${lastname}, please confirm your email trough the following link: http://myfrontdotcom?token=${token}`,
    });
    console.log(result);
  } catch (error) {
    console.log("erroe en la validacion del Email")
    console.log(error.message);
  }
};

export const notifyNewPassword = async ({ recipient, name, lastname }) => {
  try {
    await client.sendMail({
      from: process.env.EMAIL,
      to: recipient,
      subject: "Password change request",
      html: `
            <h1>Password change request</h1>
            <p>Hi ${name} ${lastname}, your password was changed successfully.</p>
            </br>
            <h3>Regards,</h3>
            </br>
            <h3>EC App Team</h3>
            `,
    });
  } catch (error) {
    console.log(error.message);
  }
};
