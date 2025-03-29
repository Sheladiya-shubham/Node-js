const express = require("express");
const blogRoutes = express.Router();
const { addBlogPage, viewAllBlogsPage,deleteBlog,addNewBlog ,editBlogPage,updateBlog,viewSingleBlog} = require("../controller/blog.controller");

const Blog = require("../models/blog.model");

// Route to render Add Blog page
blogRoutes.get("/add-blog", addBlogPage);


// Route to view all blogs
blogRoutes.get("/view-all-blogs", viewAllBlogsPage);

blogRoutes.get("/single-blog/:id", viewSingleBlog);


// Route to add a new blog
blogRoutes.post("/add-blog", Blog.uploadImage, addNewBlog);

// // Route to edit a blog
blogRoutes.get("/edit_blog/:id", editBlogPage);

blogRoutes.get("/delete-blog/:id", deleteBlog);

// // Route to update a blog
blogRoutes.post("/update-blog/:id", Blog.uploadImage, updateBlog);

module.exports = blogRoutes;
