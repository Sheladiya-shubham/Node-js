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
    let category = await Category.findById(id);
    if(category){
      if(category.categoryImage != ""){
        let imagePath = path.join(__dirname, "..", category.categoryImage);
        try {
          await fs.unlinkSync(imagePath);
        } catch (error) {
          console.log("File Missing...");
        }
      }
      await Category.findByIdAndDelete(id);
      await SubCategory.deleteMany({category: id});
      await ExtraCategory.deleteMany({categoryId: id});
      req.flash("success", 'Category Delete Success');
      return res.redirect('back');
    }else{
      res.flash("error", 'Category not found');
      return res.redirect('back');
    }
  } catch (error) {
    console.log("Somthing Wrong ===> ", error);
    req.flash("error", "Somthing Wrong!!!");
    return res.redirect("back");
  }
}
exports.editCategoryPage = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      req.flash("error", "Category not found!");
      return res.redirect("back");
    }

    return res.render("/category/edit-category", {
      category,
      admin: req.user,
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
    if (category) {
      if (req.file) {
        let imagePath = "";
        if (category.image !== "") {
          imagePath = path.join(__dirname, "..","uploads/category", category.categoryImage);
          try {
            await fs.unlinkSync(imagePath);
          } catch (error) {
            console.log("Image Not Found...");
          }
        }
        imagePath = `../uploads/category/${req.file.filename}`;
        req.body.categoryImage = imagePath;
      }

      let updateAdmin = await Category.findByIdAndUpdate(category._id, req.body, {
        new: true,
      });
      if (updateAdmin) {
        return res.redirect("/category/view-category");
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