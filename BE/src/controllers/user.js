import dotenv, { populate } from "dotenv";
import { StatusCodes } from "http-status-codes";
import Users from "../models/users";
import clerkClient from "../config/clerk";
import cloudinary from "../config/cloudinary";
import fs from "fs";
import bcrypt from "bcryptjs";
import Product from "../models/product";
import Conversation from "../models/conversation";

dotenv.config();

// ➤ Đồng bộ người dùng từ Clerk về MongoDB
export const saveUser = async (req, res) => {
  try {
    const { clerkId, phone, gender, birthdate } = req.body;

    // Bắt buộc phải có Clerk ID
    if (!clerkId) {
      return res
        .status(400)
        .send("ID người dùng không hợp lệ: clerkId là bắt buộc");
    }

    // Lấy thông tin người dùng từ Clerk
    const clerkUser = await clerkClient.users.getUser(clerkId);
    const isDeletedOnClerk = clerkUser.privateMetadata?.isDeleted ?? false;

    // Nếu tài khoản đã bị đánh dấu là "xóa" trong Clerk → từ chối tiếp tục
    if (isDeletedOnClerk) {
      return res.status(403).json({
        message:
          "Người dùng đã bị xóa. Vui lòng khôi phục tài khoản trước khi thực hiện thao tác này.",
      });
    }

    // Kiểm tra trạng thái bị khóa
    const isBanned = clerkUser.privateMetadata?.isBanned ?? false;

    // Kiểm tra nếu đã tồn tại trong MongoDB
    const existingUser = await Users.findOne({ clerkId });

    // Gán role: Admin nếu là người đầu tiên trong hệ thống
    const role =
      existingUser?.role ||
      clerkUser.publicMetadata?.role ||
      (await Users.countDocuments()) === 0
        ? "Admin"
        : "User";

    // Cập nhật metadata Clerk (cập nhật publicMetadata)
    await clerkClient.users.updateUser(clerkId, {
      publicMetadata: { role, phone, gender, birthdate },
    });

    // Cập nhật hoặc tạo người dùng trong MongoDB
    const user = await Users.findOneAndUpdate(
      { clerkId },
      {
        email: clerkUser.emailAddresses[0]?.emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
        role,
        phone,
        gender,
        birthdate,
        isBanned,
      },
      { upsert: true, new: true } // Nếu người dùng chưa tồn tại thì tạo mới
    );

    // Tạo hội thoại riêng cho user mới nếu là "User"
    if (user.role === "User") {
      const hasConversation = await Conversation.exists({ user: user._id });
      if (!hasConversation) {
        await Conversation.create({ user: user._id, admins: [] });
      }
    }

    return res.status(200).json({
      message: "Người dùng đã được lưu hoặc cập nhật thành công",
      user,
    });
  } catch (error) {
    console.error("❌ Lỗi khi lưu người dùng:", error);
    return res.status(500).send("Lỗi khi lưu người dùng: " + error.message);
  }
};

export const createUser = async (req, res) => {
  try {
    const { emailAddress, firstName, lastName, password, role, imageUrl } =
      req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!emailAddress || !firstName || !lastName || !password) {
      return res.status(400).json({
        message:
          "Thiếu thông tin bắt buộc (email, firstName, lastName, password)",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Tạo người dùng trên Clerk
      const clerkUser = await clerkClient.users.createUser({
        emailAddress: [emailAddress],
        firstName,
        lastName,
        password,
        publicMetadata: {
          role: role || "User", // Default role là "User"
        },
      });

      // Lưu thông tin người dùng vào MongoDB
      const newUser = new Users({
        clerkId: clerkUser.id,
        email: emailAddress,
        firstName,
        lastName,
        password: hashedPassword,
        role: role || "User",
        imageUrl: imageUrl || clerkUser.imageUrl,
      });

      await newUser.save();

      // Trả về phản hồi thành công
      return res.status(201).json({
        message: "Người dùng đã được tạo thành công!",
        user: newUser,
      });
    } catch (error) {
      // Xử lý lỗi từ Clerk API
      if (error.errors) {
        const clerkErrors = error.errors.map((err) => ({
          code: err.code,
          message: err.message,
        }));

        return res.status(422).json({
          message: "Lỗi khi tạo người dùng",
          errors: clerkErrors,
        });
      }

      throw error; // Nếu không phải lỗi từ Clerk, ném lỗi để xử lý tiếp
    }
  } catch (error) {
    console.error("Lỗi khi tạo người dùng:", error);

    // Trả lỗi không xác định
    return res.status(500).json({
      message: "Đã xảy ra lỗi khi tạo người dùng",
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { includeDeleted = "false" } = req.query;

    // Chuyển includeDeleted thành boolean
    const includeDeletedFlag = includeDeleted === "true";

    // Tạo bộ lọc dữ liệu
    const filter = includeDeletedFlag
      ? { isDeleted: true }
      : { isDeleted: false };

    // Truy vấn tất cả người dùng
    const users = await Users.find(filter);

    const validUsers = [];

    // Lọc người dùng thông qua Clerk
    for (const user of users) {
      try {
        const clerkUser = await clerkClient.users.getUser(user.clerkId);

        // Nếu người dùng tồn tại trên Clerk, thêm vào danh sách hợp lệ
        if (clerkUser) {
          validUsers.push(user);
        }
      } catch (error) {
        console.warn(
          `Người dùng với ID ${user.clerkId} không tồn tại trên Clerk. Đang xóa khỏi MongoDB...`
        );
        // Xóa khỏi MongoDB nếu Clerk không tìm thấy người dùng
        await Users.deleteOne({ clerkId: user.clerkId });
      }
    }

    // Trả về dữ liệu
    return res.status(200).json({ data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Lấy về thông tin người dùng từ cả MongoDB + Clerk
// Nhận vào clerkId từ params (id của người dùng trên Clerk)
export const getUserById = async (req, res) => {
  try {
    const { clerkId } = req.params;

    if (!clerkId) {
      return res
        .status(400)
        .send("ID người dùng không hợp lệ: clerkId là bắt buộc");
    }

    // Lấy người dùng từ cơ sở dữ liệu
    const user = await Users.findOne({ clerkId });

    if (!user) {
      return res
        .status(404)
        .send("Không tìm thấy người dùng trong cơ sở dữ liệu");
    }

    // Lấy thông tin chi tiết người dùng từ Clerk
    const clerkUser = await clerkClient.users.getUser(clerkId);

    if (!clerkUser) {
      return res.status(404).send("Không tìm thấy người dùng trong Clerk");
    }

    // Kết hợp dữ liệu từ cơ sở dữ liệu và Clerk
    const userDetails = {
      ...user.toObject(),
      clerkData: {
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        email: clerkUser.emailAddresses[0].emailAddress,
        imageUrl: clerkUser.imageUrl,
        role: clerkUser.publicMetadata.role,
        phone: clerkUser.publicMetadata.phone,
        gender: clerkUser.publicMetadata.gender,
        birthdate: clerkUser.publicMetadata.birthdate,
        isBanned: clerkUser.privateMetadata?.isBanned || false,
        isDeleted: clerkUser.privateMetadata?.isDeleted || false,
      },
    };

    return res.status(200).json(userDetails);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return res
      .status(500)
      .send("Lỗi khi lấy thông tin người dùng: " + error.message);
  }
};

export const softDeleteUser = async (req, res) => {
  const { clerkId } = req.params;

  try {
    // Cập nhật trạng thái trong MongoDB
    const user = await Users.findOneAndUpdate(
      { clerkId },
      { isDeleted: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Cập nhật trạng thái xóa mềm trong Clerk
    try {
      await clerkClient.users.updateUser(clerkId, {
        privateMetadata: { isDeleted: true },
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái trên Clerk:", error);
      return res.status(500).json({
        message: "Đã cập nhật người dùng trong MongoDB nhưng lỗi trên Clerk",
      });
    }

    res.status(200).json({
      message: "Xóa thành công trên cả Clerk và MongoDB",
      user,
    });
  } catch (error) {
    console.error("Lỗi khi xóa mềm người dùng:", error);
    res.status(500).json({ message: "Lỗi khi xóa mềm người dùng" });
  }
};

export const restoreUser = async (req, res) => {
  const { clerkId } = req.params;

  try {
    //  Cập nhật trạng thái trong MongoDB
    const user = await Users.findOneAndUpdate(
      { clerkId },
      { isDeleted: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    //  Cập nhật trạng thái phục hồi trong Clerk
    try {
      await clerkClient.users.updateUser(clerkId, {
        privateMetadata: { isDeleted: false },
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái trên Clerk:", error);
      return res.status(500).json({
        message: "Đã phục hồi người dùng trong MongoDB nhưng lỗi trên Clerk",
      });
    }

    res.status(200).json({
      message: "Người dùng đã được phục hồi trên cả Clerk và MongoDB",
      user,
    });
  } catch (error) {
    console.error("Lỗi khi phục hồi người dùng:", error);
    res.status(500).json({ message: "Lỗi khi phục hồi người dùng" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const updateData = req.body;

    if (!clerkId) {
      return res.status(400).json({ message: "ID người dùng không hợp lệ." });
    }

    // Kiểm tra người dùng tồn tại
    const user = await Users.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    // Chuẩn bị dữ liệu cho Clerk và MongoDB
    const clerkUpdateData = {
      firstName: updateData.firstName,
      lastName: updateData.lastName,
      emailAddress: updateData.email,
      imageUrl: updateData.imageUrl,
      publicMetadata: {
        phone: updateData.phone,
        gender: updateData.gender,
        birthdate: updateData.birthdate,
      },
    };

    // Xử lý mật khẩu
    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(updateData.password, 10); // Hash mật khẩu
      updateData.password = hashedPassword; // Lưu vào MongoDB
      clerkUpdateData.password = updateData.passwordPlaintext; // Gửi plaintext cho Clerk API
    }

    // Cập nhật dữ liệu cho Clerk
    await clerkClient.users.updateUser(clerkId, clerkUpdateData);

    // Cập nhật MongoDB
    const updatedUser = await Users.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    res.status(200).json({
      message: "Cập nhật người dùng thành công",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error);
    res.status(500).json({ message: "Lỗi cập nhật người dùng" });
  }
};

export const banUser = async (req, res) => {
  const { clerkId } = req.params;
  try {
    // Cập nhật trạng thái ban trên Clerk
    await clerkClient.users.updateUser(clerkId, {
      privateMetadata: { isBanned: true },
    });

    // Tìm user trong MongoDB bằng clerkId và cập nhật trạng thái
    const user = await Users.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    user.isBanned = true;
    await user.save();

    res.status(200).json({ message: "User đã bị ban thành công" });
  } catch (error) {
    console.error("Lỗi khi ban user:", error);
    res.status(500).json({ message: "Có lỗi xảy ra: " + error.message });
  }
};

// Unban user
export const unbanUser = async (req, res) => {
  const { clerkId } = req.params;
  try {
    // Cập nhật trạng thái ban trên Clerk
    await clerkClient.users.updateUser(clerkId, {
      privateMetadata: { isBanned: false },
    });

    // Tìm user trong MongoDB bằng clerkId và cập nhật trạng thái
    const user = await Users.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    user.isBanned = false;
    await user.save();

    res.status(200).json({ message: "User đã được bỏ ban thành công" });
  } catch (error) {
    console.error("Lỗi khi bỏ ban user:", error);
    res.status(500).json({ message: "Có lỗi xảy ra: " + error.message });
  }
};

export const checkUserStatus = async (req, res) => {
  const { clerkId } = req.params;

  try {
    // Lấy thông tin người dùng từ Clerk
    const clerkUser = await clerkClient.users.getUser(clerkId);

    if (!clerkUser) {
      return res
        .status(404)
        .json({ message: "Người dùng không tồn tại trên Clerk" });
    }

    // Kiểm tra trạng thái bị ban và xóa mềm
    const isBanned = clerkUser.privateMetadata?.isBanned || false;
    const isDeleted = clerkUser.privateMetadata?.isDeleted || false;

    // Lấy thông tin từ MongoDB để đảm bảo đồng bộ
    const mongoUser = await Users.findOne({ clerkId });

    if (!mongoUser) {
      return res
        .status(404)
        .json({ message: "Người dùng không tồn tại trong MongoDB" });
    }

    res.status(200).json({
      isBanned,
      isDeleted,
      mongoDB: {
        isDeleted: mongoUser.isDeleted,
        isBanned: mongoUser.isBanned,
      },
    });
  } catch (error) {
    console.error("Lỗi khi kiểm tra trạng thái người dùng:", error);
    res.status(500).json({ message: "Có lỗi xảy ra: " + error.message });
  }
};

// WISHLIST

export const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await Users.findOne({ _id: req.params.userId });

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    if (!productId) {
      return res.status(400).json({ message: "Thiếu thông tin sản phẩm" });
    }

    const product = await Product.findOne({
      _id: productId,
      deleted: false,
    });

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    if (user.wishList.includes(productId)) {
      user.wishList = user.wishList.filter(
        (id) => id._id.toString() !== productId
      );
      await user.save();
      return res.status(200).json({ message: "Xóa sản phẩm wishlist" });
    }

    user.wishList.push(productId);
    await user.save();

    return res
      .status(200)
      .json({ message: "Thêm sản phẩm vào wishlist thành công" });
  } catch (error) {
    return res.status(500).json({ message: "Có lỗi xảy ra: " + error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user = await Users.findOne({ _id: req.params.userId }).populate({
      path: "wishList",
      populate: {
        path: "variants",
        model: "Variant",
        match: { deleted: false },
        // options: { strictPopulate: false },
        populate: {
          path: "values",
          model: "AttributeValue",
          match: { deleted: false },
          // options: { strictPopulate: false },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    return res.status(200).json({
      data: user.wishList,
      count: user.wishListCount,
    });
  } catch (error) {
    return res.status(500).json({ message: "Có lỗi xảy ra: " + error.message });
  }
};
