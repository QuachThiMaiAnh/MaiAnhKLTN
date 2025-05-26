import React from "react";

interface AccountLockedNotificationProps {
  onClose: () => void;
}

const AccountLockedNotification: React.FC<AccountLockedNotificationProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg text-center relative pt-20 w-full max-w-md">
        {/* Nút đóng "X" ở góc trên bên phải */}
        <button
          onClick={onClose}
          className="absolute top-2 right-5 text-gray-600 hover:text-red-600 text-3xl font-serif focus:outline-none"
        >
          ×
        </button>
        
        {/* Biểu tượng cảnh báo */}
        <div className="absolute -top-0 mt-2 left-1/2 transform -translate-x-1/2 text-6xl text-red-600">
          ⚠️
        </div>

        {/* Nội dung thông báo */}
        <h2 className="text-xl font-bold mb-4 text-red-600">
          Tài khoản của bạn đã bị vô hiệu hóa!
        </h2>
        <p className="mb-6">Vui lòng liên hệ hỗ trợ để biết thêm thông tin!</p>

      </div>
    </div>
  );
};

export default AccountLockedNotification;
