import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      lowercase: true,
    },

    type: {
      type: String,
      lowcase: true,
      // required: true
    },

    values: {
      type: Array,
    },

    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Attribute", attributeSchema);
