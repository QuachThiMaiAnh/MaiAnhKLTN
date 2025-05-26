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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  let paginationButtons = [];
  const paginationGoups = [];
  const paginationGoupLimit = 10;
  const currentPage = table.getState().pagination.pageIndex;
  for (let i = 0; i < table.getPageCount(); i++) {
    if (i > 0 && i % paginationGoupLimit === 0) {
      paginationButtons.push(<span>...</span>);
      paginationGoups.push(paginationButtons);
      paginationButtons = [];
    }
    paginationButtons.push(
      <button
        className={currentPage === i ? "active" : ""}
        key={i}
        onClick={() => table.setPageIndex(i)}
      >
        {i + 1}
      </button>
    );
  }
  if (paginationButtons.length > 0) {
    if (paginationGoups.length > 0) {
      paginationButtons.unshift(<span>...</span>);
    }
    paginationGoups.push(paginationButtons);
    paginationButtons = [];
  }
  // const getCurrentPaginationGroup = () => {
  //   for (const i in paginationGoups) {
  //     if (
  //       paginationGoups[i].findIndex((u) => u.key === String(currentPage)) !==
  //       -1
  //     ) {
  //       return paginationGoups[i];
  //     }
  //   }
  // };

  return (
    <>
      <div className="border bg-white rounded-lg mb-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
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
      <PaginationProducts table={table} />
    </>
  );
}
