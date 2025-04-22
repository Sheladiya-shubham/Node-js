
const express = require('express');
const passport = require('passport');

const { userPage, signleProduct,userloginpage,usersignuppage,usersignup,userlogin,addFavoriteProduct,getFavouriteList,removeFavoriteProduct, addCartProduct,getCartList,updateCartQuantity, removeFromCart,userLogout, userProfile } = require('../controller/user.controller');
const User = require('../models/user.model');
const Favorite = require('../models/favorite.model');
const Cart = require('../models/cart.model');
const routes = express.Router();

routes.get("/", userPage);
routes.get("/single-product/:id", signleProduct);
routes.get("/user-login", userloginpage);
routes.get("/user-signup", usersignuppage);
routes.post("/user-signup",User.uploadImage, usersignup);
routes.post("/user-login",passport.authenticate('local',{failureRedirect:"/user/user-login"}),userlogin);
routes.get("/user-logout",userLogout);
// routes/user.routes.js

// Add the profile route
routes.get("/user-profile", userProfile); // <-- This is the correct route for user profile

routes.get("/add-favorite/:id", addFavoriteProduct);
routes.get("/favourites-list", getFavouriteList);
routes.get('/remove-favorite/:id', removeFavoriteProduct);
routes.get("/add-cart/:id", addCartProduct);
routes.get("/cart-list",getCartList);
// user.routes.js
routes.get('/update-cart/:id', updateCartQuantity);
routes.get("/remove-from-cart/:id", removeFromCart);






module.exports = routes;
