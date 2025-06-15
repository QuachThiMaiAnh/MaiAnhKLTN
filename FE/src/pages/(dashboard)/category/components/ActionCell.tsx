import { Category } from "@/common/types/Orders";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useDeleteCategory } from "../actions/useDeleteCategory";
import { useDisplayCategory } from "../actions/useDisplayCategory";
import { useGetAllProductWithCategory } from "../actions/useGettAllProductWithCategory";

interface ActionCellProps {
  row: Row<Category>;
}

const ActionCell: React.FC<ActionCellProps> = ({ row }) => {
  const { deleteCategoryById, isDeleting } = useDeleteCategory(
    row.original._id
  );
  const { displayCategory, isUpdating } = useDisplayCategory(row.original._id);
  const { isGetting, productCount, errorGetting } =
    useGetAllProductWithCategory(row.original._id);

  // console.log("countProduct", countProduct);

  const handleDelete = async () => {
    if (
      confirm(
        `Bạn có chắc ẩn danh mục này? Hiện tại có ${productCount.count} sản phẩm đang sử dụng danh mục này.`
      )
    ) {
      try {
        await deleteCategoryById(row.original._id);
      } catch (error) {
        console.error("Lỗi khi ẩn danh mục:", error);
        alert("Ẩn thất bại, vui lòng thử lại.x");
      }
    }
  };

  const handleDisplay = async () => {
    if (confirm("Bạn có chắc hiển thị danh mục này?")) {
      try {
        await displayCategory(row.original._id);
      } catch (error) {
        console.error("Lỗi khi hiển thị danh mục:", error);
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
          <Link to={`/admin/categories/edit/${row.original._id}`}>Sửa</Link>
        </DropdownMenuItem>

        {row.original.defaultCategory == false ? (
          row.original.deleted === false ? (
            <DropdownMenuItem onClick={handleDelete}>
              {isDeleting ? "Đang ẩn..." : "Ẩn"}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleDisplay}>
              {isUpdating ? "Đang hiện..." : "Hiện"}
            </DropdownMenuItem>
          )
        ) : (
          ""
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionCell;
