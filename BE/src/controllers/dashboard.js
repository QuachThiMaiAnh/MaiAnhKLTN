import { StatusCodes } from "http-status-codes";
import Order from "../models/order";
import Product from "../models/product";
import Users from "../models/users";

export const getDataCard = async (req, res) => {
    try {
        const order = await Order.find();
        const total = order.reduce((acc, item) => item.status === "đã hoàn thành" ? acc + (item.totalPrice - 30000) : acc, 0);
        const product = await Product.find({ deleted: false });
        const user = await Users.find({ role: "User" }, { isDeleted: false }, { isBanned: false });
        //Lợi nhuận
        const result = await Order.aggregate([
            {
                // Lọc các đơn hàng có status: "đã hoàn thành"
                $match: { status: "đã hoàn thành" },
            },
            {
                // Tính toán giá trị lợi nhuận cho từng đơn hàng
                $addFields: {
                    profit: {
                        $subtract: [
                            {
                                $subtract: [
                                    "$totalPrice",
                                    {
                                        $sum: {
                                            $map: {
                                                input: "$products",
                                                as: "product",
                                                in: {
                                                    $multiply: ["$$product.variantItem.originalPrice", "$$product.quantity"],
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                            30000,
                        ],
                    },
                },
            },
            {
                // Tính tổng giá trị lợi nhuận
                $group: {
                    _id: null, // Không nhóm theo trường nào cả
                    totalProfit: { $sum: "$profit" },
                },
            },
            {
                // Chỉ giữ trường totalProfit trong kết quả trả về
                $project: {
                    _id: 0,
                    totalProfit: 1,
                },
            },
        ]);

        // Nếu result không có kết quả trả về mặc định là 0
        const totalProfit = result.length > 0 ? result[0].totalProfit : 0;

        // Vốn nhập hàng
        const result2 = await Order.aggregate([
            {
                // Lọc các đơn hàng có status: "đã hoàn thành"
                $match: { status: "đã hoàn thành" },
            },
            {
                // Bước 1: Unwind mảng products để tách từng phần tử
                $unwind: "$products",
            },
            {
                // Bước 2: Tính toán giá trị cho từng sản phẩm
                $addFields: {
                    productTotal: {
                        $multiply: [
                            "$products.variantItem.originalPrice",
                            "$products.quantity"
                        ],
                    },
                },
            },
            {
                // Bước 3: Tính tổng giá trị productTotal
                $group: {
                    _id: null, // Không nhóm theo trường nào cả
                    totalProductValue: { $sum: "$productTotal" },
                },
            },
            {
                // Bước 4: Chỉ giữ trường tổng product value trong kết quả trả về
                $project: {
                    _id: 0,
                    totalProductValue: 1,
                },
            },
        ]);

        const totalImport = result2.length > 0 ? result2[0].totalProductValue : 0;

        const data = { total: total, order: order.length, product: product.length, user: user.length, totalProfit: totalProfit, totalImport: totalImport };
        return res.status(StatusCodes.OK).json(data)
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}

export const getDataAreaChart = async (req, res) => {
    try {
        const chartData = await Order.aggregate([
            {
                // Lọc các đơn hàng có status: "đã hoàn thành"
                $match: { status: "đã hoàn thành" },
            },
            {
                // Lấy timestamp của status "đã hoàn thành" từ statusHistory
                $addFields: {
                    date: {
                        $let: {
                            vars: {
                                completedStatus: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$statusHistory",
                                                as: "statusItem",
                                                cond: { $eq: ["$$statusItem.status", "đã hoàn thành"] },
                                            },
                                        },
                                        0,
                                    ],
                                },
                            },
                            in: {
                                $dateToString: { format: "%Y-%m-%d", date: "$$completedStatus.timestamp" },
                            },
                        },
                    },
                },
            },
            {
                // Tính toán desktop và mobile cho từng đơn hàng
                $addFields: {
                    desktop: {
                        $subtract: ["$totalPrice", 30000],
                    },
                    mobile: {
                        $subtract: [
                            {
                                $subtract: [
                                    "$totalPrice",
                                    {
                                        $sum: {
                                            $map: {
                                                input: "$products",
                                                as: "product",
                                                in: {
                                                    $multiply: ["$$product.variantItem.originalPrice", "$$product.quantity"],
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                            30000,
                        ],
                    },
                },
            },
            {
                // Nhóm theo "date" và tính tổng desktop và mobile theo ngày
                $group: {
                    _id: "$date", // Nhóm theo ngày
                    desktop: { $sum: "$desktop" },
                    mobile: { $sum: "$mobile" },
                },
            },
            {
                // Đổi tên trường _id thành "date" trong kết quả
                $project: {
                    _id: 0, // Loại bỏ _id
                    date: "$_id",
                    desktop: 1,
                    mobile: 1,
                },
            },
            {
                // Sắp xếp kết quả theo ngày tăng dần
                $sort: { date: 1 },
            },
        ]);

        return res.status(StatusCodes.OK).json(chartData);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

export const getDataUserList = async (req, res) => {
    try {
        const topUsers = await Order.aggregate([
            {
                // Lọc các đơn hàng có status: "đã hoàn thành"
                $match: { status: "đã hoàn thành" },
            },
            {
                $addFields: {
                    adjustedTotalPrice: { $subtract: ["$totalPrice", 30000] }, // Trừ đi 30000 cho mỗi totalPrice
                },
            },
            {
                $group: {
                    _id: "$userId", // Nhóm theo userId
                    totalSpent: { $sum: "$adjustedTotalPrice" }, // Tính tổng tiền đã điều chỉnh cho mỗi user
                },
            },
            {
                $sort: { totalSpent: -1 }, // Sắp xếp theo tổng tiền chi tiêu giảm dần
            },
            {
                $limit: 5, // Giới hạn số lượng kết quả
            },
            {
                $lookup: {
                    from: "users", // Tên của collection người dùng (nếu khác thì chỉnh lại)
                    localField: "_id", // Trường userId trong Order
                    foreignField: "_id", // Trường _id trong collection User
                    as: "userDetails", // Thêm thông tin người dùng vào kết quả
                },
            },
            {
                $unwind: "$userDetails", // Làm phẳng userDetails thành một đối tượng
            },
            {
                $project: {
                    userId: "$_id",
                    clerkId: "$userDetails.clerkId",
                    totalSpent: 1,
                    userName: { $concat: ["$userDetails.firstName", " ", "$userDetails.lastName"] }, // Lấy tên người dùng
                    userEmail: "$userDetails.email", // Lấy email người dùng
                    userAvatar: "$userDetails.imageUrl", // Lấy avatar người dùng
                },
            },
        ]);

        return res.status(StatusCodes.OK).json(topUsers);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

export const getDataTopProducts = async (req, res) => {
    try {
        // const result = await Order.aggregate([
        //     // Bóc tách danh sách sản phẩm từ mỗi đơn hàng
        //     { $unwind: "$products" },
        //     { $unwind: "$products.productItem" }, // Bóc tách 'productItem'

        //     // Gom nhóm dữ liệu theo sản phẩm (dựa trên productItem._id)
        //     {
        //         $group: {
        //             _id: "$products.productItem._id", // Gom nhóm theo productItem._id
        //             productName: { $first: "$products.productItem.name" }, // Lấy tên sản phẩm
        //             slug: { $first: "$products.productItem.slug" }, // Lấy tên sản phẩm
        //             category: { $first: "$products.productItem.category" }, // Lấy danh mục sản phẩm
        //             image: { $first: "$products.productItem.image" }, // Lấy hình ảnh sản phẩm
        //             quantity: { $sum: "$products.quantity" }, // Tổng số lượng bán
        //         },
        //     },

        //     // Sắp xếp theo tổng số lượng giảm dần
        //     { $sort: { quantity: -1 } },
        // ]);
        const result = await Product.find({ deleted: false }).populate("category").sort({ count: - 1 });
        const newResult = result.map((item) => {
            return {
                _id: item._id,
                productName: item.name,
                slug: item.slug,
                category: item.category,
                image: item.image,
                quantity: item.count
            }
        })

        return res.status(StatusCodes.OK).json(newResult);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}

export const getDataOrderList = async (req, res) => {
    try {
        // Tìm tất cả đơn hàng và populate thông tin userId và addressId
        const orders = await Order.find().populate("userId").sort({ createdAt: -1 });
        // Kiểm tra nếu không có đơn hàng
        if (orders.length === 0) {
            return res.status(404).json({ message: "Không có đơn hàng nào" });
        }
        const newOrders = orders.filter((order) => order.status !== "đã hoàn thành" && order.status !== "hủy đơn");
        // console.log(newOrders);
        // Trả về danh sách đơn hàng
        return res.status(StatusCodes.OK).json(newOrders);
    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({
                message: "Lỗi khi lấy danh sách đơn hàng",
                error: error.message,
            });
    }
};