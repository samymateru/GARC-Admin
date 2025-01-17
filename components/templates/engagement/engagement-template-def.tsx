"use client";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Ellipsis, Check, X, EllipsisIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EngagementTemplate } from "./engagement-details";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DataTableColumnHeader } from "@/components/shared/custom-header";

export const EngagementTemplateColumns: ColumnDef<EngagementTemplate>[] = [
  {
    accessorKey: "id",
    header: () => {
      return <span className="text-xs">S/N</span>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
    cell: ({ row }) => {
      if (row.original.name) {
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
    accessorKey: "phases",
    header: () => {
      return <span className="text-xs">Phase</span>;
    },
    cell: ({ row }) => {
      const [open, setOpen] = useState<boolean>(false);
      if (row.original.phases === null) {
        return <span></span>;
      } else {
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="ml-7">
              <EllipsisIcon />
            </PopoverTrigger>
            <PopoverContent className="min-w-[250px]">
              <Button
                onClick={() => setOpen(false)}
                className="absolute top-2 right-2 p-0 m-0 h-[24px] rounded-full w-[24px]"
                variant="ghost">
                <X size={18} />
              </Button>
              <div>
                <Label className="font-bold tracking-tight scroll-m-0 text-2xl">
                  Phases
                </Label>
                <Separator />
              </div>
              <ScrollArea className=" h-[150px]">
                <div className="pt-3 flex flex-col w-fit">
                  {row.original.phases.map((item, index) => (
                    <Label
                      key={index}
                      className="font-semibold tracking-normal font-sans text-base">
                      <strong>{index + 1}.</strong>
                      {item}
                    </Label>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        );
      }
    },
  },
  {
    accessorKey: "actions",
    header: () => {
      return <span className="text-xs">Actions</span>;
    },
    cell: ({ row }) => {
      const [open, setOpen] = useState<boolean>(false);
      if (row.original.actions === null) {
        return <span></span>;
      } else {
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="ml-8">
              <EllipsisIcon />
            </PopoverTrigger>
            <PopoverContent className="min-w-[250px]">
              <Button
                onClick={() => setOpen(false)}
                className="absolute top-2 right-2 p-0 m-0 h-[24px] rounded-full w-[24px]"
                variant="ghost">
                <X size={18} />
              </Button>
              <div>
                <Label className="font-bold tracking-tight scroll-m-0 text-2xl">
                  Actions
                </Label>
                <Separator />
              </div>
              <ScrollArea className=" h-[150px]">
                <div className="pt-3 flex flex-col w-fit">
                  {row.original.actions.map((item, index) => (
                    <Label
                      key={index}
                      className="font-semibold tracking-normal font-sans text-base">
                      <strong>{index + 1}.</strong>
                      {item}
                    </Label>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        );
      }
    },
  },
  {
    accessorKey: "procedures",
    header: () => {
      return <span className="text-xs">Procedures</span>;
    },
    cell: ({ row }) => {
      const [open, setOpen] = useState<boolean>(false);
      if (row.original.procedures === null) {
        return <span></span>;
      } else {
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="ml-11">
              <EllipsisIcon />
            </PopoverTrigger>
            <PopoverContent className="min-w-[250px]">
              <Button
                onClick={() => setOpen(false)}
                className="absolute top-2 right-2 p-0 m-0 h-[24px] rounded-full w-[24px]"
                variant="ghost">
                <X size={18} />
              </Button>
              <div>
                <Label className="font-bold tracking-tight scroll-m-0 text-2xl">
                  Procedures
                </Label>
                <Separator />
              </div>
              <ScrollArea className=" h-[150px]">
                <div className="pt-3 flex flex-col w-fit">
                  {row.original.procedures.map((item, index) => (
                    <Label
                      key={index}
                      className="font-semibold tracking-normal font-serif text-base">
                      <strong>{index + 1}.</strong>
                      {item}
                    </Label>
                  ))}
                </div>
              </ScrollArea>
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
    accessorKey: "category",
    header: () => {
      return <span className="text-xs">Category</span>;
    },
    cell: ({ row }) => {
      if (row.original.category === null) {
        return <span></span>;
      } else {
        return (
          <Label className="text-[13px] tracking-wide dark:text-gray-300">
            {row.original.category}
          </Label>
        );
      }
    },
  },
];
