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
import { Attribute } from "@/common/types/Orders";
import { Row } from "@tanstack/react-table";
import { useDisplayAttribute } from "../actions/useDisplayAttribute";

interface ActionCellProps {
  row: Row<Attribute>;
}

const ActionCell: React.FC<ActionCellProps> = ({ row }) => {
  const { deleteAttribute, isDeleting } = useDeleteAttribute();
  const { displayAttribute, isUpdating } = useDisplayAttribute();

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
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link to={`/admin/attributesValues/${row.original._id}`}>
            Xem thêm
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to={`/admin/attributes/edit/${row.original._id}`}>Sửa</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          {row.original.deleted === false ? (
            <DropdownMenuItem onClick={handleDelete}>
              {isDeleting ? "Đang ẩn..." : "Ẩn"}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleDisplay}>
              {isUpdating ? "Đang hiện..." : "Hiện"}
              {/* Hiện */}
            </DropdownMenuItem>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionCell;
