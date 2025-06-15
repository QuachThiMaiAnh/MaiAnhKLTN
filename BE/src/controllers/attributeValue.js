import Attribute from "../models/attribute";
import AttributeValue from "../models/attributeValue";

/**
 * Lấy tất cả giá trị của thuộc tính (không phân biệt thuộc tính cha)
 */
export const getAllAttributeValue = async (req, res) => {
  try {
    const response = await AttributeValue.find();

    // Nếu không có giá trị nào
    if (response.length <= 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy giá trị thuộc tính" });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Lấy chi tiết giá trị thuộc tính theo ID
 */
export const getAttributeValueById = async (req, res) => {
  try {
    const response = await AttributeValue.findOne({ _id: req.params.id });

    if (!response) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy giá trị thuộc tính" });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Lấy tất cả giá trị thuộc tính theo ID của Attribute cha
 * Có lọc theo trạng thái ẩn/hiển
 */
export const getAttributeValueByAttributeId = async (req, res) => {
  const { _status = "display" } = req.query;
  const flag = _status === "hidden";

  try {
    // Tìm thuộc tính cha và populate giá trị con
    const data = await Attribute.find({
      _id: req.params.id,
    }).populate({
      path: "values",
      model: "AttributeValue",
      match: { deleted: flag }, // Lọc theo trạng thái ẩn/hiển
      select: "-__v",
    });

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy giá trị thuộc tính" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Tạo giá trị mới cho một thuộc tính (Attribute)
 */
export const createAttributeValue = async (req, res) => {
  try {
    const id = req.params.id; // ID của Attribute cha
    const { name, value, type } = req.body; // Lấy thông tin giá trị thuộc tính từ body

    // Kiểm tra tên đã tồn tại chưa
    const checkName = await checkNameExist(name, id);
    if (checkName) {
      return res.status(400).json({
        message: "Tên giá trị thuộc tính đã tồn tại",
      });
    }

    // Tìm thuộc tính cha
    const attribute = await Attribute.findOne({ _id: id });
    if (!attribute) {
      return res.status(404).json({ message: "Không tìm thấy thuộc tính" });
    }

    // Tạo giá trị mới
    const response = await AttributeValue.create({
      name: name.replace(/\s+/g, " ").trim(),
      slugName: name
        .replace(/\s+/g, " ")
        .trim()
        .replace(/ /g, "-")
        .toLowerCase(),
      value,
      type,
    });

    // Gán giá trị mới vào thuộc tính cha
    const addValue = {
      ...attribute._doc,
      values: [...attribute.values, response._id],
    };

    const attributeNewValue = await Attribute.findOneAndUpdate(
      { _id: id },
      addValue,
      { new: true }
    ).populate({
      path: "values",
      model: "AttributeValue",
      match: { deleted: false },
      select: "-__v",
    });

    return res.status(201).json({
      message: "Giá trị thuộc tính đã được tạo",
      data: attributeNewValue,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Cập nhật giá trị của thuộc tính
 */
export const updateAttributeValue = async (req, res) => {
  try {
    const { name, type, value, _id } = req.body;

    const attributeValue = await AttributeValue.findOne({
      _id: req.params.id,
      deleted: false,
    });

    if (!attributeValue) {
      return res
        .status(400)
        .json({ message: "Không tìm thấy giá trị attribute" });
    }

    const checkName = await checkNameExist(name, _id);
    if (checkName) {
      return res.status(400).json({
        message: "Tên giá trị thuộc tính đã tồn tại",
      });
    }

    const response = await AttributeValue.findOneAndUpdate(
      { _id: req.params.id },
      {
        name: name.replace(/\s+/g, " ").trim(),
        slugName: name
          .replace(/\s+/g, " ")
          .trim()
          .replace(/ /g, "-")
          .toLowerCase(),
        type,
        value,
      },
      { new: true }
    );

    if (!response) {
      return res.status(400).json({
        message: "Không tìm thấy giá trị attribute. Cập nhật thất bại",
      });
    }

    return res.status(200).json({
      message: "Giá trị attribute đã được cập nhật",
      data: response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Xoá mềm (ẩn) giá trị thuộc tính
 */
export const removeAttributeValue = async (req, res) => {
  try {
    const response = await AttributeValue.findOneAndUpdate(
      { _id: req.params.id },
      { deleted: true },
      { new: true }
    );

    if (!response) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy giá trị attribute" });
    }

    return res.status(200).json({
      message: "Giá trị attribute đã được xóa",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Hiển thị lại giá trị thuộc tính đã xoá mềm
 */
export const displayAttributeValue = async (req, res) => {
  try {
    const data = await AttributeValue.findOne({ _id: req.params.id });

    if (!data) {
      return res.status(404).json({ message: "Không tìm thấy thuộc tính" });
    }

    data.deleted = false;
    await data.save();

    return res.json({ message: "Hiển thị thuộc tính thành công", data });
  } catch (error) {
    res.status(500).json({ message: "Lỗi không hiển thị được thuộc tính" });
  }
};

/**
 * Hàm kiểm tra tên có tồn tại không (slugName để so sánh)
 */
async function checkNameExist(name, id) {
  const slugCheck = name
    .replace(/\s+/g, " ")
    .trim()
    .replace(/ /g, "-")
    .toLowerCase();

  const exists = await AttributeValue.findOne({
    slugName: slugCheck,
    _id: { $ne: id }, // Loại trừ chính nó (khi update)
  });

  return !!exists;
}
