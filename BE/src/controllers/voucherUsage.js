import { StatusCodes } from 'http-status-codes';
import VoucherUsage from '../models/voucherUsage';

export const getAllVoucherUsage = async (req, res) => {
    try {
        const voucherUsage = await VoucherUsage.find();
        return res.status(StatusCodes.OK).json(voucherUsage);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}