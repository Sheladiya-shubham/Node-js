const Admin = require("../model/admin.model");
const jwt = require("jsonwebtoken");
const Manager = require("../model/manager.model");
const Employee = require("../model/employee.model");

exports.verifyAdminToken = async (req, res, next) => {
  let authorization = req.headers["authorization"];
  if(!authorization){
    return res.status(500).json({message: 'token not found'});
  }
  let token = authorization.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Please Login Again" });
  }

  let { adminId } = await jwt.verify(token, "admin");
  const admin = await Admin.findById(adminId);
  if (admin) {
    req.user = admin;
    next();
  } else {
    return res.status(400).json({ message: "Invalid Admin" });
  }
};

exports.verifyManagerToken = async (req, res, next) => {
  let authorization = req.headers["authorization"];
  if(!authorization){
    return res.status(500).json({message: 'token not found'});
  }
  let token = authorization.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Please Login Again" });
  }

  let { managerId } = await jwt.verify(token, "manager");
  const manager = await Manager.findById(managerId);
  if (manager) {
    req.user = manager;
    next();
  } else {
    return res.status(400).json({ message: "Invalid Manager" });
  }
};

exports.verifyEmployeeToken = async (req, res, next) => {
  try {
    const authorization = req.headers["authorization"];
    if (!authorization) {
      return res.status(401).json({ message: "Authorization header not found" });
    }

    const token = authorization.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, "employee_secret"); // Should match token signing key
    const employee = await Employee.findById(decoded.employeeId);

    if (!employee || employee.isDelete) {
      return res.status(401).json({ message: "Unauthorized or deleted employee" });
    }

    req.user = employee;
    next();
  } catch (error) {
    console.error("Employee token verification error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};