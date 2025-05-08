    const nodemailer = require("nodemailer");

    // Set up the Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sheladiyashubham017@gmail.com",  // Your Gmail address
        pass: "udzyttyuuyhwvxxm",               // Your Gmail App Password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const sendMail = async (to, subject, html) => {
      try {
        await transporter.sendMail({
          from: '"Admin Team" <sheladiyashubham017@gmail.com>',
          to:'sheladiyashubham017@gmail.com', // Recipient email address
          subject,   // Subject line
          html,      // HTML body content
        });
        console.log(`✅ Email sent to: ${to}`);
      } catch (error) {
        console.error("❌ Error sending email:", error.message);
      }
    };

    // Export the sendMail function
    module.exports = sendMail;
