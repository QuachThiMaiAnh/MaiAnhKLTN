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
import { useDeleteAttributeValue } from "../actions/useDeleteAttributeValue";
import { AttributeValue } from "@/common/types/Orders";
import { Row } from "@tanstack/react-table";
import { useDisplayAttributeValue } from "../actions/useDisplayAttributeValue";

interface ActionCellProps {
  row: Row<AttributeValue>;
}

const ActionCell: React.FC<ActionCellProps> = ({ row }) => {
  const { deleteAtributesValue, isDeleting } = useDeleteAttributeValue();
  const { displayAttributeValue, isUpdating } = useDisplayAttributeValue();

  const handleDelete = async () => {
    if (confirm("Bạn có chắc muốn ẩn giá trị thuộc tính này?")) {
      try {
        await deleteAtributesValue(row.original._id);
      } catch (error) {
        console.error("Lỗi khi ẩn giá trị thuộc tính:", error);
        // alert("Xóa thất bại, vui lòng thử lại.");
      }
    }
  };

  const handleDisplay = async () => {
    if (confirm("Bạn có chắc hiển thị giá trị thuộc tính này?")) {
      try {
        await displayAttributeValue(row.original._id);
      } catch (error) {
        console.error("Lỗi khi hiển thị giá trị thuộc tính:", error);
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
          <Link to={`/admin/attributesValues/${row.original._id}/edit`}>
            Sửa
          </Link>
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
