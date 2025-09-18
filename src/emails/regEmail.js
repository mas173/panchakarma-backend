const nodemailer = require("nodemailer");
const emailSchema = require("../models/email.schema");
const user = process.env._MAIL_USER;
const pass = process.env._MAIL_KEY;

const regEmail = async (patientEmail, name, patientId) => {
  const onboardingUrl = "panchakarma.in/patient/onboard";
  const supportEmail = "panchakarma@gmail.com";
  const contact = "+91 9876543210";
  const sub =
    "🎉 Your Panchakarma Registration is Complete  Here's Your Patient ID";

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
      to: patientEmail,
      subject: sub,
      text: `Your patient id is: ${patientId}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Panchakarma Registration</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f5f6fa; margin:0; padding:0;">
  <table align="center" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:20px;">
    <tr>
      <td align="center" style="padding:10px 0;">
        <!-- Add your logo here -->
        <img src="https://res.cloudinary.com/dj7jdqra0/image/upload/v1756805379/logo_f84dte.png" alt="Company Logo" width="120" style="margin-bottom:15px;">
      </td>
    </tr>
    <tr>
      <td style="padding:10px 20px; color:#333;">
        <h2 style="margin:0 0 10px;">🎉 Registration Successful</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>We are happy to inform you that your <strong>Panchakarma Registration</strong> is complete.</p>
        <p style="font-size:16px; margin:15px 0; padding:10px; background:#f0f4f8; border-radius:6px; text-align:center;">
          <strong>Patient ID: ${patientId}</strong>
        </p>
        <p>Please keep this ID safe. You will need it for future appointments and communication.</p>
        <h3 style="margin-top:20px;">Next Steps (Onboarding):</h3>
        <ul style="padding-left:18px; line-height:1.6;">
          <li>Login to the patient portal with your email or Patient ID.</li>
          <li>Complete your onboarding details (medical history, lifestyle, etc.).</li>
          <li>Book your first consultation with our practitioner.</li>
        </ul>
        <p style="text-align:center; margin:20px 0;">
          <a href=${onboardingUrl} style="background:#28a745; color:#fff; padding:10px 20px; border-radius:6px; text-decoration:none; font-weight:bold;">
            Start Onboarding
          </a>
        </p>
        <p>If you have any questions, reach us at <a href="mailto:${supportEmail}">${supportEmail}</a> or call ${contact}.</p>
        <p style="margin-top:20px;">Warm regards,<br><strong>panchakarma</strong></p>
      </td>
    </tr>
  </table>
</body>
</html>
`,
    });
  } catch (error) {}
};

module.exports = regEmail;
