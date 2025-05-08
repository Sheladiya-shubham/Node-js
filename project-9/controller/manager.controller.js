const Manager = require("../model/manager.model");
const Employee = require('../model/employee.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('../config/sendMail'); // adjust path if needed

// Login Manager
exports.loginManager = async (req, res) => {
  try {
    const { email, password } = req.body || {}; // Safely fallback if req.body is undefined

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    
    let manager = await Manager.findOne({ email: email, isDelete: false });
    if (!manager) {
      return res.status(404).json({ message: "Manager not found." });
    }

    let matchPass = await bcrypt.compare(password, manager.password);
    if (!matchPass) {
      return res.status(400).json({ message: "Password is not matched" });
    }

    let payload = {
      managerId: manager._id,
    };

    let token = await jwt.sign(payload, "manager");
    return res.status(200).json({ message: "Manager Login Success", managerToken: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Manager Profile
exports.myProfile = async (req, res) => {
  try {
    let manager = req.user;
    return res.status(200).json({ message: "Profile Success", data: manager });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateManagerProfile = async (req, res) => {
  try {
    const manager = req.user; // This comes from verifyManagerToken middleware
    const updates = req.body;

    if (req.file) {
      updates.profileImage = `/uploads/${req.file.filename}`;
    }

    const updatedManager = await Manager.findByIdAndUpdate(
      manager._id,
      updates,
      { new: true }
    );

    if (!updatedManager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    res.status(200).json({
      message: "Manager profile updated successfully",
      data: updatedManager,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Manager Change-password
exports.changePasswordManager = async (req, res) => {
  try {
    const { current_pass, new_pass, confirm_pass } = req.body;
    let manager = req.user;
    let matchPass = await bcrypt.compare(current_pass, manager.password);
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
    manager = await Manager.findByIdAndUpdate(
      manager._id,
      { password: hashPassword },
      { new: true }
    );

    return res.status(200).json({ message: "Password Change Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.deleteManager = async (req, res) => {
  try {
    let id = req.params.id;
    let manager = await Manager.findOne({_id: id, isDelete: false});
    if(!manager){
      return res.status(404).json({message: "Manager Not Found"})
    }
    manager = await Manager.findByIdAndUpdate(id, {isDelete: true}, {new: true})
    return res.status(200).json({message: "Delete Success"})
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

// Manager Reset Password
exports.managerResetPassword = async (req, res) => {
  try {
    const { managerId } = req.params;
    const { new_pass, confirm_pass } = req.body;

    if (new_pass !== confirm_pass) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const manager = await Admin.findById(managerId);
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    const hashedPassword = await bcrypt.hash(new_pass, 10);
    admin.password = hashedPassword;
    await manager.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// Logout Manager
exports.logoutManager = async (req, res) => {
  try {
    // For stateless JWT, you simply tell the client to delete the token
    return res.status(200).json({ message: "Manager logged out successfully. Please delete the token on client side." });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.managerForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const manager = await Manager.findOne({ email, isDelete: false });
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    // Generate reset token
    const resetToken = jwt.sign({ managerId: manager._id }, "reset_secret", { expiresIn: "15m" });

    // Prepare email content
    const resetLink = `http://localhost:8005/manager/reset-password/${resetToken}`;
    const html = `
      <h3>Password Reset</h3>
      <p>Hello ${manager.firstname},</p>
      <p>Click the link below to reset your password. This link expires in 15 minutes.</p>
      <a href="${resetLink}">${resetLink}</a>
    `;

    // Send email
    await sendMail(manager.email, "Reset Your Password", html);

    return res.status(200).json({ message: "Password reset link sent to email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.managerResetPassword = async (req, res) => {
  try {
    const { new_pass, confirm_pass } = req.body;

    if (new_pass !== confirm_pass) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Trim any unwanted characters from the managerId (to avoid issues with spaces/newlines)
    const managerId = req.params.id.trim();

    const manager = await Manager.findById(managerId);  // Use the clean ID
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    const hashedPassword = await bcrypt.hash(new_pass, 10);
    manager.password = hashedPassword;
    await manager.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addEmployee = async (req, res) => {
  try {
    const { firstname, lastname, email, password, gender } = req.body;

    // Check if employee already exists
    let employee = await Employee.findOne({ email: email });
    if (employee) {
      return res.status(400).json({ message: "Employee already exists." });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the employee document
    employee = await Employee.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,  // ✅ hashed password now used
      gender,
    });

    // Send email to the employee
    const emailContent = `
      <h2>Welcome, ${firstname} ${lastname}!</h2>
      <p>You have been successfully added as an employee.</p>
      <p>Your login credentials are:</p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Password:</strong> ${password}</li>
      </ul>
      <p>Please change your password after logging in.</p>
      <br>
      <p>Best regards,<br>Team Management</p>
    `;

    await sendMail(email, "Your Employee Account", emailContent);

    return res.status(201).json({
      message: `Employee ${firstname} ${lastname} added successfully and email sent to ${email}`,
      data: employee,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.viewAllEmployees = async (req, res) => {
  try {
    // Find all employees (no manager reference needed)
    let employees = await Employee.find({ isDelete: false });  // Optionally, you can add a filter for non-deleted employees
    
    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: "No employees found." });
    }

    return res.status(200).json({ message: "All Employees Fetched Successfully", data: employees });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the employee by ID
    let employee = await Employee.findById(id);

    if (!employee || employee.isDelete === true) {
      return res.status(404).json({ message: "Employee not found or already deleted" });
    }

    // Soft delete by setting isDelete to true
    employee.isDelete = true;
    await employee.save();

    return res.status(200).json({ message: "Employee  deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.activateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the employee
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (!employee.isDelete) {
      return res.status(400).json({ message: "Employee is already active" });
    }

    // Reactivate the employee
    employee.isDelete = false;
    await employee.save();

    return res.status(200).json({ message: "Employee activated successfully" });
  } catch (error) {
    console.error("Activate Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};