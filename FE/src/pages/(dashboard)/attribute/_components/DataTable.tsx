import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationProducts } from "../../dashboard/_components/PaginationProducts";

// Props nhận vào dữ liệu và cấu hình cột
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // Khởi tạo table instance từ tanstack
  const table = useReactTable({
    data, // Dữ liệu bảng
    columns, // Cấu hình cột
    getCoreRowModel: getCoreRowModel(), // Lấy dữ liệu hàng cơ bản
    getPaginationRowModel: getPaginationRowModel(), // Lấy dữ liệu phân trang
    initialState: {
      pagination: {
        pageSize: 20, // Mặc định 20 dòng/trang
      },
    },
  });

  return (
    <>
      <div className="border bg-white rounded-lg mb-4">
        <Table>
          {/* Header bảng */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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

          {/* Body bảng */}
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
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
              // Nếu không có dữ liệu
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không có thuộc tính
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Component phân trang */}
      <PaginationProducts table={table} />
    </>
  );
}
