const Category = require("../models/category.model");
const ExtraCategory = require("../models/extraCategory.model");
const SubCategory = require("../models/subCategory.model");

exports.extraCategoryPage = async (req, res) => {
  try {
    let categories = await Category.find();
    let subCategories = await SubCategory.find();
    return res.render("extracategory/add_extracategory", {
      categories,
      subCategories,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Somthing Wrong!!!");
    return res.redirect("back");
  }
};

exports.extraCategory = async (req, res) => {
  try {
    await ExtraCategory.create(req.body);
    req.flash("success", "Extra Category Added");
    return res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Somthing Wrong!!!");
    return res.redirect("back");
  }
};

exports.viewExtraCategory = async (req, res) => {
  try {
    let extraCategories = await ExtraCategory.find()
      .populate("categoryId")
      .populate("subCategoryId");
    return res.render("extracategory/view_extracategory", { extraCategories });
  } catch (error) {
    console.log(error);
    req.flash("error", "Somthing Wrong!!!");
    return res.redirect("back");
  }
};


exports.deleteExtraCategory = async (req, res) => {
  try {
    let id = req.params.id;
    let extraCategory = await ExtraCategory.findById(id);
    if(extraCategory){
      await ExtraCategory.findByIdAndDelete(id);
      req.flash("success", "Extra Category Delete Success");
      return res.redirect("back");
    }else{
      req.flash("error", "Extra Category not Found");
      return res.redirect("back");
    }
    
  } catch (error) {
    console.log(error);
    req.flash("error", "Somthing Wrong!!!");
    return res.redirect("back");
  }
};

exports.editExtraCategory = async (req, res) => {
  try {
    let id = req.params.id;
    let extraCategory = await ExtraCategory.findById(id);
    if(extraCategory){
      let categories = await Category.find();
    let subCategories = await SubCategory.find();
      return res.render("extracategory/edit_extraCategory", {extraCategory, categories, subCategories});
    }else{
      req.flash("error", "Extra Category not Found");
      return res.redirect("back");
    }
    
  } catch (error) {
    console.log(error);
    req.flash("error", "Somthing Wrong!!!");
    return res.redirect("back");
  }
};

exports.updateExtraCategory = async (req, res) => {
  try {
    let id = req.params.id;
    let extraCategory = await ExtraCategory.findById(id);
    if(extraCategory){
      await ExtraCategory.findByIdAndUpdate(id, req.body, {new: true});
      req.flash("success", "Extra Category Update Success");
      return res.redirect("/extracategory/view-extraCategory");
    }else{
      req.flash("error", "Extra Category not Found");
      return res.redirect("back");
    }
    
  } catch (error) {
    console.log(error);
    req.flash("error", "Somthing Wrong!!!");
    return res.redirect("back");
  }
};