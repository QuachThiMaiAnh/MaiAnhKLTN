import { StatusCodes } from "http-status-codes";
import Voucher from "../models/voucher"
import VoucherUsage from "../models/voucherUsage";

export const getAllVoucherUsageByUserId = async (req, res) => {
    try {
        const id = req.params.id;
        const voucherUsage = await VoucherUsage.find().sort({ createdAt: -1 });
        const result = voucherUsage.filter((data) => data.userId.toString() === id);
        return res.status(StatusCodes.OK).json(result);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
}

export const getAllVoucher = async (req, res) => {
    try {
        let voucher = await Voucher.find().sort({ createdAt: -1 });
        if (voucher.length < 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Không tìm thấy Voucher" })
        }

        // const newVoucher = voucher.map((data) => {
        //     // console.log(data)
        //     const currentTime = (new Date().getTime() + 7 * 60 * 60 * 1000);
        //     const endTime = new Date(data.endDate);
        //     const timeRemaining = endTime - currentTime;

        //     // if (timeRemaining <= 0) return null

        //     return {
        //         voucher: data,
        //         countdown: timeRemaining
        //     }
        // }).filter((data) => data !== null)

        // await voucher.save();
        // console.log(voucher)

        return res.status(StatusCodes.OK).json(voucher);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
    }
}

export const getOneVoucher = async (req, res) => {
    try {
        const voucher = await Voucher.findOne({ _id: req.params.id }).sort({ createdAt: -1 });
        if (!voucher) {
            // return res.status(StatusCodes.NOT_FOUND).json({ message: "Không tìm thấy Voucher" })
            return
        }

        return res.status(StatusCodes.OK).json(voucher);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
    }
}

export const createVoucher = async (req, res) => {
    const { startDate, endDate, status, type, discount } = req.body;

    try {
        const exitVoucher = await Voucher.findOne({ code: req.body.code });
        // console.log(exitVoucher)

        const date = new Date();
        if (exitVoucher !== null) {
            if (new Date(exitVoucher.endDate) < new Date(date.getTime() + 7 * 60 * 60 * 1000)) {
                return res.status(StatusCodes.CONFLICT).json({ message: "Mã code đã tồn tại và hết hạn" })
            } else {
                return res.status(StatusCodes.CONFLICT).json({ message: "Mã code đã tồn tại" })
            }
        }
        if (status === 'active') {
            if (new Date(date.getTime() + 7 * 60 * 60 * 1000) < new Date(new Date(startDate).getTime() + 7 * 60 * 60 * 1000)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: "Ngày bắt đầu không hợp lệ" })
            }
            if (new Date(date.getTime() + 7 * 60 * 60 * 1000) > new Date(new Date(endDate).getTime() + 7 * 60 * 60 * 1000)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: "Ngày kết thúc không hợp lệ" })
            }
        }
        if (type === 'percent') {
            if (discount < 0 || discount > 100) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: "Giảm giá theo phần trăm (%) không hợp lệ" })
            }
        }
        const voucher = await Voucher.create(req.body)
        return res.status(StatusCodes.CREATED).json(voucher)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
    }
}

export const updateVoucher = async (req, res) => {
    const id = req.body._id;
    const { startDate, endDate, status, type, discount } = req.body;
    const { _id, ...data } = req.body;
    try {
        const voucher = await Voucher.findOneAndUpdate({ _id: id }, data, { new: true });
        if (voucher.length < 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Không tìm thấy Voucher" })
        }

        const date = new Date();
        if (status === 'active') {
            if (new Date(date.getTime() + 7 * 60 * 60 * 1000) < new Date(new Date(startDate).getTime() + 7 * 60 * 60 * 1000)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: "Ngày bắt đầu không hợp lệ" })
            }
            if (new Date(date.getTime() + 7 * 60 * 60 * 1000) > new Date(new Date(endDate).getTime() + 7 * 60 * 60 * 1000)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: "Ngày kết thúc không hợp lệ" })
            }
        }
        if (type === 'percent') {
            if (discount < 0 || discount > 100) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: "Giảm giá theo phần trăm (%) không hợp lệ" })
            }
        }
        return res.status(StatusCodes.OK).json(voucher)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
    }
}

export const statusVoucher = async (req, res) => {
    try {
        const voucher = await Voucher.findOne({ _id: req.body.id });
        if (voucher.length < 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Không tìm thấy Voucher" })
        }
        voucher.status = req.body.status;
        await voucher.save();
        return res.status(StatusCodes.OK).json(voucher)
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
    }
}

export const removeVoucher = async (req, res) => {
    try {
        const { _id } = req.body;
        const voucher = await Voucher.findOneAndDelete({ _id });

        if (!voucher) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Không tìm thấy Voucher" });
        }

        return res.status(StatusCodes.OK).json(voucher);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
    }
}

export const getVoucherWithCountdown = async (req, res) => {
    const { voucherId } = req.params;

    try {
        const voucher = await Voucher.findOne({ _id: voucherId }).sort({ createdAt: -1 });
        if (!voucher) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Không tìm thấy Voucher" });
        }

        const currentTime = new Date();
        const endTime = new Date(voucher.endDate);
        const timeRemaining = endTime - currentTime;

        if (timeRemaining <= 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Voucher hết hạn" });
        }

        return res.status(StatusCodes.OK).json({
            voucher,
            countdown: timeRemaining // thời gian còn lại tính bằng milliseconds
        });
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
}

export const getAllVoucherWithCountDown = async (req, res) => {
    try {
        let voucher = await Voucher.find().sort({ createdAt: -1 });
        if (voucher.length < 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Không tìm thấy Voucher" })
        }

        const newVoucher = voucher.map((data) => {
            // console.log(data)
            const currentTime = (new Date().getTime() + 7 * 60 * 60 * 1000);
            const endTime = new Date(data.endDate);
            const timeRemaining = endTime - currentTime;

            // if (timeRemaining <= 0) return null

            return {
                voucher: data,
                countdown: timeRemaining
            }
        }).filter((data) => data !== null)

        return res.status(StatusCodes.OK).json(newVoucher);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
    }
}