const mongoose = require("mongoose");

const extraCategorySchema = mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory"
    },
    extraCategory: {
        type: String
    }
});

const ExtraCategory = mongoose.model("ExtraCategory", extraCategorySchema);

module.exports = ExtraCategory;