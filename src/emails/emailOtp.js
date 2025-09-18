const nodemailer = require("nodemailer");
const user = process.env._MAIL_USER;
const pass = process.env._MAIL_KEY;

const emailOtp = async (email, otp, subject) => {
  const sub = subject || "Your OTP Code"
  if (!email || !otp){
    console.log("otp fields are missing ")
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
      text: `Your OTP code is: ${otp}`,
      html: `<html>
  <body style="font-family: Arial, sans-serif; background-color: #f2f5f9; padding: 20px;">
    <div style="max-width: 420px; margin: auto; background: #ffffff; padding: 24px; border-radius: 12px; text-align: center; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      
      <!-- Header -->
      <h2 style="color: #2e7d32; margin-bottom: 10px;">Panchakarma</h2>
      <h3 style="color: #333; margin-top: 0;">One-Time Password (OTP)</h3>
      
      <!-- Instruction -->
      <p style="color: #555; font-size: 14px; margin-bottom: 20px;">
      
      </p>
      
      <!-- OTP Code -->
      <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #111; background: #f9fafb; padding: 12px 20px; border: 1px dashed #2e7d32; border-radius: 8px; display: inline-block; margin-bottom: 20px;">
        ${otp}
      </p>
      
 
    
      
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
      
      <!-- Security Note -->
      <small style="color: #888; font-size: 12px;">
        ⚠️ If you did not request this, please ignore this email.
      </small>
      
    </div>
  </body>
</html>`,
    });

} catch (error) {
  console.log("error in sending otp", error)
}
};


module.exports = emailOtp