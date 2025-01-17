"use client";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Member } from "./members-details";
import { Trash, Pencil } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { DataTableColumnHeader } from "../shared/custom-header";
import { Span } from "next/dist/trace";
import { DeleteMember } from "./delete-member";
import { UpdateMember } from "./update-member";

export const MembersColumns: ColumnDef<Member>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader className="ml-1" column={column} title="S/N" />
      );
    },
    cell: ({ row }) => {
      if (row.original.id === null) {
        return <span></span>;
      } else {
        return (
          <Label className="text-[13px] tracking-wide dark:text-gray-300">
            {row.original.id}
          </Label>
        );
      }
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
          <label className="text-[13px] tracking-wide dark:text-gray-300">
            {row.original.name}
          </label>
        );
      }
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Email" />;
    },
    cell: ({ row }) => {
      if (row.original.email === null) {
        return <span></span>;
      } else {
        return (
          <Label className="text-[13px] tracking-wide dark:text-gray-300">
            {row.original.email}
          </Label>
        );
      }
    },
  },
  {
    accessorKey: "type",
    header: () => {
      return <span className="text-xs">Type</span>;
    },
    cell: ({ row }) => {
      if (row.original.type === null) {
        return <span></span>;
      } else {
        return (
          <Label className="text-[13px] tracking-wide dark:text-gray-300">
            {row.original.type}
          </Label>
        );
      }
    },
  },
  {
    accessorKey: "telephone",
    header: () => {
      return <span className="text-xs">Telephone</span>;
    },
    cell: ({ row }) => {
      if (row.original.telephone === null) {
        return <span></span>;
      } else {
        return (
          <Label className="text-[13px] tracking-wide dark:text-gray-300">
            {row.original.telephone}
          </Label>
        );
      }
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Role" />;
    },
    cell: ({ row }) => {
      if (row.original.role === null) {
        return <span></span>;
      } else {
        return (
          <Label className="text-[13px] tracking-wide dark:text-gray-300">
            {row.original.role}
          </Label>
        );
      }
    },
  },
  {
    accessorKey: "status",
    header: () => {
      return <span className="text-xs">Status</span>;
    },
    cell: ({ row }) => {
      if (row.original.status === null) {
        return <span></span>;
      } else {
        return row.original.status === true ? (
          <Label className="dark:text-green-800 text-green-900 text-[13px]">
            Active
          </Label>
        ) : (
          <Label className="text-red-600 text-[13px]">Inactive</Label>
        );
      }
    },
  },
  {
    accessorKey: "created_at",
    header: () => {
      return <span className="text-xs">Created</span>;
    },
    cell: ({ row }) => {
      if (row.original.created_at === null) {
        return <span></span>;
      } else {
        const date = format(
          new Date(String(row.original.created_at)),
          "do-MMM yy "
        );
        return (
          <Label className="text-[13px] tracking-wide dark:text-gray-300">
            {date}
          </Label>
        );
      }
    },
  },
  {
    accessorKey: "actions",
    header: () => {
      return <span className="text-xs pl-4">Actions</span>;
    },
    cell: ({ row }) => {
      if (row.original.created_at === null) {
        return <span></span>;
      } else {
        return (
          <div className="w-full flex gap-2">
            {row.original.type !== "admin" ? (
              <UpdateMember id={String(row.original.id)} />
            ) : (
              <span></span>
            )}
            {row.original.type !== "admin" ? (
              <DeleteMember id={String(row.original.id)} />
            ) : (
              <span></span>
            )}
          </div>
        );
      }
    },
  },
];
