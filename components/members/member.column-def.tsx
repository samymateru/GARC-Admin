"use client";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Member } from "./members-details";
import { Trash, Pencil, Ellipsis, Check, X, Plus } from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogContent,
} from "../ui/dialog";
import ClipLoader from "react-spinners/ClipLoader";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { DataTableColumnHeader } from "../shared/custom-header";
import { DeleteMember } from "./delete-member";
import { UpdateMember } from "./update-member";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import { AddRoleToMember } from "./add-role-to-member";
import AdminNavToolTip from "../navigation/tooltip";
import { RemoveRole } from "./remove-role";
import { useQuery } from "@tanstack/react-query";
import { Roles } from "../roles/roles-details";
import { useRouter } from "next/navigation";
import { showToast } from "../shared/toast";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
    accessorKey: "roles",
    header: ({ column }) => {
      return <span className="text-xs">Roles</span>;
    },
    cell: ({ row }) => {
      return (
        <UserRolesList
          user_id={row.original.id}
          user_name={row.original.name}
        />
      );
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

interface UserRolesListProps {
  user_id: number | null;
  user_name?: string | null;
}

type Response = {
  payload?: Roles[];
  status_code?: number;
  detail?: string;
};

const UserRolesList = ({ user_id, user_name }: UserRolesListProps) => {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const { data, isLoading, isError, isSuccess, refetch } = useQuery({
    queryKey: ["fetch-user-roles", currentUserId],
    queryFn: async (): Promise<Response> => {
      if (!currentUserId) {
        return Promise.reject("User ID is required");
      }
      const response = await fetch(`${BASE_URL}/roles/${currentUserId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            typeof window === "undefined" ? "" : localStorage.getItem("token")
          }`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user roles");
      }
      return await response.json();
    },
    enabled: !!currentUserId,
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
  const handleOpenChange = (isOpen: boolean, userId: number | null) => {
    setOpen(isOpen);
    if (isOpen) {
      setCurrentUserId(userId);
      refetch();
    }
  };

  if (isSuccess && data.status_code === 404) {
    showToast(data.detail, "error");
    router.push("/admin-signin");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => handleOpenChange(isOpen, user_id)}>
      <DialogTrigger>
        <Ellipsis />
      </DialogTrigger>
      <DialogContent>
        {isLoading ? (
          <>
            <Button
              onClick={() => setOpen(false)}
              variant={"ghost"}
              className="absolute top-2 right-2 w-[30px] h-[30px]">
              <X size={16} />
            </Button>
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif">
                {user_name}
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400 font-mono">
                Roles
              </DialogDescription>
            </DialogHeader>
            <ClipLoader
              className="bg-white"
              loading={isLoading}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </>
        ) : isError ? (
          <>
            <Button
              onClick={() => setOpen(false)}
              variant={"ghost"}
              className="absolute top-2 right-2 w-[30px] h-[30px]">
              <X size={16} />
            </Button>
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif">
                {user_name}
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400 font-mono">
                Roles
              </DialogDescription>
            </DialogHeader>
            <div>
              <Label className="text-[14px] text-red-600">Got an error</Label>
            </div>
          </>
        ) : isSuccess && data.status_code === 200 ? (
          <div>
            <Button
              onClick={() => setOpen(false)}
              variant={"ghost"}
              className="absolute top-2 right-2 w-[30px] h-[30px]">
              <X size={16} />
            </Button>
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif">
                {user_name}
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400 font-mono">
                Roles
              </DialogDescription>
            </DialogHeader>
            <div>
              {data.payload?.length !== 0 ? (
                data.payload?.map((item, index) => (
                  <div
                    key={index}
                    className="dark:hover:bg-accent flex justify-between items-center py-1 rounded-md pl-3 pr-2">
                    <Label className="text-[14px] font-mono">
                      <strong>{index + 1}.</strong>
                      {item.name}
                    </Label>
                    <RemoveRole
                      role_id={item.id}
                      role_name={item.name}
                      user_id={user_id}>
                      <div
                        className="dark:hover:bg-black w-[30px] h-[30px] flex justify-center items-center rounded-md"
                        tabIndex={0}
                        role="button">
                        <Trash size={16} color="red" />
                      </div>
                    </RemoveRole>
                  </div>
                ))
              ) : (
                <div>
                  <Label className="text-red-600 text-[14px] font-serif tracking-wide">
                    No roles assigned
                  </Label>
                </div>
              )}
            </div>
            <div>
              <AddRoleToMember user_id={user_id}>
                <AdminNavToolTip message="Add Role" side="left">
                  <div
                    role="button"
                    tabIndex={0}
                    className="cursor-pointer w-[30px] h-[30px] flex justify-center items-center hover:dark:bg-accent rounded-md">
                    <Plus size={16} />
                  </div>
                </AdminNavToolTip>
              </AddRoleToMember>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
