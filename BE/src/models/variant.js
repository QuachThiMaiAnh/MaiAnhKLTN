import mongoose from "mongoose";

import Cart from "./cart.js";
import Product from "./product.js";

const variantSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
    },

    originalPrice: {
      type: Number,
      // required: true,
    },

    priceSale: {
      type: Number,
    },

    values: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AttributeValue",
        // required: true,
      },
    ],

    countOnStock: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      // required: true,
    },

    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

variantSchema.pre("findOneAndDelete", async function (next) {
  this._doc = await this.model.findOne(this.getQuery());
  next();
});

variantSchema.post("findOneAndDelete", async function (doc) {
  // console.log(doc);
  if (doc) {
    try {
      await Cart.updateMany(
        { "products.variantItem": doc._id },
        { $pull: { products: { variantItem: doc._id } } }
      );

      await Product.updateMany(
        { variants: doc._id },
        { $pull: { variants: doc._id } }
      );
    } catch (err) {
      console.error("Error:", err);
    }
  }
});

export default mongoose.model("Variant", variantSchema);
