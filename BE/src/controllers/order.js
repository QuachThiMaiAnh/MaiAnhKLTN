import { StatusCodes } from "http-status-codes";
import Address from "../models/Address";
import Order from "../models/order";
import Variant from "../models/variant";
import Voucher from "../models/voucher";
import VoucherUsage from "../models/voucherUsage";
import cart from "../models/cart";
import Product from "../models/product";
import mongoose from "mongoose";
import { getIO } from "./socket";

//=========================tạo đơn hàng mới===============
export const createOrder = async (req, res) => {
  const { userId, addressId, products, payment, totalPrice, discount, voucher, note, fullName, email } = req.body;
  console.log("voucher", voucher);
  try {
    let finalAddress = {};
    // Kiểm tra xem addressId có được cung cấp không
    if (!addressId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Địa chỉ là bắt buộc" });
    }
    if (!payment) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Phương thức thanh toán là bắt buộc" });
    }
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không có sản phẩm trong giỏ hàng" });
    }

    if (totalPrice < 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Giá trị đơn hàng không hợp lệ" });
    }
    if (!userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "userId là bắt buộc" });
    }

    // Truy vấn thông tin địa chỉ từ addressId
    const address = await Address.findById(addressId);
    if (!address) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Địa chỉ không tồn tại" });
    }
    // Lấy thông tin chi tiết địa chỉ
    finalAddress = address.toObject();
    // Kiểm tra số lượng kho cho mỗi sản phẩm
    for (let item of products) {
      const { variantItem, quantity, productItem } = item;

      // Kiểm tra sản phẩm có bị xóa hay không
      const Products = await Product.findOne({ _id: productItem._id });
      if (Products && Products.deleted) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: `Sản phẩm đã ngừng bán.`,
        });
      }

      // Kiểm tra biến thể có bị xóa hay không
      const variant = await Variant.findOne({ _id: variantItem._id });
      if (variant && variant.deleted) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ` sản phẩm đã ngừng bán.`,
        });
      }
      // Kiểm tra và xử lý variantItem
      const productVariant = await Variant.findById(variantItem._id);
      if (!productVariant || productVariant.countOnStock < quantity) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: `Số lượng không đủ trong kho.`,
        });
      }
      // Trừ số lượng trong kho
      productVariant.countOnStock -= quantity;
      await productVariant.save();
      const products = await Product.findById(productItem._id);
      if (products) {
        products.countOnStock -= quantity;
        await products.save();
      }
    }

    if (voucher.length > 0) {
      // giảm số lượng của voucher
      await Voucher.findOneAndUpdate({ _id: voucher[0]._id }, { countOnStock: voucher[0].countOnStock - 1 }, { new: true })
      // console.log('giam so luonh')
      // thêm vào danh sách đã sử dụng voucher
      await VoucherUsage.create({ userId: userId, voucherId: voucher[0]._id });
      // console.log('them vao danh sach da su dung voucher')
    }
    // Tạo đơn hàng
    const newOrder = new Order({
      userId,
      addressId: finalAddress,
      products,
      payment,
      note,
      discount,
      totalPrice,
      fullName,
      email
    });
    // Lưu đơn hàng
    const savedOrder = await newOrder.save();
    // Xóa tất cả các sản phẩm được chọn từ giỏ hàng của người dùng cụ thể
    await cart.updateOne(
      { userId },
      {
        $pull: { products: { selected: true } }, // Xóa các mục được chọn trong products
        $set: { voucher: [] }                   // Làm rỗng mảng voucher
      }
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Đơn hàng đã được tạo thành công", order: savedOrder });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi khi tạo đơn hàng", error: error.message });
  }
};


// tạo orderVnpay
export const createOrderVnpay = async (req, res) => {
  const { userId, addressId, products, payment, totalPrice, discount, voucher, note, fullName, email } = req.body;
  try {
    let finalAddress = {};
    // Kiểm tra xem addressId có được cung cấp không
    if (!addressId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Địa chỉ bắt buộc" });
    }
    if (!payment) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Phương thức thanh toán là bắt buộc" });
    }
    // Log tất cả sản phẩm và lọc các sản phẩm bị ngừng bán
    // if (deletedProduct) {
    //   return res.status(StatusCodes.NOT_FOUND).json({
    //     message: `Sản phẩm hoặc biến thể đã bị xóa`,
    //   });
    // }


    if (!products || !Array.isArray(products) || products.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không có sản phẩm trong giỏ hàng" });
    }

    if (totalPrice < 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Giá trị đơn hàng không hợp lệ" });
    }
    if (!userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "userId là bắt buộc" });
    }

    // Truy vấn thông tin địa chỉ từ addressId
    const address = await Address.findById(addressId);
    if (!address) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Địa chỉ không tồn tại" });
    }
    // Lấy thông tin chi tiết địa chỉ
    finalAddress = address.toObject();
    // Kiểm tra số lượng kho cho mỗi sản phẩm
    for (let item of products) {
      const { variantItem, quantity, productItem } = item;

      // Kiểm tra sản phẩm có bị xóa hay không
      const Products = await Product.findOne({ _id: productItem._id });
      if (Products && Products.deleted) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: `Sản phẩm đã ngừng bán.`,
        });
      }

      // Kiểm tra biến thể có bị xóa hay không
      const variant = await Variant.findOne({ _id: variantItem._id });
      if (variant && variant.deleted) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ` sản phẩm đã ngừng bán.`,
        });
      }
      // Kiểm tra và xử lý variantItem
      const productVariant = await Variant.findById(variantItem._id);
      if (!productVariant || productVariant.countOnStock < quantity) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: `Số lượng không đủ trong kho.`,
        });
      }
      // Trừ số lượng trong kho
      // productVariant.countOnStock -= quantity;
      // await productVariant.save();
      // const products = await Product.findById(productItem._id);
      // if (products) {
      //   products.countOnStock -= quantity;
      //   await products.save();
      // }
    }

    if (voucher.length > 0) {
      // giảm số lượng của voucher
      await Voucher.findOneAndUpdate({ _id: voucher[0]._id }, { countOnStock: voucher[0].countOnStock - 1 }, { new: true })
      // console.log('giam so luonh')
      // thêm vào danh sách đã sử dụng voucher
      await VoucherUsage.create({ userId: userId, voucherId: voucher[0]._id });
      // console.log('them vao danh sach da su dung voucher')
    }

    // Tạo đơn hàng
    const newOrder = new Order({
      userId,
      addressId: finalAddress,
      products,
      payment,
      note,
      discount,
      totalPrice,
      fullName,
      email
    });
    // Lưu đơn hàng
    const savedOrder = await newOrder.save();
    // Xóa tất cả các sản phẩm được chọn từ giỏ hàng của người dùng cụ thể
    // await cart.updateOne(
    //   { userId },
    //   { $pull: { products: { selected: true } } }
    // );

    await cart.updateOne(
      { userId },
      {
        $set: { voucher: [] }   // Làm rỗng mảng voucher
      }
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Đơn hàng đã được tạo thành công", order: savedOrder });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi khi tạo đơn hàng", error: error.message });
  }
};
// xóa giỏ hàng 

export const deleteCart = async (req, res) => {
  const { userId, products } = req.body;

  try {

    for (let item of products) {
      const { variantItem, quantity, productItem } = item;

      // Kiểm tra sản phẩm có bị xóa hay không
      const Products = await Product.findOne({ _id: productItem._id });
      if (Products && Products.deleted) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: `Sản phẩm đã ngừng bán.`,
        });
      }

      // Kiểm tra biến thể có bị xóa hay không
      const variant = await Variant.findOne({ _id: variantItem._id });
      if (variant && variant.deleted) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ` sản phẩm đã ngừng bán.`,
        });
      }
      // Kiểm tra và xử lý variantItem
      const productVariant = await Variant.findById(variantItem._id);
      if (!productVariant || productVariant.countOnStock < quantity) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: `Số lượng không đủ trong kho.`,
        });
      }
      // Trừ số lượng trong kho
      productVariant.countOnStock -= quantity;
      await productVariant.save();
      const products = await Product.findById(productItem._id);
      if (products) {
        products.countOnStock -= quantity;
        await products.save();
      }
    }
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không có sản phẩm trong giỏ hàng" });
    }

    // Cập nhật giỏ hàng của người dùng bằng cách xóa các sản phẩm đã chọn
    const result = await cart.updateOne(
      { userId },
      { $pull: { products: { selected: true } } }
    );

    // Kiểm tra nếu giỏ hàng đã được cập nhật
    if (result.modifiedCount > 0) {
      return res.status(200).json({ message: "Giỏ hàng đã được xóa thành công." });
    } else {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng của người dùng hoặc không có sản phẩm nào để xóa." });
    }
  } catch (error) {
    console.error("Lỗi khi xóa giỏ hàng:", error);
    return res.status(500).json({ message: "Đã có lỗi xảy ra khi xóa giỏ hàng." });
  }
};

// ============================ Lấy tất cả đơn hàng ===========================
export const getAllOrdersByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    // Tìm tất cả đơn hàng và populate thông tin userId và addressId
    const orders = await Order.find({ userId });
    // Kiểm tra nếu không có đơn hàng
    if (orders.length === 0) {
      return res.status(404).json({ message: "Không có đơn hàng nào" });
    }
    // Trả về danh sách đơn hàng
    return res.status(StatusCodes.OK).json(orders);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lỗi khi lấy danh sách đơn hàng",
      error: error.message,
    });
  }
};
export const getAllOrders = async (req, res) => {
  try {
    // Tìm tất cả đơn hàng và populate thông tin userId và addressId
    const orders = await Order.find()
      .populate("userId")
      .sort({ createdAt: -1 });
    // Kiểm tra nếu không có đơn hàng
    if (orders.length === 0) {
      return res.status(404).json({ message: "Không có đơn hàng nào" });
    }
    // Trả về danh sách đơn hàng
    return res.status(StatusCodes.OK).json(orders);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lỗi khi lấy danh sách đơn hàng",
      error: error.message,
    });
  }
};

// ============================ Lấy đơn hàng theo Id ===========================

export const getOrdersById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    // Kiểm tra nếu không có đơn hàng
    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy đơn hàng" });
    }
    // Trả về đơn hàng
    return res.status(StatusCodes.OK).json(order);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi khi lấy đơn hàng", error: error.message });
  }
};

// - Tra cứu đơn hàng theo mã đơn hàng

export const getOrderCode = async (req, res) => {
  try {
    const { orderCode } = req.params;
    const order = await Order.findOne({ orderCode });
    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy đơn hàng" });
    }
    return res.json(order);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi server", error: error.message });
  }
};
// ============================ Cập nhật trạng thái đơn hàng ===========================
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { newStatus, user, reason } = req.body;

  try {
    // Kiểm tra trạng thái mới
    const validStatuses = [
      "chờ xác nhận",
      "đã xác nhận",
      "đang giao hàng",
      "đã hoàn thành",
      "hủy đơn",
    ];
    if (!newStatus || !validStatuses.includes(newStatus)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: `Trạng thái không hợp lệ. Các trạng thái hợp lệ: ${validStatuses.join(
          ", "
        )}.`,
      });
    }

    // Tìm đơn hàng theo id
    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy đơn hàng" });
    }
    // Kiểm tra trạng thái hiện tại của đơn hàng
    const currentStatus = order.status;

    // Logic xử lý trạng thái
    switch (currentStatus) {
      case "chờ xác nhận":
        if (newStatus === "chờ xác nhận") {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Trạng thái chờ xác nhận không thể quay lại.",
          });
        }
        if (newStatus !== "đã xác nhận" && newStatus !== "hủy đơn") {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Trạng thái hợp lệ tiếp theo là 'đã xác nhận'.",
          });
        }
        break;

      case "đã xác nhận":
        if (newStatus === "chờ xác nhận") {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message:
              "Không thể quay lại trạng thái chờ xác nhận từ đã xác nhận.",
          });
        }
        if (newStatus !== "đang giao hàng" && newStatus !== "hủy đơn") {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Trạng thái hợp lệ tiếp theo là 'đang giao hàng'.",
          });
        }
        break;

      case "đang giao hàng":
        if (newStatus === "chờ xác nhận" || newStatus === "đã xác nhận") {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Không thể quay lại trạng thái trước từ đang giao hàng.",
          });
        }
        if (newStatus === "hủy đơn") {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Không thể hủy đơn khi đang giao hàng.",
          });
        }
        if (newStatus !== "đã hoàn thành") {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Trạng thái hợp lệ tiếp theo là 'đã hoàn thành'.",
          });
        }
        break;

      case "đã hoàn thành":
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Không thể thay đổi trạng thái khi đơn hàng đã hoàn thành.",
        });

      case "hủy đơn":
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Không thể thay đổi trạng thái khi đơn hàng đã hủy.",
        });

      default:
        break;
    }



    // Xử lý thêm thông tin khi chuyển trạng thái sang 'đã hủy'
    if (newStatus === "hủy đơn") {
      if (!reason) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Vui lòng cung cấp lý do hủy đơn hàng.",
        });
      }
      order.cancellationReason = reason; // Lưu lý do hủy
      order.cancelledBy = user || "Hệ thống"; // Ghi nhận ai hủy (user hoặc mặc định là hệ thống)
    }

    // Lưu thông tin thời gian chuyển trạng thái
    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({
      status: newStatus,
      timestamp: new Date(),
      updatedBy: user || "Hệ thống",
    });

    // Cập nhật trạng thái thanh toán
    if (newStatus === "đã hoàn thành") {
      order.isPaid = true; // Đánh dấu là đã thanh toán khi đơn hàng hoàn thành
    } else if (newStatus === "hủy đơn") {
      order.isPaid = false; // Đánh dấu là chưa thanh toán khi đơn hàng bị hủy
    }
    // Hoàn lại số lượng sản phẩm nếu trạng thái chuyển thành "đã hủy"
    if (
      newStatus === "hủy đơn" &&
      ["chờ xác nhận", "đã xác nhận"].includes(currentStatus)
    ) {
      // for (let outerItem of order.products) {
      // if (!Array.isArray(outerItem.products)) {
      //   console.error("outerItem.products không phải là mảng:", outerItem);
      //   continue;
      // }

      for (let item of order.products) {
        const { variantItem, quantity, productItem } = item;
        if (!variantItem || !variantItem._id) {
          console.error("variantItem hoặc _id không tồn tại:", item);
          continue;
        }
        const products = await Product.findById(productItem._id);
        if (products) {
          products.countOnStock += quantity
          await products.save();
        }
        const productVariant = await Variant.findById(variantItem._id);
        if (productVariant) {
          productVariant.countOnStock += quantity; // Hoàn lại số lượng
          await productVariant.save();
        }
      }
      // }
    }

    // Cập nhật trạng thái nếu không gặp lỗi
    order.status = newStatus;

    // if (newStatus === "đã hoàn thành") {
    //   order.products.forEach((product) => {
    //     product.products.forEach((item) => (item.statusComment = true));
    //   });
    //   order.markModified("products");
    // }
    if (newStatus === "đã hoàn thành") {
      for (const product of order.products) {
        const productId = new mongoose.Types.ObjectId(product.productItem._id); // Đảm bảo khởi tạo đúng kiểu ObjectId
        // console.log("Product ID: ", productId);
        product.statusComment = true;
        const productData = await Product.findById(productId); // Dùng mô hình Product để tìm sản phẩm
        // console.log("PDATA: ", productData);
        if (productData) {
          productData.count += Number(product.quantity);
          await productData.save();
        }
      }
      order.markModified("products");
    }

    await order.save();

    // Trả về kết quả
    return res.status(StatusCodes.OK).json({
      message: "Cập nhật trạng thái đơn hàng thành công.",
      order: order,
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lỗi khi cập nhật trạng thái đơn hàng",
      error: error.message,
    });
  }
};


//  trạng thái vnpay
export const UpdateStatusVnpay = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPaid } = req.body; // Chỉ nhận orderId và isPaid

    // Kiểm tra nếu thiếu thông tin từ yêu cầu
    if (!id || typeof isPaid !== 'boolean') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Thông tin yêu cầu không đầy đủ hoặc không hợp lệ.",
      });
    }

    // Lấy đơn hàng từ cơ sở dữ liệu
    const order = await Order.findById(id);
    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Không tìm thấy đơn hàng.",
      });
    }

    // Cập nhật trạng thái thanh toán
    order.isPaid = isPaid;
    // Lưu đơn hàng sau khi cập nhật
    await order.save();

    // Trả về kết quả thành công
    return res.status(StatusCodes.OK).json({
      message: "Cập nhật trạng thái thanh toán thành công.",
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lỗi khi cập nhật trạng thái thanh toán.",
      error: error.message,
    });
  }
};
// ============================ Xóa đơn hàng ===========================
// export const deleteOrder = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Tìm đơn hàng theo ID
//     const order = await Order.findById(id);

//     // Kiểm tra nếu không tìm thấy đơn hàng
//     if (!order) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ message: "Không tìm thấy đơn hàng" });
//     }

//     // Kiểm tra trạng thái đơn hàng, chỉ xóa nếu đơn hàng chưa hoàn thành hoặc đã hủy
//     const validStatuses = ["chờ xác nhận", "đã xác nhận", "đang giao hàng"];
//     if (!validStatuses.includes(order.status)) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         message: "Không thể xóa đơn hàng với trạng thái này",
//       });
//     }

//     // Xóa đơn hàng
//     await Order.findByIdAndDelete(id);

//     return res.status(StatusCodes.OK).json({
//       message: "Đơn hàng đã được xóa thành công",
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       message: "Lỗi khi xóa đơn hàng",
//       error: error.message,
//     });
//   }
// };


export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    // Tìm đơn hàng theo ID
    const order = await Order.findById(id);

    // Kiểm tra nếu không tìm thấy đơn hàng
    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy đơn hàng" });
    }

    // Kiểm tra trạng thái đơn hàng, chỉ xóa nếu đơn hàng chưa hoàn thành hoặc đã hủy
    const validStatuses = ["chờ xác nhận", "đã xác nhận", "đang giao hàng"];
    if (!validStatuses.includes(order.status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Không thể xóa đơn hàng với trạng thái này",
      });
    }

    // Cập nhật lại số lượng sản phẩm trong kho
    const updatePromises = order.products.map(async (item) => {
      const { variantItem, quantity, productItem } = item;

      if (!variantItem || !variantItem._id) {
        console.error("variantItem hoặc _id không tồn tại:", item);
        return; // Bỏ qua nếu variantItem hoặc _id không tồn tại
      }

      const product = await Product.findById(productItem._id);
      if (product) {
        product.countOnStock += quantity;
        await product.save();
      } else {
        console.error("Sản phẩm không tồn tại:", productItem._id);
      }

      const productVariant = await Variant.findById(variantItem._id);
      if (productVariant) {
        productVariant.countOnStock += quantity; // Hoàn lại số lượng
        await productVariant.save();
      } else {
        console.error("Biến thể sản phẩm không tồn tại:", variantItem._id);
      }
    });

    // Chờ tất cả các cập nhật hoàn thành
    await Promise.all(updatePromises);

    // Xóa đơn hàng
    await Order.findByIdAndDelete(id);

    const io = getIO();

    io.emit('order', "Luong")

    return res.status(StatusCodes.OK).json({
      message: "Đơn hàng đã được xóa thành công",
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lỗi khi xóa đơn hàng",
      error: error.message,
    });
  }
};

export const deleteOrderAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    // Tìm đơn hàng theo ID
    const order = await Order.findById(id);

    // Kiểm tra nếu không tìm thấy đơn hàng
    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy đơn hàng" });
    }

    // Kiểm tra trạng thái đơn hàng, chỉ xóa nếu đơn hàng chưa hoàn thành hoặc đã hủy
    const validStatuses = ["chờ xác nhận", "đã xác nhận", "đang giao hàng"];
    if (!validStatuses.includes(order.status)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Không thể xóa đơn hàng với trạng thái này",
      });
    }

    // Cập nhật lại số lượng sản phẩm trong kho
    // const updatePromises = order.products.map(async (item) => {
    //   const { variantItem, quantity, productItem } = item;

    //   if (!variantItem || !variantItem._id) {
    //     console.error("variantItem hoặc _id không tồn tại:", item);
    //     return; // Bỏ qua nếu variantItem hoặc _id không tồn tại
    //   }

    //   const product = await Product.findById(productItem._id);
    //   if (product) {
    //     product.countOnStock += quantity;
    //     await product.save();
    //   } else {
    //     console.error("Sản phẩm không tồn tại:", productItem._id);
    //   }

    //   const productVariant = await Variant.findById(variantItem._id);
    //   if (productVariant) {
    //     productVariant.countOnStock += quantity; // Hoàn lại số lượng
    //     await productVariant.save();
    //   } else {
    //     console.error("Biến thể sản phẩm không tồn tại:", variantItem._id);
    //   }
    // });

    // Chờ tất cả các cập nhật hoàn thành
    // await Promise.all(updatePromises);

    // Xóa đơn hàng
    await Order.findByIdAndDelete(id);

    const io = getIO();

    io.emit('order', "Luong")

    return res.status(StatusCodes.OK).json({
      message: "Đơn hàng đã được xóa thành công",
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Lỗi khi xóa đơn hàng",
      error: error.message,
    });
  }
};

