const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    subCategory: {
        type: String
    }
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;