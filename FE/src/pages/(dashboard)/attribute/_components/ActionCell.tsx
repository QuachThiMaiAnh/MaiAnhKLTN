import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { useDeleteAttribute } from "../actions/useDeleteAttribute";
import { Attribute } from "@/common/types/Orders"; // Kiểu dữ liệu Attribute
import { Row } from "@tanstack/react-table"; // Dữ liệu của một dòng bảng
import { useDisplayAttribute } from "../actions/useDisplayAttribute";

interface ActionCellProps {
  row: Row<Attribute>; // Dữ liệu của một dòng trong bảng thuộc tính
}

const ActionCell: React.FC<ActionCellProps> = ({ row }) => {
  const { deleteAttribute, isDeleting } = useDeleteAttribute(); // Hook ẩn thuộc tính
  const { displayAttribute, isUpdating } = useDisplayAttribute(); // Hook hiển thị lại thuộc tính

  // Xử lý ẩn thuộc tính (soft delete)
  const handleDelete = async () => {
    if (confirm("Bạn có chắc muốn ẩn thuộc tính này?")) {
      try {
        await deleteAttribute(row.original._id);
      } catch (error) {
        console.error("Lỗi khi xóa thuộc tính:", error);
        alert("Ẩn thất bại, vui lòng thử lại.");
      }
    }
  };

  // Xử lý hiển thị lại thuộc tính
  const handleDisplay = async () => {
    if (confirm("Bạn có chắc hiển thị thuộc tính này?")) {
      try {
        await displayAttribute(row.original._id);
      } catch (error) {
        console.error("Lỗi khi hiển thị thuộc tính:", error);
        alert("Hiển thị thất bại, vui lòng thử lại.");
      }
    }
  };

  return (
    <DropdownMenu>
      {/* Nút mở menu hành động (3 chấm) */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {/* Xem thêm - chuyển sang trang danh sách giá trị của thuộc tính */}
        <DropdownMenuItem>
          <Link to={`/admin/attributesValues/${row.original._id}`}>
            Xem thêm
          </Link>
        </DropdownMenuItem>

        {/* Chuyển sang trang chỉnh sửa thuộc tính */}
        <DropdownMenuItem>
          <Link to={`/admin/attributes/edit/${row.original._id}`}>Sửa</Link>
        </DropdownMenuItem>

        {/* Hành động ẩn hoặc hiển thị lại thuộc tính */}
        <DropdownMenuItem>
          {row.original.deleted === false ? (
            <DropdownMenuItem onClick={handleDelete}>
              {isDeleting ? "Đang ẩn..." : "Ẩn"}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleDisplay}>
              {isUpdating ? "Đang hiện..." : "Hiện"}
            </DropdownMenuItem>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionCell;
