import cloudinary from "../config/cloudinary";
import Blog from "../models/blog";
import fs from "fs";

// Tạo bài viết mới
export const createBlog = async (req, res) => {
  try {
    const { content, title, category, author, description, image } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!title || !category || !author || !description || !content || !image) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
    }

    const newBlog = new Blog({
      title,
      category,
      author,
      description,
      content,
      image,
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error("Lỗi khi lưu bài viết:", error);
    res.status(500).json({ message: "Lỗi khi tạo bài viết", error });
  }
};

// Lấy tất cả bài viết (không phân trang)
export const getBlogs = async (req, res) => {
  try {
    const { category, search } = req.query;

    const filter = {};

    if (category) {
      filter.category = category; // Lọc theo danh mục
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } }, // Tìm theo tiêu đề
        { author: { $regex: search, $options: "i" } }, // Tìm theo tác giả
      ];
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 }); // Sắp xếp mới nhất

    res.status(200).json(blogs);
  } catch (error) {
    console.error("Lỗi khi lấy bài viết:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Lấy bài viết theo ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error("Lỗi khi lấy bài viết:", error);
    res.status(500).json({ message: "Lỗi khi lấy bài viết", error });
  }
};

// Cập nhật bài viết
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, title, category, author, description, image } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!title || !category || !author || !description || !content) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
    }

    // Tìm bài viết hiện tại
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }

    // Cập nhật các trường khác
    existingBlog.title = title;
    existingBlog.category = category;
    existingBlog.author = author;
    existingBlog.description = description;
    existingBlog.content = content;

    // Cập nhật ảnh nếu có URL mới
    if (image) {
      existingBlog.image = image;
    }

    // Lưu bài viết đã cập nhật
    await existingBlog.save();

    return res.status(200).json(existingBlog);
  } catch (error) {
    console.error("Lỗi khi cập nhật bài viết:", error);
    return res.status(500).json({ message: "Lỗi khi cập nhật bài viết" });
  }
};

// Xóa bài viết
export const deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }
    res.status(200).json({ message: "Xóa bài viết thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa bài viết:", error);
    res.status(500).json({ message: "Lỗi khi xóa bài viết", error });
  }
};
