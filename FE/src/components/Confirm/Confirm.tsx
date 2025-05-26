interface ConfirmDeleteProps {
  isOpen: boolean | string;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const Confirm: React.FC<ConfirmDeleteProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận hành động",
  message = "Bạn có chắc muốn thực hiện hành động này?",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg transform transition-all duration-300 ease-in-out scale-95">
        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>

        {/* Thông điệp */}
        <p
          className="text-gray-800 text-base mb-6"
          dangerouslySetInnerHTML={{ __html: message }}
        />

        {/* Hành động */}
        <div className="flex justify-end space-x-3">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-all duration-150"
            onClick={onClose}
          >
            Hủy bỏ
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-150"
            onClick={onConfirm}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
