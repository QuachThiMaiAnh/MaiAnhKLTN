import cloudinary from "../config/cloudinary";
import { StatusCodes } from "http-status-codes";
import Slider from "../models/slide";
import fs from "fs";

export const getAllSlides = async (req, res) => {
  try {
    const { type } = req.query; // Lấy tham số `type` từ query string

    const query = type ? { type } : {}; // Nếu có `type`, lọc theo loại slide

    const slides = await Slider.find(query).sort({ createdAt: -1 });

    if (!slides.length) {
      return res.status(404).json({ message: "Không tìm thấy slide nào" });
    }
    res.json(slides);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách slide:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const getSlideDetail = async (req, res) => {
  try {
    const slide = await Slider.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ message: "Slide not found" });
    }
    res.json(slide);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Hàm xử lý tạo mới slide
export const createSlide = async (req, res) => {
  try {
    let imageUrl = null;
    let backgroundImageUrl = null;

    // Kiểm tra và xử lý các file
    if (req.files) {
      // Xử lý ảnh chính (image)
      if (req.files.image) {
        const result = await cloudinary.uploader.upload(
          req.files.image[0].path,
          {
            folder: "slides",
          }
        );
        imageUrl = result.secure_url;
        fs.unlink(req.files.image[0].path, (err) => {
          if (err) console.error("Không thể xóa file tạm:", err);
        });
      }

      // Xử lý ảnh nền (backgroundImage)
      if (req.files.backgroundImage) {
        const bgResult = await cloudinary.uploader.upload(
          req.files.backgroundImage[0].path,
          {
            folder: "slides",
          }
        );
        backgroundImageUrl = bgResult.secure_url;
        fs.unlink(req.files.backgroundImage[0].path, (err) => {
          if (err) console.error("Không thể xóa file tạm:", err);
        });
      }
    }

    // Parse "features" nếu được gửi dưới dạng JSON
    let features = undefined;
    if (req.body.features) {
      try {
        features = JSON.parse(req.body.features);
      } catch (error) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Features không đúng định dạng JSON" });
      }
    }

    // Tạo slide mới
    const newSlide = new Slider({
      ...req.body,
      features,
      image: imageUrl,
      backgroundImage: backgroundImageUrl,
    });

    // Lưu slide vào cơ sở dữ liệu
    const savedSlide = await newSlide.save();

    res.status(StatusCodes.CREATED).json(savedSlide);
  } catch (error) {
    console.error("Lỗi khi tạo slide:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi server", error });
  }
};

export const updateSlide = async (req, res) => {
  try {
    const slideId = req.params.id;
    let imageUrl;
    let backgroundImageUrl;

    // Kiểm tra và xử lý file upload
    if (req.files) {
      // Xử lý ảnh chính (image)
      if (req.files.image) {
        const result = await cloudinary.uploader.upload(
          req.files.image[0].path,
          {
            folder: "slides",
          }
        );
        imageUrl = result.secure_url;
        fs.unlink(req.files.image[0].path, (err) => {
          if (err) console.error("Không thể xóa file tạm:", err);
        });
      }

      // Xử lý ảnh nền (backgroundImage)
      if (req.files.backgroundImage) {
        const bgResult = await cloudinary.uploader.upload(
          req.files.backgroundImage[0].path,
          {
            folder: "slides",
          }
        );
        backgroundImageUrl = bgResult.secure_url;
        fs.unlink(req.files.backgroundImage[0].path, (err) => {
          if (err) console.error("Không thể xóa file tạm:", err);
        });
      }
    }

    const slide = await Slider.findById(slideId);
    if (!slide) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy slide" });
    }

    // Xóa ảnh cũ khỏi Cloudinary nếu có ảnh mới
    if (imageUrl && slide.image) {
      const publicId = slide.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`slides/${publicId}`);
      } catch (error) {
        console.error("Lỗi khi xóa ảnh cũ:", error);
      }
    }

    if (backgroundImageUrl && slide.backgroundImage) {
      const publicId = slide.backgroundImage.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`slides/${publicId}`);
      } catch (error) {
        console.error("Lỗi khi xóa ảnh nền cũ:", error);
      }
    }

    // Parse "features" nếu được gửi dưới dạng JSON
    const features = req.body.features
      ? JSON.parse(req.body.features)
      : undefined;

    // Cập nhật dữ liệu slide
    slide.set({
      ...req.body,
      features,
      image: imageUrl || slide.image,
      backgroundImage: backgroundImageUrl || slide.backgroundImage,
    });

    const updatedSlide = await slide.save();

    res.status(StatusCodes.OK).json(updatedSlide);
  } catch (error) {
    console.error("Lỗi server:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi server", error });
  }
};

export const deleteSlide = async (req, res) => {
  try {
    const deletedSlide = await Slider.findByIdAndDelete(req.params.id);
    if (!deletedSlide) {
      return res.status(404).json({ message: "Slide not found" });
    }
    res.json({ message: "Slide deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
