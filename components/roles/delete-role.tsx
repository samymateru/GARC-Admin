import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { Label } from "../ui/label";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../shared/toast";
import { useRouter } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface DeleteRoleProps {
  role_id: number;
}

type DeleteRoleRequest = {
  role_id: number;
};

type DeleteRoleResponse = {
  detail?: string;
  status_code?: number;
};

export const DeleteRole = ({ role_id }: DeleteRoleProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-role"],
    mutationFn: async (
      data: DeleteRoleRequest
    ): Promise<DeleteRoleResponse> => {
      const response = await fetch(`${BASE_URL}/roles/delete_role/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to delete");
      }
      return await response.json();
    },
  });
  const onDelete = () => {
    mutate(
      { role_id: role_id },
      {
        onSuccess: (data) => {
          console.log(data);
          setOpen(false);
          if (data.status_code === 503) {
            queryClient.invalidateQueries({ queryKey: ["fetch-roles"] });
            showToast(data.detail, "success");
          } else if (data.status_code === 404) {
            router.push("/admin-signin");
            showToast(data.detail, "error");
          } else {
            showToast(data.detail, "error");
          }
        },
        onError: (error) => {
          showToast(error.message, "error");
        },
      }
    );
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div
          role="button"
          tabIndex={0}
          className="w-[35px] h-[30px] rounded-md hover:dark:bg-accent flex justify-center items-center">
          <Trash size={18} color="red" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">
            Are you absolutely sure?
          </DialogTitle>
          <DialogDescription>
            By deleting this{" "}
            <strong className="text-gray-300 underline underline-offset-1">
              Role
            </strong>{" "}
            you will remove all the permissions from users associated with this
            role
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 justify-end">
          <Button
            variant={"ghost"}
            onClick={() => setOpen(false)}
            disabled={isPending}>
            <Label className="text-[14px] font-serif cursor-pointer">
              Cancel
            </Label>
          </Button>
          <Button variant={"ghost"} onClick={onDelete}>
            <Label className="text-[14px] font-serif cursor-pointer">
              Confirm
            </Label>
            <Trash size={16} color="red" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
