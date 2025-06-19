import Product from "../models/product";
import slugify from "slugify";
import Variant from "../models/variant";
import Category from "../models/category";

export const getAllProducts = async (req, res) => {
  // 1. Lấy các tham số lọc và phân trang từ query
  const {
    _page = 1, // Trang hiện tại (mặc định là 1)
    _limit = 9, // Số lượng sản phẩm trên mỗi trang (mặc định 9)
    _sort = "createdAt", // Trường sắp xếp (mặc định theo ngày tạo)
    _order = "desc", // Thứ tự sắp xếp: 'asc' hoặc 'desc'
    _expand = true, // Có cần populate liên kết như category, variant không
    _price, // Lọc theo khoảng giá (vd: "100000,300000")
    _category, // Lọc theo ID danh mục (hoặc mảng)
    _status = "display", // Trạng thái sản phẩm (display / hidden)
    _search, // Tìm kiếm theo tên hoặc slug
    _color, // Lọc theo giá trị màu sắc (ID thuộc tính)
  } = req.query;

  // 2. Cấu hình phân trang và sắp xếp
  const options = {
    page: +_page, // ép kiểu sang số
    limit: +_limit,
    sort: { [_sort]: _order === "desc" ? -1 : 1 }, // sort động theo field
    populate:
      _expand === "true" || _expand === true
        ? [
            {
              path: "category",
              select: "name deleted",
              match: { deleted: false }, // chỉ lấy danh mục chưa bị ẩn
            },
            {
              path: "comments",
              match: { deleted: false },
            },
            {
              path: "variants",
              match: { deleted: false },
              populate: {
                path: "values",
                model: "AttributeValue",
                match: { deleted: false },
                select: "-__v",
              },
            },
          ]
        : [],
  };

  // 3. Tạo điều kiện lọc (query MongoDB)
  const query = {};

  // 3.1 Lọc theo khoảng giá (price)
  if (_price) {
    const [min, max] = _price.split(",").map(Number); // tách và ép số
    if (!isNaN(min)) query.price = { $gte: min };
    if (!isNaN(max)) query.price = { ...(query.price || {}), $lte: max };
  } else {
    query.price = { $gte: 0 }; // mặc định giá phải ≥ 0
  }

  // 3.2 Lọc theo danh mục
  if (_category) {
    const categories = Array.isArray(_category)
      ? _category
      : typeof _category === "string"
      ? _category.split(",")
      : [];
    query.category = { $in: categories };
  }

  // 3.3 Lọc theo trạng thái sản phẩm (dùng soft-delete)
  query.deleted = _status === "hidden" ? true : false;

  // 3.4 Tìm kiếm theo từ khóa trong name hoặc slug
  if (_search) {
    query.$or = [
      { name: { $regex: _search, $options: "i" } }, // không phân biệt hoa thường
      { slug: { $regex: _search, $options: "i" } },
    ];
  }

  try {
    // 4. Truy vấn cơ sở dữ liệu với paginate + query
    const result = await Product.paginate(query, options);
    let docs = result.docs;

    // 5.1 Nếu lọc danh mục mặc định (chỉ còn 1 danh mục là mặc định)
    if (_category === "675dadfde9a2c0d93f9ba531") {
      docs = docs.filter((product) => {
        const activeCategories = product.category.filter((c) => !c.deleted);
        return (
          product.category.length === 1 &&
          activeCategories.some(
            (c) => c._id.toString() === "675dadfde9a2c0d93f9ba531"
          )
        );
      });
    }

    // 5.2 Nếu lọc theo giá trị màu sắc (attribute color)
    if (_color) {
      docs = docs.filter((product) =>
        product.variants?.some((variant) =>
          variant.values?.some((val) => val.toString() === _color)
        )
      );
    }

    // 6. Trả kết quả về client
    return res.status(200).json({
      data: docs,
      pagination: {
        currentPage: result.page,
        totalPages: Math.ceil(docs.length / result.limit),
        totalItems: docs.length,
      },
    });
  } catch (error) {
    // 7. Xử lý lỗi và trả về message
    return res.status(400).json({ message: error.message });
  }
};

export const getAllProductsNoLimit = async (req, res) => {
  const {
    _sort = "createdAt",
    _order = "desc",
    _expand = true,
    _price,
    _category,
    _status = "display",
    _search,
  } = req.query;

  const query = {};
  const populateOptions =
    _expand === "true" || _expand === true
      ? [
          {
            path: "category",
            select: "name deleted",
            match: { deleted: false },
          },
          { path: "comments", match: { deleted: false } },
          { path: "variants", match: { deleted: false } },
        ]
      : [];

  if (_price) {
    const [min, max] = _price.split(",");
    query.price = { $gte: +min, $lte: +max };
  } else {
    query.price = { $gte: 0 };
  }

  if (_category) {
    const categories = Array.isArray(_category) ? _category : [_category];
    query.category = { $in: categories };
  }

  query.deleted = _status === "hidden" ? { $ne: false } : { $ne: true };

  if (_search) {
    query.$or = [
      { name: { $regex: _search, $options: "i" } },
      { slug: { $regex: _search, $options: "i" } },
    ];
  }

  try {
    const products = await Product.find(query)
      .sort({ [_sort]: _order === "desc" ? -1 : 1 })
      .populate(populateOptions);

    return res.status(200).json({
      data: products,
      totalItems: products.length,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const data = await Product.findOne({ _id: req.params.id })
      .populate({
        path: "variants",
        populate: {
          path: "values",
          model: "AttributeValue",
          match: { deleted: false },
          select: "-__v",
        },
        select: "-__v",
      })
      .populate("category")
      .populate({
        path: "comments",
        match: { deleted: false },
        populate: {
          path: "userId",
          model: "Users",
          select: { firstName: 1, lastName: 1, imageUrl: 1 },
        },
      })
      .select("-__v");

    if (!data) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductByIdForEdit = async (req, res) => {
  try {
    const data = await Product.findOne({ _id: req.params.id })
      .populate({
        path: "variants",
        populate: {
          path: "values",
          model: "AttributeValue",
          match: { deleted: false },
          select: "-__v",
        },
        select: "-__v",
      })
      .populate({
        path: "comments",
        match: { deleted: false },
        populate: {
          path: "userId",
          model: "Users",
          select: { firstName: 1, lastName: 1, imageUrl: 1 },
        },
      })
      .select("-__v");

    if (!data) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductForEdit = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findOne({ _id: id })
      .populate({
        path: "variants",
        populate: {
          path: "values",
          model: "AttributeValue",
          select: "-__v",
        },
        select: "-__v",
      })
      .select("-__v");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Chuyển đổi lại mảng variants sao cho mỗi giá trị thành object riêng biệt để dễ sử dụng ở frontend
    const arrVariants = product.variants.map((variant) => {
      const formattedValues = variant.values.map((value) => ({
        type: value.type, // Loại thuộc tính (Color, Size...)
        [value.type]: `${value._id}`, // Dạng object có key là type và value là id
      }));

      return {
        _id: variant._id,
        price: variant.price,
        countOnStock: variant.countOnStock,
        image: variant.image,
        values: formattedValues,
      };
    });

    return res.status(200).json({
      ...product._doc, // Trả về toàn bộ dữ liệu sản phẩm
      variants: arrVariants, // Ghi đè variants bằng định dạng đã format
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    let {
      name,
      image,
      price,
      priceSale,
      description,
      descriptionDetail,
      category = [],
      variants = [],
    } = req.body;

    const slug = slugify(name, "-");

    // Nếu không có danh mục nào, gán mặc định danh mục hệ thống
    if (!category.length) {
      category = ["675dadfde9a2c0d93f9ba531"];
    }

    // Kiểm tra tất cả category có tồn tại trong database không
    for (const catId of category) {
      const exists = await Category.findById(catId);
      if (!exists) {
        return res
          .status(400)
          .json({ message: `Danh mục ${catId} không tồn tại` });
      }
    }

    // Khởi tạo biến lưu dữ liệu tạm tính
    const variantsId = [];
    let finalPrice = Infinity; // dùng để tìm giá nhỏ nhất
    let finalPriceSale = Infinity; // dùng để tìm giá sale nhỏ nhất khác 0
    let totalStock = 0; // tổng số lượng tồn kho
    let totalOriginalPrice = 0; // tổng giá gốc của các biến thể

    // Duyệt qua từng biến thể và xử lý
    for (const v of variants) {
      // Chuyển đổi danh sách giá trị thuộc tính thành mảng chỉ gồm _id
      const values = v.values.map((obj) => Object.values(obj)[0]);

      // Cộng dồn số lượng tồn kho và tổng giá gốc
      totalStock += v.countOnStock;
      totalOriginalPrice += v.originalPrice * v.countOnStock;

      // Tìm giá và giá sale nhỏ nhất trong các biến thể
      if (v.price < finalPrice) finalPrice = v.price;
      if (v.priceSale !== 0 && v.priceSale < finalPriceSale) {
        finalPriceSale = v.priceSale;
      }

      // Tạo variant và lưu vào database
      const variant = await new Variant({
        price: v.price,
        priceSale: v.priceSale,
        values, //Id của các giá trị thuộc tính
        originalPrice: v.originalPrice,
        countOnStock: v.countOnStock,
        image: v.image,
      }).save();

      // Lưu _id variant để liên kết với sản phẩm chính
      variantsId.push(variant._id);
    }

    // Tạo sản phẩm chính sau khi đã xử lý xong các biến thể
    const product = await new Product({
      name,
      slug,
      image,
      price: finalPrice, // giá thấp nhất trong các biến thể
      priceSale: finalPriceSale !== Infinity ? finalPriceSale : 0, // giá sale thấp nhất khác 0
      totalOriginalPrice, // tổng giá gốc của các biến thể
      countOnStock: totalStock, // tổng số lượng tồn kho
      category,
      description,
      descriptionDetail,
      variants: variantsId, // lưu mảng _id của các variant
    }).save();

    // Phản hồi thành công
    return res.status(201).json({
      message: "Tạo sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    // Bắt lỗi và phản hồi với mã lỗi 500
    console.error("Lỗi tạo sản phẩm:", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

/**
 * Cập nhật sản phẩm theo ID, xử lý biến thể:
 * - Nếu biến thể có _id → cập nhật
 * - Nếu không có _id → tạo mới
 */
export const updateProduct = async (req, res) => {
  try {
    let {
      name,
      image,
      priceSale,
      description,
      descriptionDetail,
      category,
      variants,
    } = req.body;

    const slug = slugify(name, "-");

    // Gán danh mục mặc định nếu không có hoặc loại bỏ nếu có nhiều
    if (!category.length) {
      category = ["675dadfde9a2c0d93f9ba531"];
    } else if (category.length > 1) {
      category = category.filter((cat) => cat !== "675dadfde9a2c0d93f9ba531");
    }

    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    const variantsId = [];
    let priceFinal = Infinity;
    let priceSaleFinal = Infinity;
    let count = 0;
    let totalOriginalPrice = 0;

    // Duyệt từng biến thể
    for (const v of variants) {
      const values = v.values.map((obj) => Object.values(obj)[0]);

      count += v.countOnStock;
      totalOriginalPrice += v.originalPrice * v.countOnStock;

      if (v.price < priceFinal) priceFinal = v.price;
      if (v.priceSale < priceSaleFinal && v.priceSale !== 0) {
        priceSaleFinal = v.priceSale;
      }

      let variant;

      // Nếu có _id thì cập nhật biến thể cũ
      if (v._id) {
        variant = await Variant.findByIdAndUpdate(
          v._id,
          {
            price: v.price,
            priceSale: v.priceSale,
            originalPrice: v.originalPrice,
            values,
            countOnStock: v.countOnStock,
            image: v.image,
            deleted: false, // Bỏ ẩn nếu trước đó đã bị ẩn
          },
          { new: true }
        );
      } else {
        // Nếu không có _id thì tạo biến thể mới
        variant = await new Variant({
          price: v.price,
          priceSale: v.priceSale,
          originalPrice: v.originalPrice,
          values,
          countOnStock: v.countOnStock,
          image: v.image,
        }).save();
      }

      variantsId.push(variant._id);
    }

    // Ẩn các biến thể cũ không còn được dùng
    const newIdSet = new Set(variantsId.map((id) => id.toString()));
    for (const oldVariantId of existingProduct.variants) {
      if (!newIdSet.has(oldVariantId.toString())) {
        await Variant.findByIdAndUpdate(oldVariantId, { deleted: true });
      }
    }

    // Cập nhật sản phẩm
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        slug,
        image,
        price: priceFinal,
        priceSale: priceSaleFinal !== Infinity ? priceSaleFinal : 0,
        totalOriginalPrice,
        countOnStock: count,
        category,
        description,
        descriptionDetail,
        variants: variantsId,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Cập nhật sản phẩm thành công",
      dataRes: updatedProduct,
    });
  } catch (error) {
    console.error("Lỗi cập nhật sản phẩm:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    // 1. Tìm sản phẩm theo ID và chưa bị ẩn (deleted: false)
    const product = await Product.findOne({
      _id: req.params.id,
      deleted: false,
    });

    // 2. Nếu không tìm thấy sản phẩm phù hợp, trả về lỗi 404
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // 3. Thực hiện soft delete bằng cách cập nhật cờ deleted = true
    product.deleted = true;
    await product.save();

    // 4. Trả về kết quả thành công kèm dữ liệu sản phẩm
    return res
      .status(200)
      .json({ message: "Ẩn sản phẩm thành công", data: product });
  } catch (error) {
    // 5. Xử lý lỗi không xác định
    return res.status(500).json({ message: error.message });
  }
};

export const displayProduct = async (req, res) => {
  try {
    // 1. Tìm sản phẩm theo ID
    const product = await Product.findOne({ _id: req.params.id });

    // 2. Nếu không tồn tại, trả về lỗi
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // 3. Cập nhật trạng thái hiển thị (bỏ ẩn)
    product.deleted = false;
    await product.save();

    // 4. Trả về phản hồi thành công
    return res.status(200).json({
      message: "Hiển thị sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    // 5. Xử lý lỗi hệ thống
    return res.status(500).json({ message: error.message });
  }
};

export const getListRelatedProducts = async (req, res) => {
  try {
    const { categoryId, productId } = req.query;

    // Kiểm tra nếu thiếu categoryId hoặc productId
    if (!categoryId || !productId) {
      return res
        .status(400)
        .json({ message: "Missing categoryId or productId" });
    }

    // 1. Sản phẩm bán chạy nhất (dựa trên số lượng tồn kho cao nhất)
    const bestSellerProducts = await Product.find({
      deleted: false,
      _id: { $ne: productId }, // Loại bỏ sản phẩm hiện tại
    })
      .sort({ count: -1 }) // Sắp xếp giảm dần theo số lượng
      .limit(3)
      .select("_id name price priceSale image");

    // 2. Sản phẩm được yêu thích nhất (trung bình đánh giá có trọng số)
    const MIN_REVIEWS = 5;
    const GLOBAL_AVG = 4.0;

    const bestFavoriteProducts = await Product.aggregate([
      {
        // Tìm các bình luận liên quan đến sản phẩm
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "productId",
          as: "comments",
        },
      },
      // Lọc các bình luận không bị xóa
      {
        $addFields: {
          validComments: {
            $filter: {
              input: "$comments",
              as: "cmt",
              cond: { $eq: ["$$cmt.deleted", false] },
            },
          },
        },
      },
      // Tính toán số lượng bình luận và đánh giá trung bình
      {
        $addFields: {
          reviewCount: { $size: "$validComments" },
          averageRating: {
            $cond: [
              { $gt: [{ $size: "$validComments" }, 0] },
              { $avg: "$validComments.rating" },
              null,
            ],
          },
        },
      },
      // Tính toán đánh giá có trọng số (Theo công thức Bayesian average)
      {
        $addFields: {
          weightedRating: {
            $cond: [
              { $ne: ["$averageRating", null] },
              {
                $add: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          "$reviewCount",
                          { $add: ["$reviewCount", MIN_REVIEWS] },
                        ],
                      },
                      "$averageRating",
                    ],
                  },
                  {
                    $multiply: [
                      {
                        $divide: [
                          MIN_REVIEWS,
                          { $add: ["$reviewCount", MIN_REVIEWS] },
                        ],
                      },
                      GLOBAL_AVG,
                    ],
                  },
                ],
              },
              null,
            ],
          },
        },
      },
      // Loại bỏ sản phẩm hiện tại, chỉ lấy sản phẩm chưa bị xóa và có weightedRating hợp lệ
      {
        $match: {
          _id: { $ne: productId },
          deleted: false,
          weightedRating: { $ne: null },
        },
      },
      // Sắp xếp theo weightedRating giảm dần, giới hạn kết quả
      { $sort: { weightedRating: -1 } },
      { $limit: 3 },
      // Chọn các trường cần thiết để trả về
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          priceSale: 1,
          image: 1,
          averageRating: 1,
          reviewCount: 1,
        },
      },
    ]);

    // 3. Sản phẩm cùng danh mục
    const listRelatedProducts = await Product.find({
      deleted: false,
      _id: { $ne: productId },
      category: { $in: [categoryId] },
    })
      .limit(3)
      .select("_id name price priceSale image");

    return res.status(200).json({
      success: true,
      bestSellerProducts,
      bestFavoriteProducts,
      listRelatedProducts,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

/**
 * Gợi ý từ khóa tìm kiếm từ tên sản phẩm có chứa keyword người dùng nhập.
 * - Dùng $regex để tìm sản phẩm có tên gần giống
 * - Tách tên sản phẩm thành các cụm từ n-gram (1, 2, 3 từ)
 * - Lọc những cụm từ chứa từ khóa (không dấu)
 * - Trả về danh sách gợi ý không trùng nhau
 */
export const getSuggestedKeywords = async (req, res) => {
  try {
    const { keyword } = req.query;

    // Nếu không có từ khóa đầu vào hoặc toàn dấu cách, trả về rỗng
    if (!keyword || keyword.trim() === "") {
      return res.status(400).json([]);
    }

    // Chuẩn hóa từ khóa: bỏ dấu, đưa về lowercase để so khớp không dấu
    const keywordClean = removeVietnameseTones(keyword.toLowerCase());

    // Tìm tối đa 50 sản phẩm có tên chứa từ khóa (không phân biệt hoa thường)
    const products = await Product.find({
      name: { $regex: keyword, $options: "i" },
    })
      .limit(50)
      .select("name");

    /**
     * Tách tên sản phẩm thành các cụm từ n-gram (tối đa 3 từ)
     * VD: "Áo thun trắng form rộng" →
     *  - 1-gram: "áo", "thun", "trắng", "form", "rộng"
     *  - 2-gram: "áo thun", "thun trắng", ...
     *  - 3-gram: "áo thun trắng", ...
     */
    const extractNgrams = (text, maxN = 3) => {
      const words = text.toLowerCase().split(" ");
      const ngrams = [];

      for (let n = 1; n <= maxN; n++) {
        for (let i = 0; i <= words.length - n; i++) {
          ngrams.push(words.slice(i, i + n).join(" "));
        }
      }

      return ngrams;
    };

    // Tạo mảng tất cả n-gram từ tất cả tên sản phẩm
    const allKeywords = products.flatMap((p) => extractNgrams(p.name));

    // Lọc những cụm từ chứa từ khóa (dạng không dấu)
    const filtered = allKeywords
      .filter((k) => removeVietnameseTones(k).includes(keywordClean))
      .filter((value, index, self) => self.indexOf(value) === index); // loại trùng

    // Trả về 10 gợi ý đầu tiên
    return res.status(200).json(filtered.slice(0, 10));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Ẩn biến thể sản phẩm
async function hiddenVariant(variantId) {
  await Variant.findOneAndUpdate({ _id: variantId }, { deleted: true });
}
