const express = require('express');
const { addSubCategoryPage, addSubCategory, viewSubCategory, deleteSubCategory, editSubCategoryPage, updateSubCategory } = require('../controller/subCategory.controller');

const routes = express.Router();

routes.get("/add-subCategory", addSubCategoryPage);
routes.post("/add-subCategory", addSubCategory);
routes.get("/view-subCategory", viewSubCategory);

routes.get("/delete-subcategory/:id", deleteSubCategory);
routes.get("/edit-subcategory/:id", editSubCategoryPage);
routes.post("/update-subcategory/:id", updateSubCategory);


module.exports = routes;