const express = require('express');
const routes = express.Router();
const {dashBoard, loginPage, loginAdmin, logout,profilePage, forgotPasswordPage,sendEmail,verifyOTP,changePassword, changePasswordPage, resetPassword} = require("../controller/index.controller");
const passport = require('passport');

routes.use("/user", require("./user.routes"));

routes.get("/", loginPage);

routes.get("/dashboard",passport.checkAuthencicated, dashBoard);


routes.post('/sendEmail',sendEmail);

routes.post('/verify-otp',verifyOTP);

routes.post('/change-password',passport.checkAuthencicated,changePassword);

routes.get('/change-password',passport.checkAuthencicated,changePasswordPage);

routes.post('/reset-password',resetPassword);

routes.post("/login",passport.authenticate('local',{failureRedirect:"/"}), loginAdmin);
routes.get("/logout", logout);

routes.get("/profile", profilePage); 

routes.get("/forgotPassword", forgotPasswordPage)



routes.use("/admin",passport.checkAuthencicated, require('./admin.routes'))
routes.use("/blog",passport.checkAuthencicated, require('./blog.routes'))
routes.use("/category",passport.checkAuthencicated, require('./category.routes'))
routes.use("/subcategory",passport.checkAuthencicated, require('./subcategory.routes'))
routes.use("/extracategory",passport.checkAuthencicated, require('./extraCategory.routes'))
routes.use("/product",passport.checkAuthencicated, require('./product.routes'))


module.exports = routes;