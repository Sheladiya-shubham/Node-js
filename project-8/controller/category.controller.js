const Category = require("../models/category.model");
const path = require('path');
const fs = require('fs');
const SubCategory = require("../models/subCategory.model");
const ExtraCategory = require("../models/extraCategory.model");

exports.viewCategory = async (req, res) => {
  try {
    let categories = await Category.find();
    return res.render("category/view_category", { categories });
  } catch (error) {
    console.log("Somthing Wrong ===> ", error);
    req.flash("error", "Somthing Wrong!!!");
    return res.redirect("back");
  }
};
exports.addCategoryPage = async (req, res) => {
  try {
    return res.render("category/add_category");
  } catch (error) {
    console.log("Somthing Wrong ===> ", error);
    req.flash("error", "Somthing Wrong!!!");
    return res.redirect("back");
  }
};

exports.addCategory = async (req, res) => {
  try {
    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/category/${req.file.filename}`;
    }
    req.body.categoryImage = imagePath;

    let category = await Category.create(req.body);
    if (category) {
      req.flash("success", "New Category Added!!!");
      return res.redirect("back");
    } else {
      req.flash("error", "Somthing Wrong");
      return res.redirect("back");
    }
  } catch (error) {
    console.log("Somthing Wrong ===> ", error);
    req.flash("error", "Somthing Wrong!!!");
    return res.redirect("back");
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    let id = req.params.id;

    const category = await Category.findById(id);

    if (!category) {
      req.flash("error", "Category not found");
      return res.redirect("back");
    }

    // Delete the category image from filesystem if exists
    if (category.categoryImage && category.categoryImage !== "") {
      const imagePath = path.join(__dirname, "..", category.categoryImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete the category itself
    await Category.findByIdAndDelete(id);

    // Delete related subcategories
    await SubCategory.deleteMany({ category: id });

    // Delete related extra categories
    await ExtraCategory.deleteMany({ categoryId: id }); // Make sure categoryId exists in model!

    req.flash("success", "Category and related data deleted successfully");
    return res.redirect("back");

  } catch (error) {
    console.log("Something went wrong ===> ", error);
    req.flash("error", "Something went wrong!!!");
    return res.redirect("back");
  }
};

exports.editCategoryPage = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      req.flash("error", "Category not found!");
      return res.redirect("back");
    }

    console.log("Category found:", category); // Debug

    return res.render("category/edit_category", {
      category,
      admin: req.user, // if needed in the view
    });
  } catch (error) {
    console.error("Error loading edit category page:", error);
    req.flash("error", "Something went wrong!");
    return res.redirect("back");
  }
};


exports.updateCategory = async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);
    if (!category) {
      req.flash("error", "Category not found!");
      return res.redirect("back");
    }

    console.log("Form Data:", req.body);
    console.log("Uploaded File:", req.file);

    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, "..", "uploads/category", category.categoryImage || "");
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      // Save new image path
      req.body.categoryImage = req.file.filename;
    }

    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (updated) {
      req.flash("success", "Category updated successfully!");
      console.log("Category updated successfully");
      return res.redirect("/category/view-category");
    } else {
      console.log("Update failed");
      return res.redirect("back");
    }

  } catch (error) {
    console.log("Error updating category:", error);
    return res.redirect("back");
  }
};
