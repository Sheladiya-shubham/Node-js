const mongoose = require("mongoose");

const dbconntion = () => {
    mongoose.connect("mongodb://localhost:27017/movies")
        .then(() => console.log("DB is connected..."))
        .catch(err => console.error("DB Connection Error:", err));
};

module.exports = dbconntion();