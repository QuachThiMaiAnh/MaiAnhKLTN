import { StatusCodes } from "http-status-codes"
import Voucher from "../models/voucher";
import VoucherUsage from "../models/voucherUsage";

export const checkVoucherUsed = async (req, res, next) => {
    const { userId, voucherCode } = req.body;
    try {
        const voucher = await Voucher.findOne({ code: voucherCode });
        if (!voucher) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Không tìm thấy voucher" });
        }

        const exitUsage = await VoucherUsage.findOne({ userId: userId, voucherId: voucher._id });
        if (exitUsage) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Voucher đã qua sử dụng" });
        }

        next();

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}