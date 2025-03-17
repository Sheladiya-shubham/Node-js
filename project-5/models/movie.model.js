const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

// Define the movie schema
const movieSchema = mongoose.Schema({
    title: { type: String, required: true },
    director: { type: String, required: true },
    genre: { type: String, required: true },
    year: { type: Number, required: true },
    poster: { type: String },
    rating: { type: Number, required: true}
});

// Multer storage configuration for image uploads
const storageImage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "uploads"));
    },
    filename: (req, file, cb) => {
        cb(null,` moviePoster-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Static method to handle image upload
movieSchema.statics.uploadImage = multer({ storage: storageImage }).single("poster");

// Create and export the Movie model
const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;