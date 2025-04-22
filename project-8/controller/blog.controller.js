const Blog = require("../models/blog.model");
const path = require("path");
const fs = require("fs");
const Admin = require("../models/admin.model");

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.redirect("/login");
};

// Render the Add Blog Page
exports.addBlogPage = async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/");

  try {
    const category = req.query.category || "ALL"; 
    return res.render("add_blog", { admin: req.user, category });
  } catch (error) {
    console.error("Error fetching admin:", error);
    return res.status(500).send("Internal Server Error");
  }
};


// View All Blogs
exports.viewAllBlogsPage = async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/");

  try {
    let filter = {};
    let category = req.query.category || ""; // Get category from query params

    if (category && category !== "ALL") {
      filter.category = category; // Apply filter if a category is selected
    }

    let blogs = await Blog.find(filter).sort({ createdAt: -1 });

    return res.render("view-all-blogs", {
      admin: req.user, // Passport user session
      blogs,
      category, // Pass the selected category to EJS
      search: req.query.search || ""
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).send("Internal Server Error");
  }
};



// Add New Blog
exports.addNewBlog = async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/");

  try {
    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
      req.body.image = imagePath;
    }

    let author = `${req.user.firstname} ${req.user.lastname}`;
    await Blog.create({ ...req.body, author });

    return res.redirect("back");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

// View Single Blog
exports.viewSingleBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) return res.redirect("/blog/view-all-blogs");

    return res.render("single-blog", { blog, admin: req.isAuthenticated() ? req.user : null });
  } catch (error) {
    console.error("Error fetching single blog:", error);
    return res.status(500).send("Internal Server Error");
  }
};

// Edit Blog Page
exports.editBlogPage = async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/");

  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) return res.redirect("back");

    return res.render("edit_blog", { blog, admin: req.user });
  } catch (error) {
    console.log(error);
    return res.redirect("/blog/view-all-blogs");
  }
};

// Delete Blog
exports.deleteBlog = async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/");

  try {
    let blog = await Blog.findById(req.params.id);
    if (blog) {
      await Blog.findByIdAndDelete(req.params.id);
      return res.redirect("back");
    }
  } catch (error) {
    console.log("Error deleting blog:", error);
    return res.status(500).send("Internal Server Error");
  }
};

// Update Blog
exports.updateBlog = async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/");

  try {
    let blog = await Blog.findById(req.params.id);
    if (blog) {
      if (req.file) {
        let imagePath = "";
        if (blog.image !== "") {
          imagePath = path.join(__dirname, "..", blog.image);
          try {
            await fs.unlinkSync(imagePath);
          } catch (error) {
            console.log("Image Not Found...");
          }
        }
        imagePath = `/uploads/${req.file.filename}`;
        req.body.image = imagePath;
      }

      let updatedBlog = await Blog.findByIdAndUpdate(blog._id, req.body, { new: true });

      return updatedBlog ? res.redirect("/blog/view-all-blogs") : res.redirect("back");
    } else {
      return res.redirect("back");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};
