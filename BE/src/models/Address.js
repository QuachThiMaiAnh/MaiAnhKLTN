import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    country: {
        type: String,
        default: "Vietnam",
    },
    cityId: {
        type: String,
        required: true,
    },
    districtId: {
        type: String,
        required: true,
    },
    wardId: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    addressDetail: {
        type: String,
        required: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true, versionKey: false });

// Định nghĩa model Address
const Address = mongoose.model("Address", addressSchema);

// Xuất model Address để sử dụng trong các file khác
export default Address;
