const express = require('express');
const adminRoutes = express.Router();
const {addAdminPage, viewAllAdminPage, addNewAdmin,deleteAdmin, editAdminPage, updateAdmin} = require("../controller/admin.controller");
const Admin = require('../models/admin.model');

adminRoutes.get("/add-admin", addAdminPage);

adminRoutes.get("/view-admins", viewAllAdminPage);

adminRoutes.post("/add-admin", Admin.uploadImage, addNewAdmin);

adminRoutes.get("/delete-admin/:id", deleteAdmin);

    
adminRoutes.get("/edit-admin/:id", editAdminPage);

adminRoutes.post("/update-admin/:id", Admin.uploadImage, updateAdmin);


module.exports = adminRoutes;