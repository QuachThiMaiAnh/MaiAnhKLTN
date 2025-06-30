import slugify from "slugify";
import Category from "../models/category";
import Product from "../models/product";

/**
 * Lấy tất cả danh mục theo trạng thái (hiển thị hoặc đã ẩn)
 */
export const getAllCategory = async (req, res) => {
  const { _status = "display" } = req.query;

  try {
    // Nếu _status là "hidden" thì flag = true => tìm danh mục đã bị ẩn
    const isDeleted = _status === "hidden";

    // Tìm tất cả danh mục theo trạng thái
    const categories = await Category.find({ deleted: isDeleted }).sort({
      createdAt: -1, // sắp xếp theo thời gian tạo mới nhất
    });

    // Trả về danh sách danh mục
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Lấy  chi tiết danh mục theo ID, chỉ lấy nếu chưa bị ẩn
 */
export const getCategoryById = async (req, res) => {
  try {
    // Tìm danh mục theo ID và trạng thái chưa bị ẩn
    const category = await Category.findOne({
      _id: req.params.id,
      deleted: false,
    });

    // category là object hoặc null, không nên dùng .length để kiểm tra
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục nào" });
    }

    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Lấy tổng số sản phẩm thuộc về một danh mục cụ thể (chỉ tính sản phẩm chưa bị ẩn)
 */
export const getAllProductWithCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({
      _id: id,
      deleted: false,
    });

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục nào" });
    }

    const productsCount = await Product.countDocuments({
      category: id,
      deleted: false,
    });

    return res.status(200).json({ count: productsCount });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Tạo danh mục mới, yêu cầu tất cả trường bắt buộc và không trùng slug
 */
export const createCategory = async (req, res) => {
  const { name, title, image, description } = req.body;

  try {
    // Kiểm tra dữ liệu đầu vào
    if (!name || !title || !image || !description) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin danh mục" });
    }

    const slug = slugify(name, { lower: true });

    // Kiểm tra danh mục đã tồn tại chưa dựa vào slug
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ message: "Danh mục đã tồn tại" });
    }

    const category = await Category.create({
      name,
      title,
      image,
      description,
      slug,
    });

    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Cập nhật thông tin danh mục theo ID
 */
export const updateCategory = async (req, res) => {
  const { name, title, image, description } = req.body;

  try {
    if (!name || !title || !image || !description) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin danh mục" });
    }

    const slug = slugify(name, { lower: true });

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      {
        name,
        title,
        image,
        description,
        slug,
      },
      { new: true } // Trả về bản ghi sau khi cập nhật
    );

    if (!category) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy danh mục để cập nhật" });
    }

    return res.status(200).json({
      message: "Cập nhật danh mục thành công",
      category,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Ẩn danh mục (soft-delete)
 * Nếu sản phẩm chỉ thuộc danh mục này, thì thêm vào danh mục mặc định
 */
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      deleted: false,
    });

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục nào" });
    }

    // Tìm tất cả sản phẩm thuộc danh mục này và chưa bị ẩn
    const products = await Product.find({
      category: req.params.id,
      deleted: false,
    });

    for (const product of products) {
      // Nếu sản phẩm chỉ có 1 danh mục (category), thêm danh mục mặc định
      if (
        Array.isArray(product.category) &&
        product.category.length <= 1 &&
        !product.category.includes("675dadfde9a2c0d93f9ba531") // Danh mục mặc định
      ) {
        product.category.push("675dadfde9a2c0d93f9ba531");
        await product.save();
      }
    }

    // Đánh dấu danh mục là đã bị ẩn (soft-delete)
    category.deleted = true;
    await category.save();

    return res.status(200).json({ message: "Ẩn danh mục thành công" });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi không ẩn được danh mục" });
  }
};

/**
 * Hiển thị lại danh mục đã bị ẩn
 */
export const displayCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    // Đánh dấu danh mục là đã hiển thị (soft-undelete)
    category.deleted = false;
    await category.save();

    return res
      .status(200)
      .json({ message: "Hiển thị danh mục thành công", data: category });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi không hiển thị được danh mục" });
  }
};
