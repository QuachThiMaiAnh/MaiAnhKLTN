import { StatusCodes } from "http-status-codes";
import Cart from "../models/cart";
import Product from "../models/product";
import Variant from "../models/variant";
import WishList from "../models/wishlist";

export const getWishListByUserId = async (req, res) => {
  const id = req.params.id;

  try {
    let wishList = await WishList.findOne({ userId: id }).populate({
      path: "products.productItem",
      match: { deleted: false },
      populate: [{ path: "category", options: { strictPopulate: false } }],
    });

    if (!wishList) {
      wishList = await WishList.create({
        userId: id,
        products: [],
      });
      return res.status(StatusCodes.OK).json(wishList);
    }

    // console.log(wishList);

    // cart = await updateTotal(cart);
    return res.status(StatusCodes.OK).json(wishList);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const addToWishList = async (req, res) => {
  const { userId, productId, variantId, quantity = 1 } = req.body;

  try {
    if (!userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Vui lòng đăng nhập" });
    }

    if (!productId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Vui lòng chọn sản phẩm" });
    }

    let wishList = await WishList.findOne({ userId: userId }).populate(
      "products.productItem"
    );

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy sản phẩm" });
    }

    if (!wishList) {
      wishList = await WishList.create({
        userId: userId,
        products: [],
      });
    }

    //ktra sp trùng lặp trong giỏ hàng
    const existProductIndex = wishList.products.findIndex(
      (item) =>
        // console.log("ITEM: ", item)
        item.productItem._id.toString() == productId
    );

    console.log("EXIST PRODUCT INDEX: ", existProductIndex);

    //nếu có sp trùng lặp thì xóa
    if (existProductIndex !== -1) {
      wishList.products = wishList.products.filter(
        (item) => item.productItem._id.toString() !== productId
      );

      await wishList.save();

      return res.status(StatusCodes.OK).json({
        message: "Sản phẩm đã được xóa khỏi danh sách yêu thích",
      });
    } else {
      wishList.products.push({
        productItem: productId,
      });

      await wishList.save();
    }

    await wishList.save();
    return res.status(StatusCodes.OK).json({
      message: "Sản phẩm đã được thêm vào danh sách yêu thích",
      wishList,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const increase = async (req, res) => {
  const { userId, productId, variantId } = req.body;
  try {
    let wishList = await WishList.findOne({ userId: userId })
      .populate("products.productItem")
      .populate("products.variantItem");

    if (!wishList) {
      wishList = await Cart.create({
        userId: userId,
        products: [],
      });
    }

    //tìm sp mình nhấn tăng trong giỏ hàng
    const existProductIndex = wishList.products.findIndex(
      (item) =>
        item.productItem._id.toString() == productId &&
        item.variantItem._id.toString() == variantId
    );

    if (existProductIndex !== -1) {
      // console.log(cart.products[existProductIndex].variantItem.countOnStock)
      //kiểm tra tồn kho
      if (
        wishList.products[existProductIndex].variantItem.countOnStock >
        wishList.products[existProductIndex].quantity
      ) {
        wishList.products[existProductIndex].quantity++;
      } else {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Tồn kho đạt giới hạn" });
      }
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy sản phẩm" });
    }

    // cart.products.push({ productItem: products, variantItem: variant, quantity: quantity })

    await wishList.save();

    return res.status(StatusCodes.OK).json(wishList);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const decrease = async (req, res) => {
  const { userId, productId, variantId } = req.body;
  try {
    let wishList = await WishList.findOne({ userId: userId })
      .populate("products.productItem")
      .populate("products.variantItem");

    if (!wishList) {
      wishList = await Cart.create({
        userId: userId,
        products: [],
      });
    }

    //tìm sp mình nhấn giảm trong giỏ hàng
    const existProductIndex = wishList.products.findIndex(
      (item) =>
        item.productItem._id.toString() == productId &&
        item.variantItem._id.toString() == variantId
    );

    if (existProductIndex !== -1) {
      //nếu số lượng = 1 thì lọc ra khỏi giỏ hàng
      if (wishList.products[existProductIndex].quantity === 1) {
        wishList.products = wishList.products.filter(
          (item) =>
            (item.productItem &&
              item.productItem._id.toString() !== productId) ||
            (item.variantItem && item.variantItem._id.toString() !== variantId)
        );
        await wishList.save();

        return res.status(StatusCodes.OK).json(wishList);
      } else {
        wishList.products[existProductIndex].quantity--;
      }
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Không tìm thấy sản phẩm" });
    }

    await wishList.save();
    return res.status(StatusCodes.OK).json(wishList);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  const { userId, productId, variantId, quantity } = req.body;
  try {
    let wishList = await WishList.findOne({ userId: userId })
      .populate("products.productItem")
      .populate("products.variantItem");

    if (!wishList) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy danh sách yêu thích" });
    }

    //tìm sp mình nhấn tăng trong giỏ hàng
    const existProductIndex = wishList.products.findIndex(
      (item) =>
        item.productItem._id.toString() == productId &&
        item.variantItem._id.toString() == variantId
    );

    if (existProductIndex !== -1) {
      //kiểm tra tồn kho
      if (quantity <= 0) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Số lượng phải lớn hơn 0" });
      } else if (
        wishList.products[existProductIndex].variantItem.countOnStock >=
        quantity
      ) {
        wishList.products[existProductIndex].quantity = quantity;
      } else {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ message: "Tồn kho đạt giới hạn" });
      }
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy sản phẩm" });
    }

    // cart.products.push({ productItem: products, variantItem: variant, quantity: quantity })

    await wishList.save();

    return res.status(StatusCodes.OK).json(wishList);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const removeItem = async (req, res) => {
  const { userId, productId, variantId } = req.body;
  try {
    let wishList = await WishList.findOne({ userId: userId }).populate(
      "products.productItem"
    );

    if (!wishList) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy giỏ hàng" });
    }

    //tìm sp và lọc ra khỏi giỏ hàng
    wishList.products = wishList.products.filter(
      (item) =>
        item.productItem && item.productItem._id.toString() !== productId
    );

    await wishList.save();

    // console.log(cart.products)
    return res.status(StatusCodes.OK).json(wishList);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const changeVariant = async (req, res) => {
  const { userId, productId, variantId, newVariantId } = req.body;
  try {
    let wishList = await WishList.findOne({ userId: userId });

    //kiểm tra biến thể mới có tồn tại hay không
    const variant = await Variant.findOne({
      _id: newVariantId,
      deleted: false,
    });

    // console.log("variant: ", variant);

    if (!variant) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Biến thể không tồn tại?!" });
    }

    const product = await Product.findOne({
      _id: productId,
      deleted: false,
    }).populate({
      path: "variants",
      match: { deleted: false },
    });
    const variantValue = await Variant.findOne({
      _id: variantId,
      deleted: false,
    });

    if (!product || !variantValue) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy Product hoặc Biến thể của Product" });
    }

    //Check newVariantId có trong SP đó hay ko
    const exitVariantProduct = product.variants.findIndex(
      (item) => item._id.toString() === newVariantId && item.deleted === false
    );

    // console.log("product: ", product);

    if (exitVariantProduct === -1) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Biến thể mới không tồn tại" });
    }

    //kiểm tra xem biến thể mới có bị trùng lặp không
    const exitItem = wishList.products.findIndex(
      (item) =>
        item.productItem._id.toString() == productId &&
        item.variantItem._id.toString() == newVariantId
    );
    if (exitItem !== -1) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Sản phẩm trùng lặp!" });
    }

    //Tìm vị trí sản phẩm thay đổi biến thể
    const itemIndex = wishList.products.findIndex(
      (item) =>
        item.productItem.toString() == productId &&
        item.variantItem.toString() == variantId
    );
    if (itemIndex === -1) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không thể tìm được sản phẩm cần đổi?!" });
    }

    wishList.products[itemIndex].variantItem = newVariantId;
    wishList.products[itemIndex].quantity = 1;
    await wishList.save();
    return res.status(StatusCodes.OK).json(wishList);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
