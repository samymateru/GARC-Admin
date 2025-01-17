"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ColumnDef,
  SortingState,
  getSortedRowModel,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  VisibilityState,
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
import { DataTablePagination } from "../shared/custom-pagination";
import { Input } from "../ui/input";
import AddMember from "./add-member";
import { CirclePlus, Plus, Search, UserPlus } from "lucide-react";
import { Label } from "../ui/label";
import AdminNavToolTip from "../navigation/tooltip";
import { Tabs, TabsContent } from "../ui/tabs";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function MemberTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [filterTab, setFilterTab] = useState<string>("Name");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 8,
  });
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination,
      sorting,
      columnVisibility,
      columnFilters,
    },
  });

  return (
    <div className="flex flex-col">
      <div className="ml-4 flex justify-between items-center pr-4">
        <div className="flex justify-center items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="border border-neutral-800 w-[100px] py-[5.5px] rounded-md font-medium text-[15px]">
              {filterTab}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                className="cursor-pointer pl-2"
                onClick={() => setFilterTab("Name")}>
                Names
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                className="cursor-pointer pl-2"
                onClick={() => setFilterTab("Emails")}>
                Emails
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Tabs value={filterTab}>
            <TabsContent value="Name" className="mt-0">
              <div className="flex items-center py-4 outline-none relative">
                <Input
                  placeholder="Filter Names..."
                  value={
                    (table.getColumn("name")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm outline-none focus:ring-0 focus:outline-0 pl-[30px]"
                />
                <Search className="absolute left-2" size={16} />
              </div>
            </TabsContent>
            <TabsContent value="Emails" className="mt-0">
              <div className="flex items-center py-4 outline-none relative">
                <Input
                  placeholder="Filter Emails..."
                  value={
                    (table.getColumn("email")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table.getColumn("email")?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm outline-none focus:ring-0 focus:outline-0 pl-[30px]"
                />
                <Search className="absolute left-2" size={16} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex items-center justify-center gap-2">
          <AddMember>
            <AdminNavToolTip message="Add Member" side="left">
              <div
                role="button"
                tabIndex={0}
                className="cursor-pointer dark:hover:bg-accent h-[36px] w-[48px] rounded-md flex items-center justify-center">
                <CirclePlus size={17} />
              </div>
            </AdminNavToolTip>
          </AddMember>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="ml-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[160px]">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }>
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex flex-col justify-between flex-1">
        <div className="">
          <Table className="bg-white dark:bg-background">
            <TableHeader className="border-none text-black">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent border-none">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="text-black font-semibold font-mono dark:text-white">
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

            <TableBody className="border-b-0 border-b-slate-600">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="text-black font-medium dark:text-white">
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
                    className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            className="bg-gray-900 w-[85px] text-white"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button
            variant="outline"
            className="bg-gray-900 text-white w-[85px]"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
