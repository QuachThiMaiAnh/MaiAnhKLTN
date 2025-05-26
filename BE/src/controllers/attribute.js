import Attribute from "../models/attribute";
import AttributeValue from "../models/attributeValue";

async function checkAttributeExist(name, id) {
  const slugCheck = name
    .replace(/\s+/g, " ")
    .trim()
    .replace(/ /g, "-")
    .toLowerCase();

  // Tìm một tài liệu phù hợp
  const exists = await Attribute.findOne({ slug: slugCheck, _id: { $ne: id } });

  // Trả về true nếu tài liệu tồn tại, ngược lại false
  return !!exists;
}

export const createAttribute = async (req, res) => {
  try {
    const { name } = req.body;

    const existAttribute = await checkAttributeExist(name);

    if (existAttribute) {
      return res.status(400).json({ message: "Thuộc tính đã tồn tại" });
    }

    const attribute = await Attribute.create({
      name: name.replace(/\s+/g, " ").trim(),
      slug: name.replace(/\s+/g, " ").trim().replace(/ /g, "-").toLowerCase(),
    });
    res.status(201).json(attribute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAttribute = async (req, res) => {
  const { _status = "display" } = req.query;

  let flag;
  if (_status === "hidden") {
    flag = true;
  } else {
    flag = false;
  }

  try {
    const attribute = await Attribute.find({ deleted: flag })
      .populate({
        path: "values",
        match: { deleted: false },
        model: "AttributeValue",
        select: "-__v",
      })
      .select("-__v")
      .sort({ updatedAt: -1 });

    if (attribute.length < 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy danh sách thuộc tính" });
    }
    res.status(200).json(attribute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttributeById = async (req, res) => {
  try {
    const attribute = await Attribute.findOne({ _id: req.params.id }).populate(
      "values"
    );

    if (attribute.length < 0) {
      return res.status(404).json({ message: "Không tìm thấy thuộc tính" });
    }
    res.status(200).json(attribute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttributeByIdClient = async (req, res) => {
  try {
    // Tìm thuộc tính với điều kiện `_id` và `deleted`
    const attribute = await Attribute.findOne({
      _id: req.params.id,
      deleted: false,
    });

    // Kiểm tra nếu không tìm thấy thuộc tính
    if (!attribute) {
      return res.status(404).json({ message: "Không tìm thấy thuộc tính" });
    }

    // Sử dụng Promise.all để xử lý song song các giá trị
    const arrayValues = await Promise.all(
      attribute.values.map(async (value) => {
        return await AttributeValue.findOne({
          _id: value,
          deleted: false,
        });
      })
    );

    // Tạo kết quả cuối cùng
    const results = {
      ...attribute._doc,
      values: arrayValues,
    };

    // Trả về dữ liệu
    res.status(200).json(results);
  } catch (error) {
    // Xử lý lỗi
    res.status(500).json({ message: error.message });
  }
};

export const updateAttribute = async (req, res) => {
  try {
    const { name } = req.body;

    const existAttribute = await checkAttributeExist(name, req.params.id);

    if (existAttribute) {
      return res.status(400).json({ message: "Tên thuộc tính đã tồn tại" });
    }

    console.log("CONTINUE");

    const attribute = await Attribute.findOneAndUpdate(
      { _id: req.params.id },
      {
        name: name.replace(/\s+/g, " ").trim(),
        slug: name.replace(/\s+/g, " ").trim().replace(/ /g, "-").toLowerCase(),
      },
      { new: true }
    );

    const newTypeForAttributeValues = await Promise.all(
      attribute.values.map(async (value) => {
        return await AttributeValue.findOneAndUpdate(
          {
            _id: value._id,
          },
          {
            type: name,
          },
          { new: true }
        );
      })
    );

    // if (attribute.length < 0) {
    //   return res.status(404).json({ message: "Không tìm thấy thuộc tính" });
    // }
    res.status(200).json(attribute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAttribute = async (req, res) => {
  try {
    const attribute = await Attribute.findByIdAndUpdate(
      { _id: req.params.id },
      { deleted: true },
      { new: true }
    );
    if (!attribute) {
      return res.status(404).json({ message: "Không tìm thấy thuộc tính" });
    }
    res.status(200).json();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const displayAttribute = async (req, res) => {
  try {
    const data = await Attribute.findOne({ _id: req.params.id });
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

export const deleteAttributeReal = async (req, res) => {
  try {
    const attribute = await Attribute.findOne({ _id: req.params.id });
    if (!attribute) {
      return res.status(404).json({ message: "Không tìm thấy thuộc tính" });
    }

    for (let i = 0; i < attribute.values.length; i++) {
      await AttributeValue.findByIdAndRemove({
        _id: attribute.values[i],
      });
    }

    await Attribute.findByIdAndRemove({ _id: req.params.id });

    res.status(200).json();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
