import mongoose from "mongoose";

const logoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    isCurrent: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Logo = mongoose.model("Logo", logoSchema);

export default Logo;
