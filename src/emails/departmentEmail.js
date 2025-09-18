const nodemailer = require("nodemailer");
const emailSchema = require("../models/email.schema");
const user = process.env._MAIL_USER;
const pass = process.env._MAIL_KEY;

const departmentEmail = async (name,email, password, userID) => {
  const loginUrl = "panchakarma.in/department/login";
  const supportEmail = "panchakarma@gmail.com";
  const contact = "+91 9876543210";
  const sub =
    " Department Registration is Complete ";

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: user,
        pass: pass,
      },
    });

    const info = await transporter.sendMail({
      from: `panchakarma <${`panchakarma@gmail.com`}>`,
      to: email,
      subject: sub,
      text: `userId: ${userID}`,
      html: `<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; background:#f9fafb; padding:20px;">
    <div style="max-width:500px; margin:auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:8px; padding:20px;">
      <h2 style="margin-top:0; color:#111827;">Department Account Created</h2>
      <p>Hello ${name},</p>
      <p>Your account has been created. Use the following credentials to log in:</p>

      <p style="background:#f3f4f6; padding:10px; border-radius:6px; border:1px solid #d1d5db;">
        <strong>userId:</strong> ${userID} <br>
        <strong>Password:</strong> ${password}
      </p>

      <p>Please log in and change your password immediately for security.</p>

      <p>
        <a href=${loginUrl} style="display:inline-block; background:#2563eb; color:#ffffff; text-decoration:none; padding:10px 16px; border-radius:6px;">
          Login to Dashboard
        </a>
      </p>

      <p style="font-size:12px; color:#6b7280; margin-top:20px;">
        If you didn’t request this account, please contact us at ${supportEmail}.
      </p>
    </div>
  </body>
</html>

`,
    });
  } catch (error) {}
};

module.exports = departmentEmail;
