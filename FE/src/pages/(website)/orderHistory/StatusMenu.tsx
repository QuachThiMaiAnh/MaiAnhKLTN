
interface StatusMenuProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

const StatusMenu = ({ selectedStatus, onStatusChange }: StatusMenuProps) => {
  // Danh sách các trạng thái
  const statuses = [
   "chờ xác nhận", "đã xác nhận", "đang giao hàng", "đã hoàn thành", "hủy đơn"
  ];

  return (
    <div className="py-4">
      <div className="flex space-x-6">
        {statuses.map((status) => (
          <div
            key={status}
            className={`cursor-pointer text-lg font-semibold ${
              selectedStatus === status
                ? "border-b-2 border-red-500"
                : "border-b-2 border-transparent"
            }`}
            onClick={() => onStatusChange(status)}
          >
            {status}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusMenu;
