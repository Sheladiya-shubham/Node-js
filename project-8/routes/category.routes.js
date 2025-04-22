const express = require('express');
const { addCategoryPage, addCategory, viewCategory, deleteCategory,editCategoryPage,updateCategory } = require('../controller/category.controller');
const Category = require("../models/category.model");

const routes = express.Router();

routes.get("/add-category", addCategoryPage);
routes.get("/view-category", viewCategory);
routes.post("/add-category", Category.uploadImage, addCategory);
routes.get("/edit-category/:id", editCategoryPage);
routes.post("/update-category/:id", Category.uploadImage, updateCategory);
routes.get("/delete-category/:id", deleteCategory);


module.exports = routes;