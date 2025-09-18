const nodemailer = require("nodemailer");
const emailSchema = require("../models/email.schema");
const user = process.env._MAIL_USER;
const pass = process.env._MAIL_KEY;

const clinicAdded = async (clinicName , branchCode , email , password, changeLink) => {
  const loginUrl = "panchakarma.in/department/login";
  const supportEmail = "panchakarma@gmail.com";
  const contact = "+91 9876543210";
  const sub =
    " clinic registered ";

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
      text: `Branch code: ${branchCode}`,
      html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Clinic Registered — Panchakarma</title>
</head>
<body style="font-family:Arial,Helvetica,sans-serif;background:#f7f9fc;padding:20px;margin:0;">
  <div style="max-width:500px;margin:auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.08);">
    
    <!-- Logo -->
    <div style="background:#f2f6ff;padding:16px;text-align:center;">
      <img src="https://res.cloudinary.com/dj7jdqra0/image/upload/v1756805379/logo_f84dte.png" alt="Panchakarma Logo" style="max-width:140px;height:auto;" />
    </div>

    <!-- Body -->
    <div style="padding:20px;color:#333;">
      <h2 style="margin:0 0 10px;font-size:18px;color:#1f3a93;">Clinic Registered 🎉</h2>
      <p>Hello <b>${clinicName}</b>, your clinic has been successfully registered on <b>Panchakarma</b>.</p>

      <div style="background:#f9f9f9;padding:12px;border:1px solid #eee;border-radius:6px;margin:14px 0;">
        <p><b>Branch ID:</b> ${branchCode}</p>
        <p><b>Login Email:</b> ${email}</p>
        <p><b>Temporary Password:</b> ${password}</p>
      </div>

      <p>🔒 Please <b>change your password</b> after your first login.</p>
      <a href="${changeLink}" style="display:inline-block;padding:10px 16px;background:#1f3a93;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">
        Change Password
      </a>
    </div>

    <!-- Footer -->
    <div style="padding:12px;text-align:center;font-size:12px;color:#777;background:#fafafa;">
      © ${new Date().getFullYear()} Panchakarma • All Rights Reserved
    </div>
  </div>
</body>
</html>

`,
    });
  } catch (error) {
    console.log(error)
    
  }
};

module.exports = clinicAdded;
