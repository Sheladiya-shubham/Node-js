const express = require('express');
const port = 8005;
const path = require('path');
const dbconnect = require('./config/dbConnection');
const cookieParser = require('cookie-parser');

const app = express(); // Connect to MongoDB

// Middleware
app.set("view engine", "ejs");
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(express.urlencoded());

// Routes
app.use("/", require('./routes/index.routes')); // Main Routes
app.use("/blog", require('./routes/blog.routes')); // Blog Routes
app.use("/admin", require("./routes/admin.routes")); // Admin Routes



// Start Server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
