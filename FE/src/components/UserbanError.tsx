import React from "react";

interface AccountLockedNotificationProps {
  onClose: () => void;
}

const AccountLockedNotification: React.FC<AccountLockedNotificationProps> = ({
  onClose, // là một hàm callback để đóng thông báo (được gọi khi người dùng click nút “×”).
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative w-full max-w-md p-8 pt-20 text-center rounded-lg shadow-lg bg-background text-foreground">
        {/* Nút đóng "×" */}
        <button
          onClick={onClose}
          aria-label="Đóng thông báo"
          className="absolute top-2 right-5 text-3xl font-serif text-muted-foreground hover:text-destructive-foreground focus:outline-none"
        >
          ×
        </button>

        {/* Icon cảnh báo */}
        <div className="absolute -top-0 left-1/2 mt-2 transform -translate-x-1/2 text-6xl text-destructive">
          ⚠️
        </div>

        {/* Tiêu đề */}
        <h2 className="mb-4 text-xl font-bold text-destructive">
          Tài khoản của bạn đã bị vô hiệu hóa!
        </h2>

        {/* Nội dung */}
        <p className="mb-6 text-muted-foreground">
          Vui lòng liên hệ hỗ trợ để biết thêm thông tin chi tiết.
        </p>
      </div>
    </div>
  );
};

export default AccountLockedNotification;
