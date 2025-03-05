// server.js
const express = require("express");
const dbConnection = require("./config/dbConnection"); 
const Book = require("./model/book.model"); 

dbConnection();
const app = express();
const port = 9009;

app.set("view engine", "ejs");
app.use(express.urlencoded());

app.get("/", async (req, res) => {
    try {
        let books = await Book.find({});
        return res.render("index", { books });
    } catch (error) {
        console.error("Error fetching books:", error);
        return res.send("Something went wrong while fetching books.");
    }
});

app.post("/add-book", async (req, res) => {
    try {
        console.log(req.body);
        let book = await Book.create(req.body);
        console.log("Book Added Successfully.");
        return res.redirect("/");
    } catch (error) {
        console.error("Error adding book:", error);
        return res.send("Something went wrong!");
    }
});

app.get("/delete-book/:id", async (req, res) => {
    let id = req.params.id;
    let book = await Book.findByIdAndDelete(id);
    if (book) {
        console.log("Book Deleted Successfully.");
        return res.redirect("/");
    } else {
        console.log("Error: Book Not Deleted.");
        return res.send("Something went wrong!");
    }
});

app.get("/edit-book/:id", async (req, res) => {
    let id = req.params.id;
    let record = await Book.findById(id);
    return res.render("edit", { book: record });
});

app.post("/edit/:id", async (req, res) => {
    let id = req.params.id;
    let record = await Book.findByIdAndUpdate(id, req.body, { new: true });
    if (record) {
        console.log("Book Updated Successfully.");
        return res.redirect("/");
    } else {
        console.log("Error updating book.");
        return res.send("Something went wrong!");
    }
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
