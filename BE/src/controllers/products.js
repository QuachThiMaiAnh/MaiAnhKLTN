import Product from "../models/product";
import slugify from "slugify";
import Variant from "../models/variant";
import Category from "../models/category";

export const getAllProducts = async (req, res) => {
  const {
    _page = 1,
    _limit = 9,
    _sort = "createAt",
    _order = "desc",
    _expand = true,
    _price,
    _category,
    _status = "display",
    _search,
    _color,
  } = req.query;

  const options = {
    page: _page,
    limit: _limit,
    sort: { [_sort]: _order === "desc" ? -1 : 1 },
  };
  const populateOptions = _expand
    ? [
        { path: "category", select: "name deleted", match: { deleted: false } },
        { path: "attribites", match: { deleted: false } },
        { path: "comments", match: { deleted: false } },
        {
          path: "variants",
          match: { deleted: false },
        },
      ]
    : [];

  const query = {};

  if (_price) {
    const [minPrice, maxPrice] = _price.split(",");
    query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
  } else {
    query.price = { $gte: 0 };
  }

  if (_category) {
    const categories = Array.isArray(_category) ? _category : [_category];

    // Sử dụng `$in` để kiểm tra nếu `category` trong sản phẩm khớp bất kỳ giá trị nào trong mảng
    query.category = { $in: categories };
  }

  if (_status === "hidden") {
    query.deleted = { $ne: false };
  } else {
    query.deleted = { $ne: true };
  }

  if (_search && _search !== "") {
    query.$or = [
      { name: { $regex: _search, $options: "i" } }, // Tìm kiếm trong trường `name`
      { slug: { $regex: _search, $options: "i" } }, // Tìm kiếm trong trường `description`
    ];
  }

  // console.log(query);

  try {
    const result = await Product.paginate(query, { ...options });
    const populatedDocs = await Product.populate(result.docs, populateOptions);

    // console.log(populatedDocs);

    let listProduct;

    if (_category == "675dadfde9a2c0d93f9ba531") {
      const filteredProducts = populatedDocs.filter((product) => {
        const categoryProduct = product.category.filter(
          (cat) => cat.deleted == false
        );

        const exists = categoryProduct.some(
          (category) => category._id.toString() == "675dadfde9a2c0d93f9ba531"
        );

        return product.category.length == 1 && exists;
      });

      // Gắn lại danh sách sản phẩm đã lọc vào `result` để giữ thông tin phân trang
      listProduct = {
        ...result,
        docs: filteredProducts, // Cập nhật danh sách sản phẩm đã lọc
      };
    } else {
      listProduct = result; // Nếu không lọc, sử dụng toàn bộ `result`
    }

    if (_color) {
      // Nếu _color có giá trị và không phải là "all", thực hiện lọc
      const filteredProducts = populatedDocs.filter((product) => {
        return product.variants.some((variant) => {
          return variant.values.some((value) => {
            console.log(value.toString());
            return value.toString() === _color.toString();
          });
        });
      });

      // Tính toán lại totalDocs và totalPages
      const totalItems = filteredProducts.length; // Tổng số sản phẩm sau khi lọc
      const totalPages = Math.ceil(totalItems / _limit); // _limit là số sản phẩm trên mỗi trang

      // Cập nhật listProduct với dữ liệu đã lọc
      listProduct = {
        ...result,
        docs: filteredProducts,
        totalDocs: totalItems, // Cập nhật totalDocs
        totalPages: totalPages, // Cập nhật totalPages
      };
    } else {
      // Nếu _color là "all" hoặc không có giá trị, giữ nguyên dữ liệu gốc
      listProduct = result;
    }

    const data = {
      data: listProduct.docs, // Sản phẩm
      pagination: {
        currentPage: listProduct.page,
        totalPages: listProduct.totalPages,
        totalItems: listProduct.totalDocs,
      },
    };

    // setTimeout(() => {
    //   res.status(200).json(data);
    // }, 2000);

    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllProductsNoLimit = async (req, res) => {
  const {
    _sort = "createAt",
    _order = "desc",
    _expand = true,
    _price,
    _category,
    _status = "display",
    _search,
  } = req.query;

  const options = {
    sort: { [_sort]: _order === "desc" ? -1 : 1 },
  };

  // Chỉ thêm các trường hợp populate hợp lệ
  const populateOptions = _expand
    ? [
        { path: "category", select: "name deleted", match: { deleted: false } },
        { path: "comments", match: { deleted: false } },
        { path: "variants", match: { deleted: false } },
      ]
    : [];

  const query = {};

  if (_price) {
    const [minPrice, maxPrice] = _price.split(",");
    query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
  } else {
    query.price = { $gte: 0 };
  }

  if (_category) {
    const categories = Array.isArray(_category) ? _category : [_category];
    query.category = { $in: categories };
  }

  if (_status === "hidden") {
    query.deleted = { $ne: false };
  } else {
    query.deleted = { $ne: true };
  }

  if (_search && _search !== "") {
    query.$or = [
      { name: { $regex: _search, $options: "i" } },
      { slug: { $regex: _search, $options: "i" } },
    ];
  }

  try {
    const products = await Product.find(query)
      .sort({ [_sort]: _order === "desc" ? -1 : 1 })
      .populate(populateOptions);

    const data = {
      data: products, // Tất cả sản phẩm
      totalItems: products.length, // Tổng số sản phẩm
    };

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in getAllProductsNoLimit:", error);
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
          select: "-__v", // Loại bỏ __v cho các trường values
        },
        select: "-__v", // Loại bỏ __v cho các trường variants
      })
      .populate({
        path: "category",
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
      .select("-__v"); // Loại bỏ __v cho sản phẩm chính

    if (!data) {
      return res.status(404).json({ message: "No products found" });
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
          select: "-__v", // Loại bỏ __v cho các trường values
        },
        select: "-__v", // Loại bỏ __v cho các trường variants
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
      .select("-__v"); // Loại bỏ __v cho sản phẩm chính

    if (!data) {
      return res.status(404).json({ message: "No products found" });
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

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Chuyển đổi mảng variants, format lại chỉ values
    const arrVariants = product.variants.map((variant) => {
      // Format lại values thành mảng các object
      let formattedValues = variant.values.map((value) => {
        return {
          type: value.type, // Loại của giá trị (Color, Size, Material, ...)
          [value.type]: `${value._id}`, // Kết hợp id và giá trị
        };
      });

      // Giữ nguyên các thuộc tính khác của variant và chỉ thay đổi values
      return {
        _id: variant._id,
        price: variant.price,
        countOnStock: variant.countOnStock,
        image: variant.image,
        values: formattedValues, // Gán values đã format thành mảng object
      };
    });

    return res.status(200).json({
      ...product._doc, // Trả về tất cả các thông tin của sản phẩm
      variants: arrVariants, // Gán lại biến variants với format mới cho values
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
      category,
      variants,
    } = req.body;

    const slug = slugify(req.body.name, "-");

    if (!category.length) {
      // category = ["674f3deca63479f361d8f499"];
      category = ["675dadfde9a2c0d93f9ba531"];
    } else {
      if (category.length > 1) {
        for (let i = 0; i < category.length; i++) {
          const existCategory = await Category.findOne({ _id: category[i] });

          if (!existCategory) {
            return res.status(400).json({ message: "Danh mục không tồn tại" });
          }
        }
      }
    }

    const variantsId = [];
    let priceFinal = Infinity;
    let priceSaleFinal = Infinity;
    let count = 0;
    let totalOriginalPrice = 0;

    for (let i = 0; i < variants.length; i++) {
      const values = variants[i].values.map((obj) => Object.values(obj)[0]);

      count += variants[i].countOnStock;
      totalOriginalPrice +=
        variants[i].originalPrice * variants[i].countOnStock;

      if (priceFinal > variants[i].price) {
        priceFinal = variants[i].price;
      }

      if (
        priceSaleFinal > variants[i].priceSale &&
        variants[i].priceSale != 0
      ) {
        priceSaleFinal = variants[i].priceSale;
      }

      console.log(priceSaleFinal);

      const variant = await Variant({
        price: variants[i].price,
        priceSale: variants[i].priceSale,
        values,
        originalPrice: variants[i].originalPrice,
        countOnStock: variants[i].countOnStock,
        image: variants[i].image,
      }).save();
      variantsId.push(variant._id);
    }

    const data = await Product({
      name,
      price: priceFinal,
      priceSale: priceSaleFinal,
      totalOriginalPrice,
      countOnStock: count,
      image,
      category,
      description,
      descriptionDetail,
      slug: slugify(req.body.name, "-"),
      variants: variantsId,
    }).save();

    return res.status(201).json({
      message: "Tạo sản phẩm thành công",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

    const slug = slugify(req.body.name, "-");

    if (!category.length) {
      category = ["675dadfde9a2c0d93f9ba531"];
    } else {
      console.log(category);
      if (category.length > 1) {
        category = category.filter((cat) => cat !== "675dadfde9a2c0d93f9ba531");
        // for (let i = 0; i < category.length; i++) {
        //   const existCategory = await Category.findOne({ _id: category[i] });

        //   if (!existCategory) {
        //     return res.status(400).json({ message: "Danh mục không tồn tại" });
        //   }
        // }
      }
    }

    const variantsId = [];
    let priceFinal = -Infinity; // ✅ Khởi tạo với giá trị nhỏ nhất
    let priceSaleFinal = Infinity;
    let count = 0;
    let totalOriginalPrice = 0;

    const data = await Product.findOne({ _id: req.params.id });

    // console.log("Data:", data);

    for (let i = 0; i < variants.length; i++) {
      // const values = variants[i].values.map((obj) => Object.values(obj)[0]);
      console.log(`Giá variant ${i}:`, variants[i].price);
      count += variants[i].countOnStock;
      totalOriginalPrice +=
        variants[i].originalPrice * variants[i].countOnStock;

      if (priceFinal < variants[i].price) {
        priceFinal = variants[i].price;
      }

      if (
        priceSaleFinal > variants[i].priceSale &&
        variants[i].priceSale != 0
      ) {
        priceSaleFinal = variants[i].priceSale;
      }

      console.log("Giá giảm giá thấp nhất:", priceFinal);

      // Nếu không có _id cũ thì xóa mềm variant cũ

      const values = variants[i].values.map((obj) => Object.values(obj)[0]);
      const variant = await Variant({
        price: variants[i].price,
        priceSale: variants[i].priceSale,
        originalPrice: variants[i].originalPrice,
        values,
        countOnStock: variants[i].countOnStock,
        image: variants[i].image,
      }).save();
      variantsId.push(variant._id);
    }

    const variantsIdSet = new Set(variantsId.map((id) => id.toString()));

    data.variants.forEach((variant) => {
      if (!variantsIdSet.has(variant["_id"].toString())) {
        hiddenVariant(variant["_id"]);
      }
    });

    const dataRes = await Product.findOneAndUpdate(
      { _id: req.params.id },
      {
        name,
        price: priceFinal,
        priceSale: priceSaleFinal,
        totalOriginalPrice,
        countOnStock: count,
        image,
        category,
        description,
        descriptionDetail,
        slug: slugify(req.body.name, "-"),
        variants: variantsId,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Cập nhật sản phẩm thành công",
      dataRes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const data = await Product.findOne({ _id: req.params.id, deleted: false });
    if (data.length < 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    data.deleted = true;

    await data.save();

    return res.json({ message: "Ẩn sản phẩm thành công", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const displayProduct = async (req, res) => {
  try {
    const data = await Product.findOne({ _id: req.params.id });
    if (data.length < 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    data.deleted = false;

    await data.save();

    return res.json({ message: "Hiển thị sản phẩm thành công", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/** Lấy danh sách sản phẩm liên qua khi KH xem chi tiết SP
1.	Trả về 3 sản phẩm bán chạy nhất (dựa trên count).
2.	Trả về 3 sản phẩm được yêu thích nhất (dựa trên averageRating từ bình luận).
3.	Trả về 3 sản phẩm liên quan cùng danh mục với sản phẩm hiện tại (khác productId).
 */
export const getListRelatedProducts = async (req, res) => {
  try {
    const { categoryId, productId } = req.query;

    // Kiểm tra đầu vào bắt buộc
    if (!categoryId || !productId) {
      return res
        .status(400)
        .json({ message: "Missing categoryId or productId" });
    }

    // 1. Lấy 3 sản phẩm bán chạy nhất (trừ sản phẩm hiện tại)
    const bestSellerProducts = await Product.find({
      deleted: false, // Lọc những sản phẩm chưa bị xóa
      _id: { $ne: productId }, // Trừ rs SP đang xem ra - không lấy
    })
      .sort({ count: -1 }) //Sắp xếp theo count giảm dần → bán chạy nhất
      .limit(3)
      .select("_id name price priceSale image"); //Chỉ chọn một số trường cần thiết để giảm payload.

    // 2. Lấy 3 sản phẩm được đánh giá cao nhất
    const MIN_REVIEWS = 5;
    const GLOBAL_AVG = 4.0;

    const bestFavoriteProducts = await Product.aggregate([
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "productId",
          as: "comments",
        },
      },
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
      {
        $match: {
          _id: { $ne: productId },
          deleted: false,
          weightedRating: { $ne: null },
        },
      },
      { $sort: { weightedRating: -1 } },
      { $limit: 3 },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          priceSale: 1,
          image: 1,
          averageRating: 1,
          reviewCount: 1,
          weightedRating: 1,
        },
      },
    ]);

    // 3. Kiểm tra danh mục và lấy sản phẩm liên quan
    const category = await Category.findById(categoryId);

    let listRelatedProducts = [];
    if (category) {
      listRelatedProducts = await Product.find({
        deleted: false, // không lấy sản phẩm đã bị xóa
        _id: { $ne: productId }, // loại trừ chính sản phẩm hiện tại
        category: { $in: [category._id] }, // lấy sản phẩm cùng danh mục
      })
        .limit(3)
        .select("_id name price priceSale image");
    }

    return res.status(200).json({
      success: true,
      bestSellerProducts,
      bestFavoriteProducts,
      listRelatedProducts,
    });
  } catch (error) {
    console.error("Error in getListRelatedProducts:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

export const getSuggestedKeywords = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.trim() === "") {
      return res.status(400).json([]);
    }

    const keywordClean = removeVietnameseTones(keyword.toLowerCase());

    const products = await Product.find({
      name: { $regex: keyword, $options: "i" },
    })
      .limit(50)
      .select("name");

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

    const allKeywords = products.flatMap((p) => extractNgrams(p.name));

    const filtered = allKeywords
      .filter((k) => removeVietnameseTones(k).includes(keywordClean))
      .filter((value, index, self) => self.indexOf(value) === index);

    return res.status(200).json(filtered.slice(0, 10));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hidden variant when delete product or create new variant
async function hiddenVariant(variantId) {
  await Variant.findOneAndUpdate({ _id: variantId }, { deleted: true });
}
