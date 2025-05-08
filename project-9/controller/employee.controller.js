const Employee = require("../model/employee.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../config/sendMail");

exports.loginEmployee = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }
  
      const employee = await Employee.findOne({ email, isDelete: false });
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      const isMatch = await bcrypt.compare(password, employee.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password." });
      }
  
      const token = jwt.sign({ employeeId: employee._id }, "employee_secret");
  
      res.status(200).json({
        message: "Login successful",
        employeeToken: token,
        employee,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  // Get Employee Profile
  exports.employeeprofile = async (req, res) => {
    try {
      const employee = req.user;
      res.status(200).json({ message: "Profile fetched", data: employee });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  // Update Employee Profile
exports.updateEmployeeProfile = async (req, res) => {
  try {
    const employee = req.user; // From verifyEmployeeToken middleware
    const { firstname, lastname, email, gender } = req.body;

    let updatedData = { firstname, lastname, email, gender };

    if (req.file) {
      updatedData.profileImage = `/uploads/${req.file.filename}`;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employee._id,
      updatedData,
      { new: true }
    );

    return res.status(200).json({
      message: "Employee Profile Updated Successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    console.error("Update Employee Profile Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
  exports.changeEmployeePassword = async (req, res) => {
    try {
      const { current_pass, new_pass, confirm_pass } = req.body;
      const employee = req.user;
  
      const match = await bcrypt.compare(current_pass, employee.password);
      if (!match) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
  
      if (new_pass !== confirm_pass) {
        return res.status(400).json({ message: "New password and confirm password do not match" });
      }
  
      const hashed = await bcrypt.hash(new_pass, 10);
      await Employee.findByIdAndUpdate(employee._id, { password: hashed });
  
      return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Change Password Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  exports.employeeForgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Check if employee exists and is not deleted
      const employee = await Employee.findOne({ email, isDelete: false });
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
  
      // Generate a secure reset token valid for 15 minutes
      const resetToken = jwt.sign(
        { employeeId: employee._id },
        "reset_employee_secret", // 🔐 Better: move to process.env
        { expiresIn: "15m" }
      );
  
      // Create the reset password link
      const resetLink = `http://localhost:8005/employee/reset-password/${resetToken}`;
  
      // Prepare the email content
      const html = `
        <h3>Password Reset</h3>
        <p>Hello ${employee.firstname},</p>
        <p>Click the link below to reset your password. This link expires in 15 minutes.</p>
        <a href="${resetLink}">${resetLink}</a>
      `;
  
      // Send the email
      await sendMail(employee.email, "Reset Your Employee Password", html);
  
      return res.status(200).json({ message: "Password reset link sent to email." });
    } catch (error) {
      console.error("Employee Forgot Password Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
 
// Reset Password using Employee ID
exports.employeeResetPassword = async (req, res) => {
  try {
    const { id } = req.params; // employee ID from the URL
    const { new_pass, confirm_pass } = req.body;

    // Validate input
    if (!new_pass || !confirm_pass) {
      return res.status(400).json({ message: "Both password fields are required" });
    }

    if (new_pass !== confirm_pass) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Find the employee by ID
    const employee = await Employee.findById(id);
    if (!employee || employee.isDelete) {
      return res.status(404).json({ message: "Employee not found or deleted" });
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(new_pass, 10);
    employee.password = hashedPassword;
    await employee.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findOne({ _id: id, isDelete: false });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found or already deleted" });
    }

    await Employee.findByIdAndUpdate(id, { isDelete: true }, { new: true });

    return res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Delete Employee Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.activateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employee.isDelete === false) {
      return res.status(400).json({ message: "Employee is already active" });
    }

    await Employee.findByIdAndUpdate(id, { isDelete: false }, { new: true });

    return res.status(200).json({ message: "Employee activated successfully" });
  } catch (error) {
    console.error("Activate Employee Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
