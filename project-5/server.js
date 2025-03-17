const express = require("express");
const port = 9000;
const dbConnection = require("./config/dbconnection");
const Movie = require("./models/movie.model");
const path = require("path");
const fs = require("fs");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", async (req, res) => {
    let allMovies = await Movie.find();
    return res.render("index", { allMovies });
});

app.post("/add-movie", Movie.uploadImage, async (req, res) => {
    let imagePath = "";
    if (req.file) {
        imagePath = `/uploads/${req.file.filename}`;
    }
    req.body.poster = imagePath;

    let newMovie = await Movie.create(req.body);
    if (newMovie) {
        return res.redirect("/");
    }
});

app.get("/delete-movie/:id", async (req, res) => {
    let id = req.params.id;
    let record = await Movie.findById(id);
    if (record.poster != "") {
        let imagePath = path.join(__dirname, record.poster);
        try {
            await fs.unlinkSync(imagePath);
        } catch (error) {
            console.log("File Missing...");
        }
    }
    record = await Movie.findByIdAndDelete(id);

    if (record) {
        console.log("Delete Success");
        return res.redirect("/");
    } else {
        console.log("Error...");
        return res.redirect("back");
    }
});

app.get("/edit-movie/:id", async (req, res) => {
    let record = await Movie.findById(req.params.id);
    return res.render("edit", { movie: record });
});

app.post("/update-movie/:id", Movie.uploadImage, async (req, res) => {
    let record = await Movie.findById(req.params.id);
    if (record) {
        if (req.file) {
            if (record.poster != "") {
                let imagePath = path.join(__dirname, record.poster);
                try {
                    await fs.unlinkSync(imagePath);
                } catch (error) {
                    console.log("File Missing...");
                }
            }
            req.body.poster = `/uploads/${req.file.filename}`;
        }
        await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log("Update success");
        return res.redirect("/");
    } else {
        return res.redirect("back");
    }
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});