
const Category = require("../models/category.model");
const ExtraCategory = require("../models/extraCategory.model");
const SubCategory = require("../models/subCategory.model");
const Product = require("../models/product.model");

exports.addProductPage = async (req, res) => {
  try {
    let categories = await Category.find();
    let subCategories = await SubCategory.find();
    let extraCategories = await ExtraCategory.find();
    return res.render("product/add_product", {
      categories,
      subCategories,
      extraCategories,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Somthing Wrong!!!");
    return res.redirect("back");
  }
};

exports.addNewProduct = async (req, res) => {
  try {
    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }
    req.body.productImage = imagePath;

    await Product.create(req.body);
    req.flash("success", "New Product Added.");
    return res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Somthing Wrong!!!");
    return res.redirect("back");
  }
};

exports.getAllProducts = async (req, res) => {
  const { category, search } = req.query;

  let filter = {};

  if (category) {
    filter['category'] = category; // Correct way to filter by ObjectId
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { desc: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    const categories = await Category.find();
    const allProducts = await Product.find(filter)
      .populate("category")
      .populate("subcategory")
      .populate("extracategory");

    return res.render("product/view_product", {
      allProducts,
      categories,
      search,
      categoryFilter: category
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Something went wrong!");
    return res.redirect("back");
  }
};


exports.getProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id)
    .populate("category")
    .populate("subcategory")
    .populate("extracategory");

      return res.render("product/single_product", {product});
  } catch (error) {
    console.log(error);
    req.flash("error", "Somthing Wrong!!!");
    return res.redirect("back");
  }
};
exports.deleteProduct = async (req, res) => {
  try {
      const { id } = req.params;

      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
          return res.status(404).send('Product not found');
      }
      req.flash('success', 'Product deleted successfully!');
      res.redirect('/product/view-product'); // Correct route
  } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).send('Server Error');
  }
};

exports.getEditProduct = async (req, res) => {
  try {
      const product = await Product.findById(req.params.id)
          .populate('category')
          .populate('subcategory')
          .populate('extracategory');
      const categories = await Category.find();
      const subCategories = await SubCategory.find();
      const extraCategories = await ExtraCategory.find();

      res.render('product/edit-product', {
          product,
          categories,
          subCategories,
          extraCategories
      });
  } catch (err) {
      console.error(err);
      res.redirect('/product/view-product');
  }
};

exports.postEditProduct = async (req, res) => {
  try {
      const { title, desc, category, subcategory, extracategory, price, quantity } = req.body;
      const product = await Product.findById(req.params.id);
      
      product.title = title;
      product.desc = desc;
      product.category = category;
      product.subcategory = subcategory;
      product.extracategory = extracategory;
      product.price = price;
      product.quantity = quantity;

      if (req.file) {
          product.productImage = '/uploads/' + req.file.filename;
      }

      await product.save();
      req.flash('success', 'Product updated successfully!');
      res.redirect('/product/view-product');
  } catch (err) {
      console.error(err);
      res.redirect('/product/view-product');
  }
};