const express = require('express');
const { extraCategoryPage, extraCategory, deleteExtraCategory, editExtraCategory, viewExtraCategory, updateExtraCategory } = require('../controller/extraCategory.controller');

const routes = express.Router();

routes.get("/add-extraCategory", extraCategoryPage);
routes.post("/add-extraCategory", extraCategory);
routes.get("/view-extraCategory", viewExtraCategory);
routes.get("/delete-extraCategory/:id", deleteExtraCategory);
routes.get("/edit-extraCategory/:id", editExtraCategory);
routes.post("/update-extraCategory/:id", updateExtraCategory);

module.exports = routes;