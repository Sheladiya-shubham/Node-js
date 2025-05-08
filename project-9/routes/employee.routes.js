const express = require("express");
const routes = express.Router();

const { loginEmployee, changeEmployeePassword ,employeeprofile,updateEmployeeProfile,employeeForgotPassword,employeeResetPassword,deleteEmployee,activateEmployee} = require("../controller/employee.controller");
const uploadImage = require("../middleware/uploadImage");
const { verifyEmployeeToken } = require("../middleware/verifyToken");

routes.post("/login", loginEmployee);
routes.get("/employee-profile", verifyEmployeeToken,employeeprofile);
routes.put("/update-profile",verifyEmployeeToken,uploadImage.single("profileImage"),updateEmployeeProfile);
routes.post("/change-password",verifyEmployeeToken,changeEmployeePassword);

// Forgot & Reset Password
routes.post("/forgot-password", employeeForgotPassword);
routes.post("/reset-password/:id", employeeResetPassword);

routes.delete("/delete/:id", deleteEmployee);
routes.put("/activate/:id", activateEmployee);

module.exports = routes;
