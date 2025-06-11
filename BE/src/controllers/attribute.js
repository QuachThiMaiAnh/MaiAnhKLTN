import Attribute from "../models/attribute"; // Import model Attribute (thuộc tính sản phẩm)
import AttributeValue from "../models/attributeValue"; // Import model giá trị thuộc tính

/**
 * Hàm kiểm tra tên thuộc tính đã tồn tại chưa (dựa theo slug),
 * loại trừ chính nó khi đang cập nhật (id hiện tại)
 */
async function checkAttributeExist(name, id) {
  const slugCheck = name
    .replace(/\s+/g, " ")
    .trim()
    .replace(/ /g, "-")
    .toLowerCase();
  // Tìm một thuộc tính có slug giống, nhưng id khác (tránh trùng khi update)
  return !!(await Attribute.findOne({ slug: slugCheck, _id: { $ne: id } }));
}

/**
 * Tạo mới một thuộc tính
 */
export const createAttribute = async (req, res) => {
  try {
    const { name } = req.body;

    // Kiểm tra trùng tên trước khi tạo
    const existAttribute = await checkAttributeExist(name);
    if (existAttribute) {
      return res.status(400).json({ message: "Thuộc tính đã tồn tại" });
    }

    // Chuẩn hoá tên và slug (dùng để hiển thị đẹp và URL-friendly)
    const normalizedName = name.replace(/\s+/g, " ").trim();
    const slug = normalizedName.replace(/ /g, "-").toLowerCase();

    const attribute = await Attribute.create({ name: normalizedName, slug });
    res.status(201).json(attribute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Lấy toàn bộ danh sách thuộc tính, có thể lọc theo trạng thái (đang hiển thị hoặc đã ẩn)
 */
export const getAllAttribute = async (req, res) => {
  const { _status = "display" } = req.query;
  const deletedFlag = _status === "hidden"; // nếu _status là "hidden", nghĩa là muốn lấy thuộc tính đã ẩn

  try {
    const attribute = await Attribute.find({ deleted: deletedFlag })
      .populate({
        path: "values", // lấy thêm thông tin từ bảng giá trị thuộc tính
        match: { deleted: false }, // chỉ lấy giá trị chưa bị ẩn
        model: "AttributeValue",
        select: "-__v", // loại bỏ field __v mặc định của mongoose
      })
      .select("-__v")
      .sort({ updatedAt: -1 }); // sắp xếp theo thời gian cập nhật mới nhất

    if (attribute.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy danh sách thuộc tính" });
    }

    res.status(200).json(attribute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Lấy chi tiết một thuộc tính theo ID (dùng trong admin)
 */
export const getAttributeById = async (req, res) => {
  try {
    const attribute = await Attribute.findOne({ _id: req.params.id }).populate(
      "values"
    );
    if (!attribute) {
      return res.status(404).json({ message: "Không tìm thấy thuộc tính" });
    }
    res.status(200).json(attribute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Lấy chi tiết một thuộc tính (cho client - người dùng cuối)
 * Lọc các giá trị đã bị ẩn
 */
export const getAttributeByIdClient = async (req, res) => {
  try {
    const attribute = await Attribute.findOne({
      _id: req.params.id,
      deleted: false,
    });
    if (!attribute) {
      return res.status(404).json({ message: "Không tìm thấy thuộc tính" });
    }

    // Lấy từng giá trị theo id, kiểm tra không bị xoá
    const arrayValues = await Promise.all(
      attribute.values.map((value) =>
        AttributeValue.findOne({ _id: value, deleted: false })
      )
    );

    const results = {
      ...attribute._doc,
      values: arrayValues.filter(Boolean), // lọc các giá trị null (đã bị xoá)
    };

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Cập nhật tên thuộc tính và cập nhật cả type trong từng giá trị liên quan
 */
export const updateAttribute = async (req, res) => {
  try {
    const { name } = req.body;
    const existAttribute = await checkAttributeExist(name, req.params.id);
    if (existAttribute) {
      return res.status(400).json({ message: "Tên thuộc tính đã tồn tại" });
    }

    const normalizedName = name.replace(/\s+/g, " ").trim();
    const slug = normalizedName.replace(/ /g, "-").toLowerCase();

    const attribute = await Attribute.findOneAndUpdate(
      { _id: req.params.id },
      { name: normalizedName, slug },
      { new: true } // trả về bản ghi mới sau khi cập nhật
    );

    // Cập nhật "type" trong từng giá trị của thuộc tính
    await Promise.all(
      attribute.values.map((value) =>
        AttributeValue.findOneAndUpdate({ _id: value._id }, { type: name })
      )
    );

    res.status(200).json(attribute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Xoá mềm thuộc tính (ẩn khỏi hệ thống, không xoá khỏi database)
 */
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

/**
 * Hiển thị lại thuộc tính đã bị ẩn (xoá mềm)
 */
export const displayAttribute = async (req, res) => {
  try {
    const data = await Attribute.findOne({ _id: req.params.id });
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
 * Xoá thật thuộc tính và các giá trị liên quan (dữ liệu bị xoá khỏi database)
 */
export const deleteAttributeReal = async (req, res) => {
  try {
    const attribute = await Attribute.findOne({ _id: req.params.id });
    if (!attribute) {
      return res.status(404).json({ message: "Không tìm thấy thuộc tính" });
    }

    // Xoá từng giá trị con trước
    for (let i = 0; i < attribute.values.length; i++) {
      await AttributeValue.findByIdAndRemove(attribute.values[i]);
    }

    // Sau đó xoá luôn thuộc tính
    await Attribute.findByIdAndRemove(req.params.id);
    res.status(200).json();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
