import { StatusCodes } from "http-status-codes";
import Voucher from "../models/voucher";
import VoucherUsage from "../models/voucherUsage";

// Lấy tất cả lịch sử sử dụng voucher của người dùng
export const getAllVoucherUsageByUserId = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await VoucherUsage.find({ userId: id }).sort({
      createdAt: -1,
    });
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

// Lấy tất cả voucher
export const getAllVoucher = async (req, res) => {
  try {
    const vouchers = await Voucher.find().sort({ createdAt: -1 });
    if (vouchers.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy Voucher" });
    }
    return res.status(StatusCodes.OK).json(vouchers);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

// Lấy 1 voucher theo ID
export const getOneVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findOne({ _id: req.params.id });
    if (!voucher) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy Voucher" });
    }
    return res.status(StatusCodes.OK).json(voucher);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

// Tạo voucher mới
export const createVoucher = async (req, res) => {
  const { code, startDate, endDate, status, type, discount } = req.body;

  try {
    const existing = await Voucher.findOne({ code });
    const now = new Date(); // UTC gốc

    if (existing) {
      const isExpired = new Date(existing.endDate).getTime() < now.getTime();
      return res.status(StatusCodes.CONFLICT).json({
        message: isExpired
          ? "Mã code đã tồn tại và hết hạn"
          : "Mã code đã tồn tại",
      });
    }

    if (status === "active") {
      if (now < new Date(startDate)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Ngày bắt đầu không hợp lệ" });
      }
      if (now > new Date(endDate)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Ngày kết thúc không hợp lệ" });
      }
    }

    if (type === "percent" && (discount < 0 || discount > 100)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Giảm giá theo phần trăm (%) không hợp lệ" });
    }

    const voucher = await Voucher.create(req.body);
    return res.status(StatusCodes.CREATED).json(voucher);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

// Cập nhật voucher
export const updateVoucher = async (req, res) => {
  const { _id, startDate, endDate, status, type, discount, ...data } = req.body;

  try {
    const voucher = await Voucher.findOneAndUpdate({ _id }, data, {
      new: true,
    });

    if (!voucher) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy Voucher" });
    }

    const now = new Date();

    if (status === "active") {
      if (now < new Date(startDate)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Ngày bắt đầu không hợp lệ" });
      }
      if (now > new Date(endDate)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Ngày kết thúc không hợp lệ" });
      }
    }

    if (type === "percent" && (discount < 0 || discount > 100)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Giảm giá theo phần trăm (%) không hợp lệ" });
    }

    return res.status(StatusCodes.OK).json(voucher);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

// Cập nhật trạng thái voucher
export const statusVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findOne({ _id: req.body.id });
    if (!voucher) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy Voucher" });
    }

    voucher.status = req.body.status;
    await voucher.save();

    return res.status(StatusCodes.OK).json(voucher);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

// Xóa voucher
export const removeVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findOneAndDelete({ _id: req.body._id });
    if (!voucher) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy Voucher" });
    }
    return res.status(StatusCodes.OK).json(voucher);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

// Lấy 1 voucher kèm thời gian đếm ngược
export const getVoucherWithCountdown = async (req, res) => {
  const { voucherId } = req.params;

  try {
    const voucher = await Voucher.findOne({ _id: voucherId });
    if (!voucher) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy Voucher" });
    }

    const now = new Date(); // UTC
    const endTime = new Date(voucher.endDate).getTime();
    const countdown = endTime - now.getTime();

    if (countdown <= 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Voucher hết hạn" });
    }

    return res.status(StatusCodes.OK).json({ voucher, countdown });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

// Lấy tất cả voucher kèm countdown
export const getAllVoucherWithCountDown = async (req, res) => {
  try {
    const vouchers = await Voucher.find().sort({ createdAt: -1 });
    if (vouchers.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy Voucher" });
    }

    const now = new Date();

    const result = vouchers.map((v) => {
      const end = new Date(v.endDate).getTime();
      return {
        voucher: v,
        countdown: end - now.getTime(),
      };
    });

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
