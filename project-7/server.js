const express = require('express');
const port = 8005;
const path = require('path');
const dbconnect = require('./config/dbConnection');
const cookieParser = require('cookie-parser');
const  session  = require('express-session');
const passport = require('passport');
const localSt= require('./config/passportStr');
const app = express(); // Connect to MongoDB

// Middleware
app.set("view engine", "ejs");
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(express.urlencoded());



app.use(session({
    name: "test",
    secret: "admin",
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticateUser);


// Routes
app.use("/", require('./routes/index.routes')); // Main Routes


// Start Server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
