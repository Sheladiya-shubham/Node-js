const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

// Define the Blog schema
const blogSchema = mongoose.Schema({
  title: String,
  content: String,
  author: String,
  category:String, // e.g., Technology, Lifestyle, Food
  language: String,  // e.g., English, Hindi, Spanish
  date: Date,
  image: String,
  createdAt: { type: Date, default: Date.now },
});

// Configure storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Define a static method to handle image uploads
blogSchema.statics.uploadImage = multer({ storage: storage }).single("image");

// Create and export the Blog model
const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
