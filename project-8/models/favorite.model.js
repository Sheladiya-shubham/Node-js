const mongoose = require("mongoose");

const favoirteSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }
});

const Favorite = mongoose.model("Favorite", favoirteSchema);

module.exports = Favorite;