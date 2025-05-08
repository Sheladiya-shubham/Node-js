const Admin = require("../model/admin.model");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Manager = require("../model/manager.model");
const Employee = require("../model/employee.model");
const sendMail = require("../config/sendMail");


// Register Admin
exports.registerAdmin = async (req, res) => {
  try {
    const { firstname, lastname, email, password, gender } = req.body;
    let imagePath = "";
    let admin = await Admin.findOne({ email: email, isDelete: false });
    if (admin) {
      return res.status(400).json({ message: "Admin Already Exist" });
    }

    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }
    let hashPassword = await bcrypt.hash(password, 10);
    admin = await Admin.create({
      firstname,
      lastname,
      email,
      password: hashPassword,
      gender,
      profileImage: imagePath,
    });

    return res.status(201).json({ message: "Admin Register Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login Admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    let admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    let matchPass = await bcrypt.compare(password, admin.password);
    if (!matchPass) {
      return res.status(400).json({ message: "Password is not matched" });
    }
    let payload = {
      adminId: admin._id,
    };
    let token = await jwt.sign(payload, "admin");
    return res
      .status(200)
      .json({ message: "Admin Login Success", adminToken: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.adminForgotPassword = async (req, res) => {
  try {
    if (!req.body || !req.body.email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const { email } = req.body;

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Generate a simple reset token
    const resetToken = `${Math.random().toString(36).substring(2)}${Date.now()}`;
    const resetTokenExpiry = Date.now() + 3600000;

    // Save token
    admin.resetToken = resetToken;
    admin.resetTokenExpiry = resetTokenExpiry;
    await admin.save();

    // Prepare reset link
    const resetLink = `http://localhost:9000/admin/reset-password/${resetToken}`;

    // ✅ Use your sendMail wrapper here
    await sendMail(
      email,
      "Admin Reset Password",
      `<p>Reset your password: <a href="${resetLink}">${resetLink}</a></p>`
    );

    res.status(200).json({ message: "Reset link sent to Admin's email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.adminResetPassword = async (req, res) => {
  try {
    let { id } = req.params;
    const { new_pass, confirm_pass } = req.body;

    id = id.trim(); // 🧼 Remove accidental spaces or line breaks!

    if (!new_pass || !confirm_pass) {
      return res.status(400).json({ message: "Both password fields are required" });
    }

    if (new_pass !== confirm_pass) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const hashedPassword = await bcrypt.hash(new_pass, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// Admin Profile
exports.myProfile = async (req, res) => {
  try {
    // Make sure req.user is available and has adminId (from JWT)
    const adminId = req.user?.adminId;
    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Fetch the full admin profile from DB (not just token data)
    const admin = await Admin.findById(adminId).select('-password');
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json({ message: "Profile fetched successfully", data: admin });
  } catch (error) {
    console.error("Profile Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Admin Change-password
exports.changePassword = async (req, res) => {
  try {
    const { current_pass, new_pass, confirm_pass } = req.body;
    let admin = req.user;
    let matchPass = await bcrypt.compare(current_pass, admin.password);
    if (!matchPass) {
      return res
        .status(400)
        .json({ message: "Current password is not matched" });
    }
    if (current_pass == new_pass) {
      return res
        .status(400)
        .json({ message: "Current password and New password is matched" });
    }
    if (new_pass != confirm_pass) {
      return res
        .status(400)
        .json({ message: "New password and Confirm password is not matched" });
    }

    let hashPassword = await bcrypt.hash(new_pass, 10);
    admin = await Admin.findByIdAndUpdate(
      admin._id,
      { password: hashPassword },
      { new: true }
    );

    return res.status(200).json({ message: "Password Change Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addManager = async (req, res) => {
  try {
    let { firstname, lastname, email, password, gender, profileImage } = req.body;

    const plainPassword = password; // Save plain password before hashing

    // Check if manager already exists
    let manager = await Manager.findOne({ email, isDelete: false });
    if (manager) {
      return res.status(400).json({ message: "Manager already exists" });
    }

    // Handle profile image
    if (req.file) {
      profileImage = `/uploads/${req.file.filename}`;
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create manager in the database
    manager = await Manager.create({
      firstname,
      lastname,
      email,
      gender,
      password: hashPassword,
      profileImage,
    });

    // Prepare the email content
    const subject = "Your Manager Account Credentials";
    const html = `
      <h2>Welcome, ${firstname}!</h2>
      <p>Your manager account has been successfully created by the admin.</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${plainPassword}</p>
      <p>Please log in and change your password immediately for security purposes.</p>
      <p>Regards,<br>Admin Team</p>
    `;

    // Send the email with the plain password
    await sendMail (email, subject, html);

    return res.status(201).json({ message: "Manager added and email sent successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.viewAllManager = async (req, res) => {
  try {
    let managers = await Manager.find({ isDelete: false });
    res.cookie("hello", "admin");
    res.cookie("hello1", "admin");
    return res
      .status(200)
      .json({ message: "All Manager Fetch Success", data: managers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteManager = async (req, res) => {
  try {
    let id = req.params.id;
    let manager = await Manager.findOne({ _id: id, isDelete: false });
    if (!manager) {
      return res.status(404).json({ message: "Manager Not Found" });
    }
    manager = await Manager.findByIdAndUpdate(
      id,
      { isDelete: true },
      { new: true }
    );
    return res.status(200).json({ message: "Delete Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.activateManager = async (req, res) => {
  try {
    let id = req.params.id;
    // let manager = await Manager.findOne({ _id: id, isDelete: true });
    // if (!manager) {
    //   return res.status(404).json({ message: "Manager Not Found || Manager already Activated" });
    // }
    let manager = await Manager.findById(id);
    if(!manager){
      return res.status(404).json({ message: "Manager Not Found" });
    }
    if(manager.isDelete == false){
      return res.status(404).json({ message: "Manager already Activated" });
    }
    manager = await Manager.findByIdAndUpdate(
      id,
      { isDelete: false },
      { new: true }
    );
    return res.status(200).json({ message: "Manager is Activated Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.updateAdminProfile = async (req, res) => {
  try {
    const admin = req.user; // comes from verifyAdminToken middleware
    const { firstname, lastname, email, gender } = req.body;

    let updatedData = { firstname, lastname, email, gender };

    // Handle profile image if uploaded
    if (req.file) {
      updatedData.profileImage = `/uploads/${req.file.filename}`;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      admin._id,
      updatedData,
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Admin Profile Updated Successfully", data: updatedAdmin });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.deleteAdmin = async (req, res) => {
  try {
    let id = req.params.id;
    let admin = await Admin.findOne({_id: id, isDelete: false});
    if(!admin){
      return res.status(404).json({message: "Admin is Not Found"})
    }
    admin = await Admin.findByIdAndUpdate(id, {isDelete: true}, {new: true})
    return res.status(200).json({message: "Delete Success"})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.activateAdmin = async (req, res) => {
  try {
    let id = req.params.id;

    let admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin Not Found" });
    }

    if (admin.isDelete === false) {
      return res.status(400).json({ message: "Admin is already active" });
    }

    admin = await Admin.findByIdAndUpdate(id, { isDelete: false }, { new: true });

    return res.status(200).json({ message: "Admin Reactivated Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
