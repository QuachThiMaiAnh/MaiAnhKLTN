import Attribute from "../models/attribute";
import AttributeValue from "../models/attributeValue";

export const getAllAttributeValue = async (req, res) => {
  try {
    const response = await AttributeValue.find();
    if (response.length < 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy giá trị thuộc tính" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttributeValueById = async (req, res) => {
  try {
    const response = await AttributeValue.findOne({ _id: req.params.id });
    if (response.length < 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy giá trị thuộc tính" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttributeValueByAttributeId = async (req, res) => {
  const { _status = "display" } = req.query;

  let flag;
  if (_status === "hidden") {
    flag = true;
  } else {
    flag = false;
  }

  try {
    console.log(req.params.id);
    const data = await Attribute.find({
      _id: req.params.id,
      // deleted: flag,
    }).populate({
      path: "values",
      model: "AttributeValue",
      match: { deleted: flag },
      select: "-__v",
    });
    if (data.length < 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy giá trị thuộc tính" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAttributeValue = async (req, res) => {
  try {
    const id = req.params.id; //id Attribute
    console.log(req.body);

    const { name, value, type } = req.body;

    const checkName = await checkNameExist(name, id);

    if (checkName) {
      return res.status(400).json({
        message: "Tên giá trị thuộc tính đã tồn tại",
      });
    }

    const attribute = await Attribute.findOne({ _id: id });

    if (!attribute) {
      return res.status(404).json({ message: "Không tìm thấy thuộc tính" });
    }

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

    if (response.length < 0) {
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

export const removeAttributeValue = async (req, res) => {
  try {
    const response = await AttributeValue.findOneAndUpdate(
      { _id: req.params.id },
      { deleted: true },
      { new: true }
    );
    if (response.length < 0) {
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

export const displayAttributeValue = async (req, res) => {
  try {
    const data = await AttributeValue.findOne({ _id: req.params.id });
    if (data.length < 0) {
      return res.status(404).json({ message: "Không tìm thấy thuộc tính" });
    }

    data.deleted = false;

    await data.save();

    return res.json({ message: "Hiển thị thuộc tính thành công", data });
  } catch (error) {
    res.status(500).json({ message: "Lỗi không hiển thị được thuộc tính" });
  }
};

// Utils
async function checkNameExist(name, id) {
  const slugCheck = name
    .replace(/\s+/g, " ")
    .trim()
    .replace(/ /g, "-")
    .toLowerCase();

  // Tìm một tài liệu phù hợp
  const exists = await AttributeValue.findOne({
    slugName: slugCheck,
    _id: { $ne: id },
  });

  // Trả về true nếu tài liệu tồn tại, ngược lại false
  return !!exists;
}
