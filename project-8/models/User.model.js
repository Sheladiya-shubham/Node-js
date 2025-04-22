const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

// Define the path for storing uploaded images
const UPLOAD_PATH = path.join(__dirname, "..", "uploads");

// User Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  userImage: {
    type: String,
    default: ""  // in case user doesn't upload an image
  }
}, {
  timestamps: true
});

// Multer config for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});

// Static method to use in routes
userSchema.statics.uploadImage = multer({ storage }).single("userImage");
userSchema.statics.uploadPath = UPLOAD_PATH;

// Export User model
const User = mongoose.model("User", userSchema);
module.exports = User;
