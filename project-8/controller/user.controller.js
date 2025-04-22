const Category = require("../models/category.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const Favorite = require("../models/favorite.model");
const Cart = require("../models/cart.model");
const path = require("path");
const fs = require("fs");

exports.userPage = async (req, res) => {
    const { category, search } = req.query;
    let filter = {};

    if (category) {
        filter['category'] = category;
    }

    if (search) {
        // Case-insensitive regex search on title or description
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { desc: { $regex: search, $options: 'i' } }
        ];
    }
  try {
    let categories = await Category.find();
    let allProducts = await Product.find(filter)
    .populate("category")
    .populate("subcategory")
    .populate("extracategory");
    return res.render("index", {categories, allProducts})
  } catch (error) {
    console.log(error);
    req.flash("error", "Somthing Wrong!!!");
    return res.redirect("back");
  }
};


exports.signleProduct = async (req, res) =>{
    try {
        let product = await Product.findById(req.params.id)
        .populate("category")
        .populate("subcategory")
        .populate("extracategory");
    
          return res.render("get_product", {product});
      } catch (error) {
        console.log(error);
        req.flash("error", "Somthing Wrong!!!");
        return res.redirect("back");
      }
}
exports.userloginpage = (req, res) => {
    return res.render("user/user-login")
}
exports.usersignuppage = (req, res) => {
    return res.render("user/user-signup")
}


exports.usersignup = async (req, res) => {
    try {
      let imagePath = "";
      if(req.file){
        imagePath = `/uploads/${req.file.filename}`;
      }

      req.body.userImage = imagePath;
  
      const newUser = await User.create(req.body);
      if (!newUser) {
        req.flash('error', 'Registration failed!');
        return res.redirect('back');
      }
      req.flash('success', 'Registration successful! Please log in.');
      return res.redirect('/user/user-login');
    } catch (error) {
      console.error(error);
      req.flash('error', 'Something went wrong!');
      return res.redirect('back');
    }
  }
exports.userlogin = async (req, res) => {
    try {
        return res.redirect("/user");
    }catch (error) {
      return res.redirect("back");
    }
}
// Logout Controller
// controllers/user.controller.js

exports.userLogout = async (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        console.error(err);
        req.flash('error', 'Something went wrong!');
        return res.redirect('back');
      }
      req.flash('success', 'Logout successfully!');
      return res.redirect('/user');
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Something went wrong!');
    return res.redirect('back');
  }
}

// controllers/user.controller.js

exports.userProfile = async (req, res) => {
  try {
      const user = await User.findById(req.user.id); // Or wherever you get the user

      if (!user) {
          return res.status(404).send('User not found');
      }

      res.render('user/user-profile', { user });
  } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).send('Server error');
  }
};



exports.addFavoriteProduct = async (req, res) => {
  try {
    if (!req.user) {
      req.flash('error', 'You must be logged in to favorite a product.');
      return res.redirect('/user/user-login');
    }

    const userId = req.user._id;
    const productId = req.params.id;

    if (!productId) {
      req.flash('error', 'Invalid product selected.');
      return res.redirect('back');
    }

    const alreadyFavorited = await Favorite.findOne({ userId, productId });
    if (alreadyFavorited) {
      req.flash('info', 'This product is already in your favorites.');
      return res.redirect('back');
    }

    await Favorite.create({ userId, productId });

    req.flash('success', 'Product added to favorites!');
    return res.redirect('back');
  } catch (error) {
    console.error('[Favorite Error]', error);
    req.flash('error', 'Something went wrong while adding to favorites.');
    return res.redirect('back');
  }
};
exports.getFavouriteList = async (req, res) => {
  try {
    const userId = req.user._id;
    const favorites = await Favorite.find({ userId: userId })
      .populate("productId")
      .populate("userId");
    const categories = await Category.find();
    return res.render("user/favourite-list", { favorites, categories });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Something went wrong!');
    return res.redirect('back');
  }
}
exports.removeFavoriteProduct = async (req, res) => {
  try {
    await Favorite.findByIdAndDelete(req.params.id);
    req.flash('success', 'Removed from favorites!');
    return res.redirect('back');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Could not remove favorite.');
    return res.redirect('back');
  }
};


exports.addCartProduct = async (req, res) => {
  try {
    if (!req.user) {
      req.flash('error', 'Please log in to add products to your cart.');
      return res.redirect('/user/user-login');
    }

    const userId = req.user._id;
    const productId = req.params.id;

    // Check if product already in cart
    const existing = await Cart.findOne({ userId, productId });
    if (existing) {
      existing.quantity += 1;
      await existing.save();
      req.flash('info', 'Product quantity updated in cart.');
    } else {
      await Cart.create({ userId, productId, quantity: 1 });
      req.flash('success', 'Product added to cart!');
    }

    return res.redirect('back');
  } catch (error) {
    console.error('[Cart Error]', error);
    req.flash('error', 'Could not add to cart.');
    return res.redirect('back');
  }
};
exports.getCartList = async (req, res) => {
  try {
    const userId = req.user._id;

    const cartItems = await Cart.find({ userId })
      .populate("productId");

    const categories = await Category.find();

    // ✅ Calculate total price here
    const totalPrice = cartItems.reduce((acc, item) => {
      const price = item.productId?.price || 0;
      return acc + (price * item.quantity);
    }, 0);

    // ✅ Pass totalPrice to the view
    return res.render("user/cart-list", { cartItems, categories, totalPrice });

  } catch (error) {
    console.error('[Cart List Error]', error);
    req.flash('error', 'Could not fetch cart.');
    return res.redirect('back');
  }
};

exports.updateCartQuantity = async (req, res) => {
  console.log("Cart update triggered"); // Add this to check if the route is hit
  try {
    // Your existing code...
  } catch (error) {
    console.error('[Update Cart Quantity Error]', error);
    req.flash('error', 'Failed to update cart quantity.');
    return res.redirect('back');
  }
};
exports.updateCartQuantity = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const action = req.query.action;

    const cartItem = await Cart.findById(cartItemId).populate('productId');

    if (!cartItem) {
      req.flash('error', 'Cart item not found.');
      return res.redirect('back');
    }

    if (action === 'plus') {
      cartItem.quantity += 1;
    } else if (action === 'minus') {
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
      } else {
        req.flash('info', 'Minimum quantity is 1.');
      }
    }

    await cartItem.save();
    return res.redirect('back');
  } catch (error) {
    console.error('[Update Cart Quantity Error]', error);
    req.flash('error', 'Failed to update cart quantity.');
    return res.redirect('back');
  }
};
exports.removeFromCart = async (req, res) => {
  try {
    const cartItemId = req.params.id;

    await Cart.findByIdAndDelete(cartItemId);

    req.flash("success", "Item removed from cart.");
    res.redirect("back");
  } catch (error) {
    console.error("Remove cart error:", error);
    req.flash("error", "Failed to remove item.");
    res.redirect("back");
  }
};