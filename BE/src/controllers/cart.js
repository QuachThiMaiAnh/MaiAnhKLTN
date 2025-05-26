import { StatusCodes } from "http-status-codes";
import Cart from "../models/cart";
import Voucher from "../models/voucher";
import Product from "../models/product";
import Variant from "../models/variant";
import VoucherUsage from "../models/voucherUsage";

const updateTotal = async (cart) => {
  let total = cart.products.reduce((acc, item) => {
    return item.selected
      ? acc +
      (item.variantItem.priceSale > 0
        ? item.variantItem.priceSale
        : item.variantItem.price) *
      item.quantity
      : acc;
  }, 0);
  cart.subTotal = total;
  // console.log(cart.voucher)
  let totalDiscount = 0;
  let totalShip = 30000;

  if (cart.voucher && cart.voucher.length > 0) {
    const date = new Date();
    cart.voucher.forEach((voucher) => {
      // check hạn sử dụng code và loại code phải là product
      const presentTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
      let startDate = new Date(voucher.startDate);
      let endDate = new Date(voucher.endDate);
      let status = voucher.status;

      //nếu trạng thái inactive sẽ bị xóa khỏi giỏ hàng
      // if (status === "inactive") {
      //   cart.voucher = cart.voucher.filter((item) => item._id !== voucher._id);
      // }

      //nếu voucher hết hạn sẽ bị xóa khỏi giỏ hàng
      // if (presentTime <= startDate || presentTime >= endDate) {
      //   cart.voucher = cart.voucher.filter((item) => item._id !== voucher._id);
      // }

      if (
        presentTime >= startDate &&
        presentTime <= endDate &&
        voucher.category === "product"
      ) {
        if (voucher.type === "fixed") {
          totalDiscount += voucher.discount;
        } else if (voucher.type === "percent") {
          totalDiscount += (total * voucher.discount) / 100;
        }
      }

      // if (
      //   presentTime >= startDate &&
      //   presentTime <= endDate &&
      //   voucher.category === "ship"
      // ) {
      //   if (voucher.type === "fixed") {
      //     totalShip = totalShip - voucher.discount;
      //     if (totalShip < 0) totalShip = 0;
      //   } else if (voucher.type === "percent") {
      //     totalShip = totalShip - (totalShip * voucher.discount) / 100;
      //     if (totalShip < 0) totalShip = 0;
      //   }
      // }
    });
  }

  // total -= totalDiscount;

  //Tránh âm tiền
  // console.log(totalDiscount)
  if (totalDiscount >= total) {
    total = 0;
  } else {
    total -= totalDiscount;
  }

  cart.ship = totalShip;
  cart.discount = totalDiscount;
  cart.total = total + totalShip;
  await cart.save();
  return cart;
};

export const getCartByUserId = async (req, res) => {
  const id = req.params.id;
  // console.log(userId)
  try {
    let cart = await Cart.findOne({ userId: id })
      .populate({
        path: "products.productItem",
        populate: [
          { path: "attribute", options: { strictPopulate: false } }, // Bỏ qua kiểm tra schema
          { path: "category", options: { strictPopulate: false } },
        ],
        // match: { deleted: false },
      })
      .populate({
        path: "products.variantItem",
        populate: { path: "values" },
        // match: { deleted: false },
      })
      .populate("voucher");
    if (!cart) {
      cart = await Cart.create({
        userId: id,
        products: [],
        voucher: [],
        total: 0,
      });
      return res.status(StatusCodes.OK).json(cart);
    }

    // const products = cart.products.filter((product) => product.productItem !== null && product.variantItem !== null);
    // cart.products = products;

    await cart.save();
    cart = await updateTotal(cart);
    // console.log("cart", cart)
    // cart.total += 30000;
    await cart.save();
    return res.status(StatusCodes.OK).json(cart);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  const { userId, productId, variantId, quantity } = req.body;

  // console.log(req.body);

  try {
    let cart = await Cart.findOne({ userId: userId })
      .populate("products.productItem")
      .populate("products.variantItem")
      .populate("voucher");

    // console.log("CART: ", cart);

    const product = await Product.findOne({ _id: productId });
    const variantValue = await Variant.findOne({ _id: variantId });

    // console.log("PR: ", product._id);
    // console.log(variantValue);

    if (!userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không tìm thấy người dùng" });
    }

    if (!product || !variantValue) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({
          message: "Không tìm thấy sản phẩm hoặc Biến thể của sản phẩm",
        });
    }

    // kiểm tra xem sản phẩm hoặc biến thể có bị xóa mềm hay không
    if (product.deleted === true || variantValue.deleted === true) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Sản phẩm hoặc thuộc tính đã bị xóa" });
    }

    //Check variantId có trong SP đó hay ko
    const exitVariantProduct = product.variants.findIndex(
      (item) => item.toString() === variantId
    );
    if (exitVariantProduct === -1) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy Biến thể" });
    }

    // console.log("ADD TO CART");

    if (!cart) {
      cart = await Cart.create({
        userId: userId,
        products: [],
        voucher: [],
        total: 0,
      });

      // console.log("CREATE CART");
    }

    // console.log("CONTINUE");

    //ktra sp trùng lặp trong giỏ hàng
    const existProductIndex = cart.products.findIndex(
      (item) =>
        // console.log("ITEM: ", item)
        item.productItem._id.toString() == productId &&
        item.variantItem._id.toString() == variantId
    );

    // console.log("EXIST: ", existProductIndex);

    //nếu có sp trùng lặp thì tăng số lượng
    if (existProductIndex !== -1) {
      // kiểm tra số lượng quantity khi thêm vào so với số lượng tồn kho
      if (
        cart.products[existProductIndex].quantity + +quantity <=
        cart.products[existProductIndex].variantItem.countOnStock
      ) {
        cart.products[existProductIndex].quantity += +quantity;
      } else {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ message: "Không thể vượt quá số lượng tồn kho" });
      }
      // return res.status(StatusCodes.OK).json({ message: "Product found" });
    } else {
      // Sp mới thêm giỏ hàng lần đầu
      // kiểm tra số lượng quantity khi thêm vào so với số lượng tồn kho
      if (quantity <= variantValue.countOnStock) {
        cart.products.push({
          productItem: productId,
          variantItem: variantId,
          quantity: +quantity,
          selected: true,
        });
      } else {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ message: "Không thể vượt quá tồn kho" });
      }
      // console.log(cart)
      // return res.status(StatusCodes.NOT_FOUND).json({ error: "Product not found" });
      await cart.save();
      let newCart = await Cart.findOne({ userId: userId })
        .populate("products.productItem")
        .populate("products.variantItem");
      cart = await updateTotal(newCart);
      return res.status(StatusCodes.OK).json(cart);
    }

    await cart.save();
    cart = await updateTotal(cart);
    // console.log(cart)
    return res.status(StatusCodes.OK).json(cart);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const increase = async (req, res) => {
  const { userId, productId, variantId } = req.body;
  try {
    let cart = await Cart.findOne({ userId: userId })
      .populate("products.productItem")
      .populate("products.variantItem")
      .populate("voucher");

    if (!cart) {
      cart = await Cart.create({
        userId: userId,
        products: [],
        voucher: {},
        total: 0,
      });
    }

    //tìm sp mình nhấn tăng trong giỏ hàng
    const existProductIndex = cart.products.findIndex(
      (item) =>
        item.productItem._id.toString() == productId &&
        item.variantItem._id.toString() == variantId
    );

    if (existProductIndex !== -1) {
      // console.log(cart.products[existProductIndex].variantItem.countOnStock)
      //kiểm tra tồn kho
      if (
        cart.products[existProductIndex].variantItem.countOnStock >
        cart.products[existProductIndex].quantity
      ) {
        cart.products[existProductIndex].quantity++;
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

    await cart.save();
    cart = await updateTotal(cart);
    // console.log(cart)
    return res.status(StatusCodes.OK).json(cart);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const decrease = async (req, res) => {
  const { userId, productId, variantId } = req.body;
  try {
    let cart = await Cart.findOne({ userId: userId })
      .populate("products.productItem")
      .populate("products.variantItem")
      .populate("voucher");

    if (!cart) {
      cart = await Cart.create({
        userId: userId,
        products: [],
        voucher: {},
        total: 0,
      });
    }

    //tìm sp mình nhấn giảm trong giỏ hàng
    const existProductIndex = cart.products.findIndex(
      (item) =>
        item.productItem._id.toString() == productId &&
        item.variantItem._id.toString() == variantId
    );

    if (existProductIndex !== -1) {
      //nếu số lượng = 1 thì lọc ra khỏi giỏ hàng
      if (cart.products[existProductIndex].quantity === 1) {
        cart.products = cart.products.filter(
          (item) =>
            (item.productItem &&
              item.productItem._id.toString() !== productId) ||
            (item.variantItem && item.variantItem._id.toString() !== variantId)
        );
        await cart.save();
        cart = await updateTotal(cart);
        // console.log(cart)
        return res.status(StatusCodes.OK).json(cart);
      } else {
        cart.products[existProductIndex].quantity--;
      }
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Không tìm thấy sản phẩm" });
    }

    // cart.products.push({ productItem: products, variantItem: variant, quantity: quantity })

    await cart.save();
    cart = await updateTotal(cart);
    // console.log(cart)
    return res.status(StatusCodes.OK).json(cart);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const removeCartProduct = async (req, res) => {
  const { userId, productId, variantId } = req.body;
  try {
    let cart = await Cart.findOne({ userId: userId })
      .populate("products.productItem")
      .populate("products.variantItem")
      .populate("voucher");

    if (!cart) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy giỏ hàng" });
    }

    //tìm sp và lọc ra khỏi giỏ hàng
    cart.products = cart.products.filter(
      (item) =>
        (item.productItem && item.productItem._id.toString() !== productId) ||
        (item.variantItem && item.variantItem._id.toString() !== variantId)
    );

    await cart.save();
    cart = await updateTotal(cart);
    // console.log(cart.products)
    return res.status(StatusCodes.OK).json(cart);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  const { userId, productId, variantId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId: userId })
      .populate("products.productItem")
      .populate("products.variantItem")
      .populate("voucher");
    if (!cart) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy giỏ hàng" });
    }

    //tìm sp mình nhấn tăng trong giỏ hàng
    const existProductIndex = cart.products.findIndex(
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
        cart.products[existProductIndex].variantItem.countOnStock >= quantity
      ) {
        cart.products[existProductIndex].quantity = quantity;
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

    await cart.save();
    cart = await updateTotal(cart);
    // console.log(cart)
    return res.status(StatusCodes.OK).json(cart);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const addVoucher = async (req, res) => {
  const { userId, voucherCode } = req.body;
  // console.log(req.body)
  try {
    let cart = await Cart.findOne({ userId: userId })
      .populate("products.productItem")
      .populate("products.variantItem")
      .populate("voucher");
    if (!cart) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy giỏ hàng" });
    }

    const voucher = await Voucher.findOne({ code: voucherCode });
    if (!voucher) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy Voucher" });
    }

    //check hạn sử dụng
    const date = new Date();
    if (
      new Date(date.getTime() + 7 * 60 * 60 * 1000) >= new Date(voucher.endDate)
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Voucher đã hết hạn" });
    }
    if (
      new Date(date.getTime() + 7 * 60 * 60 * 1000) <=
      new Date(voucher.startDate)
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Chưa đến ngày dùng voucher" });
    }

    //check trạng thái
    if (voucher.status === "inactive") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Voucher đã bị vô hiệu hóa" });
    }

    //check số lượng
    if (voucher.countOnStock === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Số lượng Voucher đã hết" });
    }

    //kiểm tra trùng lặp
    if (cart.voucher.length > 0) {
      for (let item of cart.voucher) {
        if (item._id.toString() === voucher._id.toString()) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "Voucher đã được sử dụng" });
        }
        if (item.category === voucher.category) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "Không thể sử dụng 2 Voucher cùng loại" });
        }
      }
    }

    // console.log(voucher)

    // giảm số lượng của voucher
    // await Voucher.findOneAndUpdate({ _id: voucher._id }, { countOnStock: voucher.countOnStock - 1 }, { new: true })

    // thêm vào danh sách đã sử dụng voucher
    // await VoucherUsage.create({ userId: userId, voucherId: voucher._id });

    cart.voucher.push(voucher._id);
    // console.log(cart)
    await cart.save();
    cart = await Cart.findOne({ userId: userId })
      .populate("products.productItem")
      .populate("products.variantItem")
      .populate("voucher");
    cart = await updateTotal(cart);
    await cart.save();
    // console.log(cart)
    return res.status(StatusCodes.OK).json(cart);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const revomeVoucherCart = async (req, res) => {
  const { userId, voucherCode } = req.body;
  // console.log(req.body)
  try {
    let cart = await Cart.findOne({ userId: userId })
      .populate("products.productItem")
      .populate("products.variantItem")
      .populate("voucher");
    if (!cart) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy giỏ hàng" });
    }

    const voucher = await Voucher.findOne({ code: voucherCode });
    if (!voucher) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy Voucher" });
    }

    // tăng số lượng của voucher
    // await Voucher.findOneAndUpdate(
    //   { _id: voucher._id },
    //   { countOnStock: voucher.countOnStock + 1 },
    //   { new: true }
    // );

    // loại khỏi danh sách đã sử dụng voucher
    // await VoucherUsage.findOneAndDelete({
    //   userId: userId,
    //   voucherId: voucher._id,
    // });

    // loại khỏi giỏ hàng
    cart.voucher = cart.voucher.filter(
      (item) => item._id.toString() !== voucher._id.toString()
    );
    // console.log(cart)
    cart = await updateTotal(cart);
    await cart.save();
    // console.log(cart)
    return res.status(StatusCodes.OK).json(cart);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const changeVariant = async (req, res) => {
  const { userId, productId, variantId, newVariantId } = req.body;
  try {
    let cart = await Cart.findOne({ userId: userId });

    //kiểm tra biến thể mới có tồn tại hay không
    const variant = await Variant.findOne({ _id: newVariantId });
    if (!variant) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Biến thể không tồn tại?!" });
    }

    const product = await Product.findOne({ _id: productId });
    const variantValue = await Variant.findOne({ _id: variantId });

    if (!product || !variantValue) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy Product hoặc Biến thể của Product" });
    }

    //Check newVariantId có trong SP đó hay ko
    const exitVariantProduct = product.variants.findIndex(
      (item) => item.toString() === newVariantId
    );
    if (exitVariantProduct === -1) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Biến thể mới không tồn tại" });
    }

    //kiểm tra xem biến thể mới có bị trùng lặp không
    const exitItem = cart.products.findIndex(
      (item) =>
        item.productItem.toString() == productId &&
        item.variantItem.toString() == newVariantId
    );
    if (exitItem !== -1) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Sản phẩm trùng lặp!" });
    }

    //Tìm vị trí sản phẩm thay đổi biến thể
    const itemIndex = cart.products.findIndex(
      (item) =>
        item.productItem.toString() == productId &&
        item.variantItem.toString() == variantId
    );
    if (itemIndex === -1) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không thể tìm được sản phẩm cần đổi?!" });
    }

    cart.products[itemIndex].variantItem = newVariantId;
    // cart.products[itemIndex].quantity = 1;
    await cart.save();
    return res.status(StatusCodes.OK).json(cart);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const selectedOneItem = async (req, res) => {
  try {
    const { userId, productId, variantId } = req.body;
    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy giỏ hàng" });
    }

    const existProductIndex = cart.products.findIndex(
      (item) =>
        item.productItem.toString() == productId &&
        item.variantItem.toString() == variantId
    );

    if (existProductIndex !== -1) {
      cart.products[existProductIndex].selected =
        !cart.products[existProductIndex].selected;
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy sản phẩm" });
    }

    await cart.save();
    return res.status(StatusCodes.OK).json(cart);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const selectedAllItem = async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy giỏ hàng" });
    }

    //kiểm tra tất cả sản phẩm đã được chọn chưa
    const selected = cart.products.every((item) => item.selected === true);

    //nếu tất cả sản phẩm đã được chọn thì bỏ chọn tất cả
    if (selected && selected === true) {
      cart.products.forEach((item) => {
        // if (item.productItem.deleted === false && item.variantItem.deleted === false) {
        item.selected = false;
        // }
      });
    } else {
      cart.products.forEach((item) => {
        // if (item.productItem.deleted === false && item.variantItem.deleted === false) {
        item.selected = true;
        // }
      });
    }

    await cart.save();
    return res.status(StatusCodes.OK).json(cart);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const removeAllItemSelected = async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy giỏ hàng" });
    }

    const newProducts = cart.products.filter((item) => item.selected === false);

    cart.products = newProducts;
    await cart.save();
    return res.status(StatusCodes.OK).json(cart);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

// test
export const updateCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
    });
    return res.status(StatusCodes.OK).json(cart);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
