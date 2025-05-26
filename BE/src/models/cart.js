import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        productItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variantItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Variant",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        selected: {
          type: Boolean,
          default: false,
        },
        isCommented: {
          type: Boolean,
          default: false,
        },
        statusComment: {
          type: Boolean,
          default: false,
        },
      },
    ],

    voucher: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Voucher",
      },
    ],

    subTotal: {
      type: Number,
    },

    discount: {
      type: Number,
    },

    // ship: {
    //   type: Number,
    //   default: 30000,
    // },

    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Cart", cartSchema);
