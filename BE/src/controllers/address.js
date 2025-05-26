import { StatusCodes } from "http-status-codes";
import Address from "../models/Address";

//==================================== Tạo địa chỉ mới=========================
export const createAddress = async (req, res) => {
    const { userId, country, cityId, districtId, wardId, phone, addressDetail, email, name } = req.body;

    try {
        // Kiểm tra số lượng địa chỉ hiện tại của người dùng
        const existingAddresses = await Address.countDocuments({ userId });
        // Nếu không có địa chỉ nào, địa chỉ mới sẽ là mặc định
        const isDefault = existingAddresses === 0;
        // Tạo địa chỉ mới
        const newAddress = new Address({
            userId,
            country,
            cityId,
            districtId,
            wardId,
            phone,
            addressDetail,
            email,
            name,
            isDefault, // Đặt địa chỉ mới làm mặc định nếu đây là địa chỉ đầu tiên
        });

        // Lưu địa chỉ mới
        const saveAddress = await newAddress.save();
        console.log("id dia chi", saveAddress._id);
        return res.status(StatusCodes.CREATED).json({ message: "Địa chỉ đã được lưu", address: saveAddress });

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi khi lưu địa chỉ", error: error.message });
    }
};


//===================================== lấy địa chỉ theo user ============================

export const getAllAddressUserById = async (req, res) => {
    const { userId } = req.params;
    try {
        const address = await Address.find({ userId });
        if (!address) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Không tìm thấy địa chỉ" });
        }
        return res.status(StatusCodes.OK).json(address);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi lấy địa chỉ", error: error.message });
    }
}
// ============================Lấy địa chỉ theo userId và addressId=========================
export const getAddressById = async (req, res) => {
    const { addressId } = req.params;
    try {
        const address = await Address.findOne({ _id: addressId });

        if (!address) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Không tìm thấy địa chỉ" });
        }

        return res.status(StatusCodes.OK).json({ address });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi khi lấy thông tin địa chỉ", error: error.message });
    }
};



// ================================== update địa chỉ==========================================
export const updateAddressByUserId = async (req, res) => {
    const { addressId, userId, isDefault, country, cityId, districtId, addressDetail, wardId, phone, name } = req.body;
    try {
        if (isDefault) {
            // Nếu chọn địa chỉ này làm mặc định, đặt tất cả các địa chỉ của người dùng thành không mặc định
            await Address.updateMany({ userId }, { isDefault: false });
            // Cập nhật địa chỉ cụ thể và đặt thành mặc định
            const updatedAddress = await Address.findOneAndUpdate(
                { _id: addressId, userId },
                { isDefault: true, country, cityId, addressDetail, districtId, wardId, phone, name },
                { new: true, runValidators: true }
            );
            if (!updatedAddress) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: "Không tìm thấy địa chỉ" });
            }
            return res.status(StatusCodes.OK).json({ message: "Địa chỉ đã được cập nhật thành mặc định", address: updatedAddress });
        }
        // Nếu không chọn địa chỉ này làm mặc định, chỉ cập nhật địa chỉ cụ thể mà không thay đổi trạng thái isDefault
        const updatedAddress = await Address.findOneAndUpdate(
            { _id: addressId, userId },
            { country, cityId, districtId, wardId, addressDetail, phone, name },
            { new: true, runValidators: true }
        );

        if (!updatedAddress) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Không tìm thấy địa chỉ" });
        }
        return res.status(StatusCodes.OK).json({ message: "Địa chỉ đã được cập nhật", address: updatedAddress });

    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi cập nhật địa chỉ", error: error.message });
    }
};

// ====================================Xóa địa chỉ theo userId========================
export const deleteAddressByUserId = async (req, res) => {
    const { addressId } = req.params;
    try {
        // Tìm địa chỉ cần xóa
        const addressToDelete = await Address.findOne({ _id: addressId });

        if (!addressToDelete) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Không tìm thấy địa chỉ" });
        }

        // Kiểm tra xem địa chỉ có phải là mặc định không
        if (addressToDelete.isDefault) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Không thể xóa địa chỉ mặc định" });
        }
        // Xóa địa chỉ
        await Address.findByIdAndDelete(addressId);

        return res.status(StatusCodes.OK).json({ message: "Địa chỉ đã được xóa thành công" });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi khi xóa địa chỉ", error: error.message });
    }
};
