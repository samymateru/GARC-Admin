"use client";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Module } from "./module";
import { Trash, Pencil } from "lucide-react";
import { DataTableColumnHeader } from "../shared/custom-header";

import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { DeleteModule } from "./delete-module";
import { useState } from "react";
import { UpdateModule } from "./update-module";

export const ModuleColumns: ColumnDef<Module>[] = [
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
          <Label className="text-[14px] tracking-wide dark:text-gray-300 ml-2">
            {row.original.id}
          </Label>
        );
      }
    },
  },
  {
    accessorKey: "name",
    header: () => {
      return <span className="text-xs">Name</span>;
    },
    cell: ({ row }) => {
      if (row.original.name === null) {
        return <span></span>;
      } else {
        return (
          <Label className="text-[14px] tracking-wide dark:text-gray-300">
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
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          className="ml-1"
          column={column}
          title="Status"
        />
      );
    },
    cell: ({ row }) => {
      if (row.original.status === null) {
        return <span></span>;
      } else {
        if (JSON.parse(row.original.status) === true) {
          return (
            <Label className="font-semibold text-green-800 dark:text-green-700">
              Active
            </Label>
          );
        } else {
          return <Label className="font-semibold text-red-600">Inactive</Label>;
        }
      }
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          className="ml-1"
          column={column}
          title="Created"
        />
      );
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
      return <span className="text-xs pl-5">Actions</span>;
    },
    cell: ({ row }) => {
      if (row.original.created_at === null) {
        return <span></span>;
      } else {
        return (
          <div className="w-full flex gap-2">
            <UpdateModule id={String(row.original.id)} />
            <DeleteModule id={String(row.original.id)} />
          </div>
        );
      }
    },
  },
];
