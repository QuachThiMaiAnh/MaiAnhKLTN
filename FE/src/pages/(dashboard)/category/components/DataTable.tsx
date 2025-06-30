import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";

import { Pagination } from "@/pages/(dashboard)/product/_components/Pagination";
import { useState } from "react";

// Giao diện props cho bảng: nhận cột và dữ liệu
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]; // Định nghĩa cấu trúc các cột
  data: TData[]; // Dữ liệu được hiển thị trong bảng
}

// Component DataTable có thể tái sử dụng cho bất kỳ kiểu dữ liệu nào
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // Trạng thái lưu bộ lọc theo cột
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Khởi tạo bảng sử dụng tanstack/react-table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(), // Lấy toàn bộ dữ liệu (không lọc, không phân trang)
    getPaginationRowModel: getPaginationRowModel(), // Bổ sung tính năng phân trang
    onColumnFiltersChange: setColumnFilters, // Xử lý khi bộ lọc thay đổi
    getFilteredRowModel: getFilteredRowModel(), // Kết quả dữ liệu sau khi lọc
    initialState: {
      pagination: {
        pageSize: 5, // Mỗi trang hiển thị 5 dòng
      },
    },
    state: {
      columnFilters, // Liên kết trạng thái bộ lọc vào bảng
    },
  });

  // Xử lý nhóm phân trang nếu bạn muốn hiện 10 nút trang mỗi cụm
  let paginationButtons = [];
  const paginationGoups = [];
  const paginationGoupLimit = 10; // Giới hạn hiển thị số lượng nút trang mỗi nhóm
  const currentPage = table.getState().pagination.pageIndex; // Trang hiện tại

  // Tạo danh sách các nút trang
  for (let i = 0; i < table.getPageCount(); i++) {
    // Khi đủ giới hạn 1 nhóm phân trang, thêm "..." rồi nhóm lại
    if (i > 0 && i % paginationGoupLimit === 0) {
      paginationButtons.push(<span>...</span>);
      paginationGoups.push(paginationButtons);
      paginationButtons = [];
    }

    paginationButtons.push(
      <button
        className={currentPage === i ? "active" : ""} // Gắn class active cho trang hiện tại
        key={i}
        onClick={() => table.setPageIndex(i)} // Chuyển sang trang được chọn
      >
        {i + 1}
      </button>
    );
  }

  // Đảm bảo nhóm cuối cùng cũng được đẩy vào
  if (paginationButtons.length > 0) {
    if (paginationGoups.length > 0) {
      paginationButtons.unshift(<span>...</span>);
    }
    paginationGoups.push(paginationButtons);
    paginationButtons = [];
  }

  return (
    <>
      {/* Bộ lọc tìm kiếm theo tên (áp dụng trên cột "name") */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Tìm tên sản phẩm"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-52 mb-2"
        />
      </div>

      {/* Vùng hiển thị bảng dữ liệu */}
      <div className="border bg-white rounded-lg">
        <Table>
          {/* Tiêu đề các cột */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {/* Nếu không phải là placeholder, render nội dung */}
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* Dữ liệu từng hàng */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {/* Hiển thị từng ô dữ liệu trong dòng */}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Trường hợp không có dữ liệu
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không có danh mục nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Phân trang tùy chỉnh (component riêng) */}
      <Pagination table={table} />
    </>
  );
}
