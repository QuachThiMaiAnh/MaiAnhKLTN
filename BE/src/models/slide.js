import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
const sliderSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["product", "homepage"], // Phân loại slide
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
    },
    image: {
      type: String,
    },
    backgroundImage: {
      type: String,
    },
    description: {
      type: String,
    },
    features: {
      type: [String], 
    },
    price: {
      type: Number,
    },
    promotionText: {
      type: String, 
    },
    textsale: {
      type: String, // Nội dung nổi bật
    },
    callToActions: [
      {
        label: { type: String, required: true }, // Văn bản nút
        link: { type: String, required: true }, // Đường dẫn
        isActive: { type: Boolean, default: true }, // Trạng thái hoạt động của nút
      },
    ],
    contentPosition: {
      type: String, // Vị trí nội dung
      enum: ["left", "right", "center"],
      default: "center",
    },
    isActive: {
      type: Boolean,
      default: true, // Trạng thái hoạt động của slide
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

sliderSchema.plugin(paginate);

const Slider = mongoose.model("Slider", sliderSchema);
export default Slider;
