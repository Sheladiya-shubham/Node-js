const Blog = require("../models/blog.model");
const path = require("path");
const fs = require("fs");
const Admin = require("../models/admin.model");

// Render the Add Blog Page
exports.addBlogPage = async (req, res) => {
  if (!req.cookies || !req.cookies.admin || !req.cookies.admin._id) {
    return res.redirect("/");
  }

  try {
    let admin = await Admin.findById(req.cookies.admin._id);
    if (!admin) {
      return res.redirect("/");
    }

    return res.render("add_blog", { admin }); // Pass admin data to EJS
  } catch (error) {
    console.error("Error fetching admin:", error);
    return res.status(500).send("Internal Server Error");
  }
};


// View All Blogs
exports.viewAllBlogsPage = async (req, res) => {
  if (!req.cookies || !req.cookies.admin || !req.cookies.admin._id) {
      return res.redirect("/");
  }

  try {
      let admin = await Admin.findById(req.cookies.admin._id);
      if (!admin) return res.redirect("/");

      let filter = {}; // Default: No filter

      if (req.query.search) {
          filter.$or = [
              { title: { $regex: req.query.search, $options: "i" } }, // Case-insensitive search
              { author: { $regex: req.query.search, $options: "i" } }
          ];
      }

      if (req.query.category) {
          filter.category = req.query.category;
      }

      let blogs = await Blog.find(filter).sort({ createdAt: -1 }); // Sort by latest

      return res.render("view-all-blogs", {
          admin,
          blogs,
          search: req.query.search || "",
          category: req.query.category || ""
      });
  } catch (error) {
      console.error("Error fetching blogs:", error);
      return res.status(500).send("Internal Server Error");
  }
};







// Add New Blog
exports.addNewBlog = async (req, res) => {
  try {

    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
      req.body.image = imagePath;
    }

    let author = `${req.cookies.admin.firstname} ${req.cookies.admin.lastname}`; 
    let blog = await Blog.create({...req.body, author: author});
    return res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};


exports.viewSingleBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.redirect("/blog/view-all-blogs");
    }

    let admin = null; // Default value
    if (req.cookies && req.cookies.admin && req.cookies.admin._id) {
      admin = await Admin.findById(req.cookies.admin._id);
    }

    return res.render("single-blog", { blog, admin });
  } catch (error) {
    console.error("Error fetching single blog:", error);
    return res.status(500).send("Internal Server Error");
  }
};


// Edit Blog Page
exports.editBlogPage = async (req, res) => {
  try {
    if (!req.cookies || !req.cookies.admin || !req.cookies.admin._id) {
      return res.redirect("/");
    }

    let loginAdmin = await Admin.findById(req.cookies.admin._id);
    let blog = await Blog.findById(req.params.id);

    if (blog) {
      return res.render("edit_blog", { blog, admin: loginAdmin });
    } else {
      return res.redirect("back");
    }
  } catch (error) {
    console.log(error);
    return res.redirect("/admin/view-all-blogs");
  }
};

exports.deleteBlog = async (req, res) => {
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

      let updatedBlog = await Blog.findByIdAndUpdate(blog._id, req.body, {
        new: true,
      });

      if (updatedBlog) {
        return res.redirect("/blog/view-all-blogs");
      } else {
        return res.redirect("back");
      }
    } else {
      return res.redirect("back");
    }
  } catch (error) {
    console.log(error);
  }
};




