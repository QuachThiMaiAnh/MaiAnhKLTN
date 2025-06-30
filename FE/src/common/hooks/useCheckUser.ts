export const saveUserToDatabase = async (
  userId: string,
  userInfo?: Record<string, any>
) => {
  try {
    // Kiểm tra bắt buộc: phải có userId từ Clerk
    if (!userId) {
      console.error("❌ Không có userId được truyền vào.");
      return;
    }

    // Tạo payload cơ bản bắt buộc
    const requestBody: Record<string, any> = { clerkId: userId };

    // Chỉ thêm thông tin mở rộng nếu tồn tại
    //Lặp qua từng trường, nếu tồn tại trong userInfo, sẽ được thêm vào requestBody
    const optionalFields = ["phone", "gender", "birthdate"];
    optionalFields.forEach((field) => {
      if (userInfo?.[field]) requestBody[field] = userInfo[field];
    });

    // Sử dụng biến môi trường cho API URL
    const apiUrl = import.meta.env.VITE_API_URL;

    // Gửi yêu cầu POST đến API để lưu user
    const response = await fetch(`${apiUrl}/users/save-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody), // Gửi toàn bộ requestBody đã tổng hợp
    });

    // Nếu không thành công thì ghi log chi tiết
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Lỗi phản hồi từ server:", errorText);
      return;
    }

    const data = await response.json();
    return data?.user;
  } catch (error) {
    console.error("❌ Lỗi khi lưu user vào database:", error);
  }
};
import { useEffect, useState } from "react";
