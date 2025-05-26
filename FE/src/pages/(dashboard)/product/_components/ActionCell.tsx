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
import { useDeleteProduct } from "../actions/useDeleteProduct";
import { Row } from "@tanstack/react-table";
import { IProduct } from "@/common/types/Orders";
import { useDisplayProduct } from "../actions/useDisplayProduct";
// import { useDisplayProduct } from "../actions/useDisplayproduct";

// import { useDeleteAttribute } from "../actions/useDeleteAttribute";

interface ActionCellProps {
  row: Row<IProduct>;
}

const ActionCell: React.FC<ActionCellProps> = ({ row }) => {
  const { deleteProduct, isDeleting } = useDeleteProduct(row.original._id);
  const { displayProduct, isUpdating } = useDisplayProduct(row.original._id);

  // console.log("id", row);

  const handleDelete = async () => {
    if (confirm("Bạn có chắc ẩn sản phẩm này?")) {
      try {
        await deleteProduct(row.original._id);
      } catch (error) {
        console.error("Lỗi khi ẩn sản phẩm:", error);
        alert("Ẩn thất bại, vui lòng thử lại.");
      }
    }
  };

  const handleDisplay = async () => {
    if (confirm("Bạn có chắc hiển thị sản phẩm này?")) {
      try {
        await displayProduct(row.original._id);
      } catch (error) {
        console.error("Lỗi khi hiển thị sản phẩm:", error);
        alert("Hiển thị thất bại, vui lòng thử lại.");
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link to={`/admin/products/edit/${row.original._id}`}>Sửa</Link>
        </DropdownMenuItem>
        {row.original.deleted === false ? (
          <DropdownMenuItem onClick={handleDelete}>
            {isDeleting ? "Đang ẩn..." : "Ẩn"}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleDisplay}>
            {isUpdating ? "Đang hiện..." : "Hiện"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionCell;
