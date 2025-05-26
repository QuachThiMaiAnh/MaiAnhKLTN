import slugify from "slugify";
import Category from "../models/category";
import Product from "../models/product";

export const getAllCategory = async (req, res) => {
  const { _status = "display" } = req.query;

  try {
    let flag;
    if (_status === "hidden") {
      flag = true;
    } else {
      flag = false;
    }

    const category = await Category.find({
      deleted: flag,
    }).sort({ createdAt: 1 });

    if (category.length < 0) {
      return res.status(400).json({ message: "Không tìm thấy danh mục nào" });
    }

    // const results = category.filter((item) => !item.defaultCategory);

    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      deleted: false,
    });

    if (category.length < 0) {
      return res.status(400).json({ message: "Không tìm thấy danh mục nào" });
    }
    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllProductWithCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({
      _id: id,
      deleted: false,
    });

    if (category.length < 0) {
      return res.status(400).json({ message: "Không tìm thấy danh mục nào" });
    }

    const productsCount = await Product.count({
      category: id,
      deleted: false,
    });

    return res.status(200).json({
      count: productsCount,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  const { name, title, image, description } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: "Tên danh mục bắt buộc phải có" });
    }

    if (!title) {
      return res
        .status(400)
        .json({ message: "Tên tiêu đề danh mục bắt buộc phải có" });
    }

    if (!image) {
      return res
        .status(400)
        .json({ message: "Ảnh danh mục danh mục bắt buộc phải có" });
    }

    if (!description) {
      return res
        .status(400)
        .json({ message: "Mô tả danh mục danh mục bắt buộc phải có" });
    }

    const slug = slugify(name, "-");

    const categoryExist = await Category.findOne({
      slug,
    });

    if (categoryExist) {
      return res.status(400).json({ message: "Danh mục đã tồn tại" });
    }

    const category = await Category.create({
      name,
      title,
      image,
      description,
      slug: slugify(req.body.name, "-"),
    });
    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  const { name, title, image, description } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: "Tên danh mục bắt buộc phải có" });
    }

    if (!title) {
      return res
        .status(400)
        .json({ message: "Tên tiêu đề danh mục bắt buộc phải có" });
    }

    if (!image) {
      return res
        .status(400)
        .json({ message: "Ảnh danh mục danh mục bắt buộc phải có" });
    }

    if (!description) {
      return res
        .status(400)
        .json({ message: "Mô tả danh mục danh mục bắt buộc phải có" });
    }

    const newSlug = slugify(name, "-");

    // const categoryExist = await Category.findOne({
    //   slug: newSlug,
    // });

    // if (categoryExist) {
    //   return res.status(400).json({ message: "Danh mục đã tồn tại" });
    // }

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      {
        name,
        title,
        image,
        description,
        slug: newSlug,
      },
      { new: true }
    );
    if (category.length < 0) {
      return res.status(400).json({ message: "Không tìm thấy danh mục nào" });
    }
    return res.status(200).json({
      message: "Cập nhật danh mục thành công",
      category,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      deleted: false,
    });

    if (!category) {
      return res.status(400).json({ message: "Không tìm thấy danh mục nào" });
    }

    const products = await Product.find({
      category: req.params.id,
      deleted: false,
    });

    for (const product of products) {
      if (
        Array.isArray(product.category) &&
        product.category.length <= 1 &&
        !product.category.includes("675dadfde9a2c0d93f9ba531")
      ) {
        product.category.push("675dadfde9a2c0d93f9ba531");
        await product.save(); // Lưu thay đổi vào cơ sở dữ liệu
      }
    }

    category.deleted = true;

    await category.save();

    return res.status(200).json({ message: "Ẩn danh mục thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi không ẩn được danh mục" });
  }
};

export const displayCategory = async (req, res) => {
  try {
    const data = await Category.findOne({ _id: req.params.id });
    if (data.length < 0) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    data.deleted = false;

    await data.save();

    return res.json({ message: "Hiển thị danh mục thành công", data });
  } catch (error) {
    res.status(500).json({ message: "Lỗi không hiển thị được danh mục" });
  }
};
