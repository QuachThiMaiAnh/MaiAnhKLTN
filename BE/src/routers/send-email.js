import express from "express";
import nodemailer from "nodemailer";
import { StatusCodes } from "http-status-codes"; // Import StatusCodes

const sendEmailRouter = express.Router();

// Hàm gửi email
const sendEmail = async (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Hoặc dịch vụ khác bạn sử dụng
    auth: {
      user: process.env.GMAIL_USER, // Địa chỉ email người gửi
      pass: process.env.GMAIL_PASS, // App password (nếu dùng Gmail)
    },
    tls: {
      rejectUnauthorized: false, // Bỏ qua xác thực TLS (không an toàn, chỉ dùng trong môi trường phát triển)
    },
  });
  console.log("Gmail User:", process.env.GMAIL_USER); // Kiểm tra xem biến môi trường có được thiết lập không
  const mailOptions = {
    from: process.env.GMAIL_USER, // Người gửi
    to: to, // Người nhận
    subject: subject, // Tiêu đề email
    html: htmlContent, // Nội dung HTML
  };

  return transporter.sendMail(mailOptions); // Gửi email
};

// API gửi email
sendEmailRouter.post("/send-email", async (req, res) => {
  const { to, subject, htmlContent } = req.body;

  //   Kiểm tra nếu thiếu thông tin email cần thiết
  if (!to || !subject || !htmlContent) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "error",
      message:
        "Thiếu thông tin email. Vui lòng cung cấp đầy đủ địa chỉ email, chủ đề và nội dung.",
    });
  }

  try {
    // Gửi email đến người dùng
    await sendEmail(to, subject, htmlContent);

    // Trả về thông báo thành công khi email được gửi
    return res.status(StatusCodes.CREATED).json({
      status: "success",
      message: `Email đã được gửi thành công đến ${to}.`,
    });
  } catch (error) {
    // Ghi log lỗi và phản hồi với mã lỗi 500 nếu có sự cố khi gửi email
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Lỗi khi gửi email. Vui lòng thử lại sau.",
    });
  }
});

export default sendEmailRouter;
