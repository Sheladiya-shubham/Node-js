const express = require('express');
const { addProductPage, addNewProduct, getAllProducts, getProduct,deleteProduct,postEditProduct,getEditProduct } = require('../controller/product.controller');
const Product = require("../models/product.model");

const routes = express.Router();

routes.get("/add-product", addProductPage);
routes.post("/add-product", Product.uploadImage, addNewProduct);
routes.get("/view-product", getAllProducts);
routes.get("/single-product/:id", getProduct);
routes.get('/delete/:id',deleteProduct);
routes.get('/edit/:id',getEditProduct);
routes.post('/edit/:id', Product.uploadImage,postEditProduct);




module.exports = routes;