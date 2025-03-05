// book.model.js
const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    edition: {
        type: String,
        required: true
    },
    pages: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },

    publishedYear: {
        type: Number,
        required: true
    },

});

let Book = mongoose.model('Book', bookSchema);
module.exports = Book;
