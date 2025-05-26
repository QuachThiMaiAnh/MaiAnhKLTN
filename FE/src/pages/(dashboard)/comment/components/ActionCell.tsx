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
import { useDeleteComment } from "../actions/useDeleteComment";
import { useDisplayComment } from "../actions/useDisplayComment";
// import { useDeleteCategory } from "../actions/useDeleteCategory";
// import { useDisplayCategory } from "../actions/useDisplayCategory";
// import { useGettAllProductWithCategory } from "../actions/useGettAllProductWithCategory";

interface ActionCellProps {
  row: Row<Category>;
}

const ActionCell: React.FC<ActionCellProps> = ({ row }) => {
  const { deleteComment, isDeleting } = useDeleteComment(row.original._id);
  const { displayComment, isUpdating } = useDisplayComment(row.original._id);

  const handleDelete = async () => {
    if (confirm(`Bạn có chắc ẩn đánh giá này? `)) {
      try {
        await deleteComment(row.original._id);
      } catch (error) {
        console.error("Lỗi khi ẩn đánh giá:", error);
        alert("Ẩn thất bại, vui lòng thử lại.");
      }
    }
  };

  const handleDisplay = async () => {
    if (confirm("Bạn có chắc hiển đánh giá này?")) {
      try {
        await displayComment(row.original._id);
      } catch (error) {
        console.error("Lỗi khi hiển thị đánh giá:", error);
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
        {row.original.deleted === false ? (
          <DropdownMenuItem onClick={handleDelete}>
            {" "}
            {isDeleting ? "Đang ẩn..." : "Ẩn"}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleDisplay}>
            {isUpdating ? "Đang hiển thị..." : "Hiển thị"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionCell;
