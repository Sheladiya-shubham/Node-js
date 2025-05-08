const express = require('express');
const routes = express.Router();
const uploadImage = require("../middleware/uploadImage");
const { verifyManagerToken } = require('../middleware/verifyToken');
const { loginManager, myProfile,changePasswordManager, deleteManager, activateManager, managerForgotPassword, managerResetPassword ,updateManagerProfile, logoutManager,addEmployee, viewAllEmployees,deleteEmployee,activateEmployee} = require('../controller/manager.controller');

routes.post("/login", loginManager);   

routes.get("/profile", verifyManagerToken, myProfile); 
routes.put("/profile", verifyManagerToken, uploadImage.single('profileImage'), updateManagerProfile);

routes.post("/change-password", verifyManagerToken, changePasswordManager);

routes.delete("/delete-manager/:id", verifyManagerToken, deleteManager)
routes.put("/activate-manager/:id", verifyManagerToken, activateManager);
routes.post("/forgot-password", managerForgotPassword);
routes.post('/reset-password/:id', managerResetPassword);
routes.get("/logout", verifyManagerToken, logoutManager);




routes.post("/employees",verifyManagerToken,uploadImage.single("profileImage"),addEmployee
);

routes.get('/employees', viewAllEmployees);
routes.delete('/employees/:id', deleteEmployee);
routes.put('/employees/activate/:id', activateEmployee);
module.exports = routes;