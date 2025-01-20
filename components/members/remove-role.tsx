import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../shared/toast";
import { useRouter } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface RemoveRoleProps {
  children?: ReactNode;
  role_id?: number | null;
  role_name?: string | null;
  user_id?: number | null;
}

type Response = {
  detail?: string;
  status_code?: number;
};

export const RemoveRole = ({
  children,
  role_id,
  role_name,
  user_id,
}: RemoveRoleProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const { mutate } = useMutation({
    mutationKey: ["remove-role"],
    mutationFn: async (data: any): Promise<Response> => {
      const response = await fetch(`${BASE_URL}/users/remove_role`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to remove role");
      }
      return await response.json();
    },
  });

  const submit = () => {
    mutate(
      {
        role_id: role_id,
        user_id: user_id,
      },
      {
        onSuccess: (data) => {
          if (data.status_code === 503) {
            showToast(data.detail, "success");
            queryClient.invalidateQueries({ queryKey: ["fetch-user-roles"] });
            setOpen(false);
          } else if (data.status_code === 404) {
            showToast(data.detail, "error");
            router.push("/admin-signin");
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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif text-2xl">
            Remove Role
          </AlertDialogTitle>
          <AlertDialogDescription />
        </AlertDialogHeader>
        <Label>{role_name}</Label>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="ghost" onClick={submit}>
            Remove
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
