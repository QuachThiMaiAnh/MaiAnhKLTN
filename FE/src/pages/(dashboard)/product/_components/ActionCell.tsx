import React from "react";
import { Link } from "react-router-dom";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useDeleteProduct } from "../actions/useDeleteProduct";
import { useDisplayProduct } from "../actions/useDisplayProduct";
import { IProduct } from "@/common/types/Orders";

// Props nhận 1 dòng dữ liệu sản phẩm từ bảng
interface ActionCellProps {
  row: Row<IProduct>;
}

const ActionCell: React.FC<ActionCellProps> = ({ row }) => {
  const { deleteProduct, isDeleting } = useDeleteProduct();
  const { displayProduct, isUpdating } = useDisplayProduct();

  const productId = row.original._id;
  const isDeleted = row.original.deleted;

  // Hàm xử lý ẩn sản phẩm (soft-delete)
  const handleDelete = async () => {
    const confirmed = confirm("Bạn có chắc ẩn sản phẩm này?");
    if (!confirmed) return;

    try {
      await deleteProduct(productId);
    } catch (error) {
      console.error("Lỗi khi ẩn sản phẩm:", error);
      alert("Ẩn thất bại, vui lòng thử lại.");
    }
  };

  // Hàm xử lý hiển thị lại sản phẩm đã bị ẩn
  const handleDisplay = async () => {
    const confirmed = confirm("Bạn có chắc hiển thị sản phẩm này?");
    if (!confirmed) return;

    try {
      await displayProduct(productId);
    } catch (error) {
      console.error("Lỗi khi hiển thị sản phẩm:", error);
      alert("Hiển thị thất bại, vui lòng thử lại.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" title="Tùy chọn">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {/* Link chỉnh sửa sản phẩm */}
        <DropdownMenuItem asChild>
          <Link to={`/admin/products/edit/${productId}`} title="Sửa sản phẩm">
            Sửa
          </Link>
        </DropdownMenuItem>

        {/* Nếu sản phẩm chưa bị ẩn, hiện nút Ẩn; nếu đã bị ẩn, hiện nút Hiện */}
        {isDeleted === false ? (
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={isDeleting}
            title="Ẩn sản phẩm khỏi danh sách"
          >
            {isDeleting ? "Đang ẩn..." : "Ẩn"}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={handleDisplay}
            disabled={isUpdating}
            title="Hiển thị lại sản phẩm"
          >
            {isUpdating ? "Đang hiện..." : "Hiện"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionCell;
