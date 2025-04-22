
const mongoose = require('mongoose');
const multer = require("multer");
const path = require('path');


const productSchema = mongoose.Schema({
    title: {
        type:String
    },
    desc:{
        type: String
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    subcategory:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory"
    },
    extracategory:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExtraCategory"
    },
    price:{
        type: Number
    },
    quantity: {
        type: Number
    },
    productImage: {
        type: String
    }
});
    
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}`);
  }
});

productSchema.statics.uploadImage = multer({storage: storage}).single('productImage');


const Product = mongoose.model("Product", productSchema);
module.exports = Product;
