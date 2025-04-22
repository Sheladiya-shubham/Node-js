const mongoose = require("mongoose");

const dbconnect = async () => {
    try {
        await mongoose.connect("mongodb+srv://sheladiyashubham017:shubham123@cluster0.ozq9j.mongodb.net/newadmin");
        console.log("✅ Database connected successfully...");
    } catch (err) {
        console.error("❌ Database Connection Error:", err.message);
    }
};

module.exports = dbconnect();
