const mongoose = require("mongoose");

const dbconntion = () => {
    mongoose.connect("mongodb+srv://sheladiyashubham017:shubham123@cluster0.ozq9j.mongodb.net/movies")
        .then(() => console.log("DB is connected..."))
        .catch(err => console.error("DB Connection Error:", err));
};

module.exports = dbconntion
();