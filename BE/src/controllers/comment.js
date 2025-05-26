import Comment from "../models/comment";
import Order from "../models/order";
import Product from "../models/product";
import User from "../models/users";

export const createComment = async (req, res) => {
  try {
    const {
      userId,
      productId,
      infoProductBuy,
      content,
      rating,
      orderId,
      itemId,
    } = req.body;

    console.log(req.body);

    const product = await Product.findOne({ _id: productId, deleted: false });

    if (!product) {
      return res.status(400).json({ message: "Không tìm thấy sản phẩm" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "Không tìm thấy user" });
    }

    const order = await Order.findOne({ _id: orderId });
    console.log(order);

    if (!order) {
      return res.status(400).json({ message: "Không tìm thấy order" });
    }

    const comment = await Comment({
      userId,
      productId,
      infoProductBuy,
      content,
      rating,
    }).save();

    product.comments.push(comment._id);

    await product.save();
    order.products.forEach((item) => {
      if (item._id.toString() === itemId) {
        item.statusComment = false;
        item.isCommented = true;
      }
    });

    order.markModified("products");

    await order.save();

    res.status(201).json({
      message: "Đánh giá thành công",
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findOne({ _id: id });

    if (!comment) {
      return res.status(400).json({ message: "Không ẩn được đánh giá này" });
    }

    // if (comment.userId.toString() !== userId) {
    //   return res.status(400).json({ message: "Không có quyền xóa comment" });
    // }

    comment.deleted = true;

    await comment.save();

    res.json({ message: "Xóa đánh giá thành công", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const displayComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findOne({ _id: id });

    if (!comment) {
      return res.status(400).json({ message: "Không tìm thấy đánh giá" });
    }

    comment.deleted = false;

    await comment.save();

    res.json({ message: "Hiển thị đánh giá thành công", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllComment = async (req, res) => {
  const { _status = "display" } = req.query;

  let flag;
  if (_status === "hidden") {
    flag = true;
  } else {
    flag = false;
  }

  try {
    const comments = await Comment.find({ deleted: flag })
      .populate("userId", "firstName lastName imageUrl") // Populate userId,
      .populate("productId", "name image")
      .sort({
        createdAt: -1,
      }); // Populate productId, chỉ lấy các trường `name` và `price`

    if (!comments) {
      return res.status(400).json({ message: "Không tìm thấy đánh giá" });
    }

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
