import { verifyToken } from "@clerk/clerk-sdk-node";
import { config } from "dotenv";

config();

export const checkAuthClerk = async (req, res, next) => {
  const tokenFromCookie = req.cookies.__session;
  const tokenFromHeader = req.headers.authorization?.replace("Bearer ", "");

  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return res
      .status(401)
      .json({ error: "Không tìm thấy token. Người dùng phải đăng nhập." });
  }

  try {
    const verifiedToken = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    console.log("Token đã xác thực:", verifiedToken);

    next();
  } catch (error) {
    console.error("Lỗi xác thực token:", error);

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Token đã hết hạn. Vui lòng đăng nhập lại." });
    }

    if (error.reason === "token-invalid") {
      return res
        .status(401)
        .json({ error: "Token không hợp lệ. Vui lòng kiểm tra lại." });
    }

    return res
      .status(401)
      .json({ error: "Token không hợp lệ. Truy cập bị từ chối." });
  }
};
