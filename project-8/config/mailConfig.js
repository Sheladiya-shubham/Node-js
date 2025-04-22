const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false, 
  auth: {
    user: 'sheladiyashubham017@gmail.com',
    pass: "udzyttyuuyhwvxxm", 
  },
  tls: {
    rejectUnauthorized: false 
  }
});

// ✅ Fix: Export sendEmail function
const sendEmail = async function (receiverEmail, otp) {
  try {
    const info = await transporter.sendMail({
      from: 'sheladiyashubham017@gmail.com', 
      to: 'sheladiyashubham017@gmail.com',  // Now correctly using receiverEmail
      subject: "Reset Password OTP ✔",
      text: `Your reset password OTP is: ${otp}`,
      html: `<h3>Hello,</h3>
             <p>Your reset password OTP is: <strong>${otp}</strong></p>
             <p>This OTP is valid for 5 minutes.</p>
             <p>If you didn't request this, ignore this email.</p>`,
    });

    console.log("✅ OTP email sent successfully to:", receiverEmail);
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
  }
};

// ✅ Correctly export sendEmail
module.exports = sendEmail;
