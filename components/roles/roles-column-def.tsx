"use client";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Roles } from "./roles-details";
import { Ellipsis, Check, X, Pencil, Trash } from "lucide-react";
import "../../app/globals.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { DataTableColumnHeader } from "../shared/custom-header";
import { Button } from "../ui/button";

export const RolesColumns: ColumnDef<Roles>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader className="ml-1" title="S/N" column={column} />
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
    cell: ({ row }) => {
      if (row.original.name === null) {
        return <span></span>;
      } else {
        return (
          <Label className="text-[13px] tracking-wide dark:text-gray-300">
            {row.original.name}
          </Label>
        );
      }
    },
  },
  {
    accessorKey: "description",
    header: () => {
      return <span className="text-xs">Description</span>;
    },
    cell: ({ row }) => {
      if (row.original.description === null) {
        return <span></span>;
      } else {
        return (
          <Label className="text-[13px] tracking-wide dark:text-gray-300">
            {row.original.description}
          </Label>
        );
      }
    },
  },
  {
    accessorKey: "data",
    header: () => <span className="text-xs">Permissions</span>,
    cell: ({ row }) => {
      if (!row.original.created_at) {
        return <span></span>;
      } else {
        return (
          <Popover>
            <PopoverTrigger className="ml-7">
              <Ellipsis />
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <div className="p-3 space-y-1">
                <Label className="tracking-tight scroll-m-0 font-semibold text-2xl">
                  {row.original.name}
                </Label>
                <Separator />
                <div className="flex flex-col font-bold tracking-tight scroll-m-0 text-xl">
                  <div className="flex justify-between items-center px-3 py-1 rounded-md hover:bg-accent">
                    <Label className="dark:text-white">Write</Label>
                    {row.original.write ? (
                      <Check className="text-green-800" />
                    ) : (
                      <X className="text-red-700" />
                    )}
                  </div>
                  <div className="flex justify-between items-center px-3 py-1 rounded-md hover:bg-accent">
                    <Label className="dark:text-white">Read</Label>
                    {row.original.read ? (
                      <Check className="text-green-800" />
                    ) : (
                      <X className="text-red-700" />
                    )}
                  </div>
                  <div className="flex justify-between items-center px-3 py-1 rounded-md hover:bg-accent">
                    <Label className="dark:text-white">Edit</Label>
                    {row.original.edit ? (
                      <Check className="text-green-800" />
                    ) : (
                      <X className="text-red-700" />
                    )}
                  </div>
                  <div className="flex justify-between items-center px-3 py-1 rounded-md hover:bg-accent">
                    <Label className="dark:text-white">Delete</Label>
                    {row.original.delete ? (
                      <Check className="text-green-800" />
                    ) : (
                      <X className="text-red-700" />
                    )}
                  </div>
                  <div className="flex justify-between items-center px-3 py-1 rounded-md hover:bg-accent">
                    <Label className="dark:text-white">Assign</Label>
                    {row.original.assign ? (
                      <Check className="text-green-800" />
                    ) : (
                      <X className="text-red-700" />
                    )}
                  </div>
                  <div className="flex justify-between items-center px-3 py-1 rounded-md hover:bg-accent">
                    <Label className="dark:text-white">Approve</Label>
                    {row.original.approve ? (
                      <Check className="text-green-800" />
                    ) : (
                      <X className="text-red-700" />
                    )}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        );
      }
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Created" />;
    },
    cell: ({ row }) => {
      const date = String(row.getValue("created_at"));
      if (row.original.created_at === null) {
        return <span></span>;
      } else {
        const dateFormat = format(new Date(date), "do-MMM ");
        return (
          <Label className="text-[13px] tracking-wide dark:text-gray-300">
            {dateFormat}
          </Label>
        );
      }
    },
  },
  {
    accessorKey: "actions",
    header: () => {
      return <span className="pl-4 text-xs">Actions</span>;
    },
    cell: ({ row }) => {
      if (row.original.created_at === null) {
        return <span></span>;
      } else {
        return (
          <div className="w-full">
            <Button variant="ghost">
              <Pencil />
            </Button>

            <Button variant="ghost">
              <Trash color="red" />
            </Button>
          </div>
        );
      }
    },
  },
];
