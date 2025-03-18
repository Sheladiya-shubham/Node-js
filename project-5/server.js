const express = require("express");
const port = 9000;
const dbConnection = require("./config/dbconnection");
const Movie = require("./routes/movie.routes");
const path = require("path");
const fs = require("fs");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/',Movie)

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});