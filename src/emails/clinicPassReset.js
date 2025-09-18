const nodemailer = require("nodemailer");
const { LogoUrl, siteName, supportEmail } = require("../constants/constants");
const user = process.env._MAIL_USER;
const pass = process.env._MAIL_KEY;


const clinicpassReset = async (email,name,newPassword) => {
  const sub ="your passoword has been reset"
  if (!email ){
    console.log("email field is missing ")
    return
  };
try {
  
  // console.log(process.env._MAIL_USER ,process.env._MAIL_KEY)

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
      text: `temperory password: ${newPassword}`,
      html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>New Password</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.06);">
          
          <!-- Logo -->
          <tr>
            <td style="padding:24px;border-bottom:1px solid #e5e7eb;text-align:left;">
              <img src="${LogoUrl}" alt="${siteName} logo" width="140" style="display:block;border:0;outline:0;">
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px;">
              <h1 style="margin:0 0 12px;font-size:20px;color:#111827;">Your new password</h1>
              <p style="margin:0 0 16px;color:#4b5563;line-height:1.5;">
                Hi ${name || 'there'},<br>
                Your password has been reset. Please use the password below to log in to your ${siteName} account.
              </p>

              <!-- New password box -->
              <div style="margin:18px 0;padding:14px 20px;background:#f3f4f6;border-radius:6px;font-weight:600;font-size:16px;color:#111827;text-align:center;letter-spacing:1px;">
                ${newPassword}
              </div>

              <p style="margin:0 0 16px;color:#4b5563;line-height:1.5;">
                ⚠️ For security reasons, we strongly recommend that you <b>change this password immediately</b> after logging in.
              </p>

              <p style="margin:0 0 12px;color:#6b7280;font-size:13px;line-height:1.5;">
                If you didn’t request this reset, please contact our support team right away: 
                <a href="mailto:${supportEmail}" style="color:#2563eb;text-decoration:underline;">${supportEmail}</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 24px;background:#fafafa;border-top:1px solid #e5e7eb;text-align:center;font-size:13px;color:#9ca3af;">
              <div>${siteName} • All rights reserved</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
    });

} catch (error) {
  console.log("error in sending otp", error)
}
};


module.exports = clinicpassReset