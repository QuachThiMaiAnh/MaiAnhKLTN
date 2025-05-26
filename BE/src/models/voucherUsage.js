import { required } from "joi";
import mongoose from "mongoose";

const dateVietNam = () => {
    const date = new Date();
    return new Date(date.getTime() + 7 * 60 * 60 * 1000)
}

const voucherUsage = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    voucherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voucher',
        required: true
    },
    usedDate: {
        type: Date,
        required: true,
        default: dateVietNam
    }

}, { timestamps: true, versionKey: false })

export default mongoose.model('VoucherUsage', voucherUsage)