import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

import Cart from "./cart.js";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      // unique: true,
      lowercase: true,
    },

    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],

    countOnStock: {
      type: Number,
    },

    image: {
      type: String,
    },

    price: {
      type: Number,
    },

    priceSale: {
      type: Number,
    },

    totalOriginalPrice: {
      type: Number,
    },

    description: {
      type: String,
    },

    descriptionDetail: {
      type: String,
    },

    deleted: {
      type: Boolean,
      default: false,
    },

    createAt: {
      type: Date,
      default: Date.now(),
      // Ta có thể bỏ qua field khỏi schema khi được select (Trong trg hợp data nhạy cảm,...)
      select: false,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],

    variants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant",
        // required: true,
      },
    ],

    count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.plugin(paginate);

productSchema.pre("findOneAndDelete", async function (next) {
  this._doc = await this.model.findOne(this.getQuery());
  next();
});

productSchema.post("findOneAndDelete", async function (doc) {
  // console.log(doc)
  await Cart.updateMany(
    { "products.productItem": doc._id },
    { $pull: { products: { productItem: doc._id } } }
  );
});

export default mongoose.model("Product", productSchema);
