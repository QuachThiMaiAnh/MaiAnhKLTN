import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    infoProductBuy: {
      type: String,
    },
    content: {
      type: String,
    },

    rating: {
      type: Number,
    },

    deleted: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true, versionKey: false }
);

export default mongoose.model("Comment", commentSchema);
