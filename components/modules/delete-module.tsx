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
import { useState } from "react";
import { Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../shared/toast";
import { useRouter } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface DeleteModuleProps {
  id?: string;
}

export const DeleteModule = ({ id }: DeleteModuleProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ["delete-module"],
    mutationFn: async (data: unknown) => {
      const response = await fetch(`${BASE_URL}/modules/delete_module/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update plan");
      }
      return await response.json();
    },
  });

  const handleDelete = () => {
    mutate(
      { id: id },
      {
        onSuccess: (data) => {
          if (data.status_code === 503) {
            showToast(data.detail, "success");
            queryClient.invalidateQueries({ queryKey: ["fetch-modules"] });
          }
          if (data.status_code === 404) {
            showToast(data.detail, "error");
            router.push("/admin-signin");
          }
        },
        onError: (error) => {
          showToast(error.message, "error");
        },
      }
    );
  };
  const [moduleDelete, setModuleDelete] = useState<boolean>(false);
  return (
    <AlertDialog open={moduleDelete} onOpenChange={setModuleDelete}>
      <AlertDialogTrigger role="presentation">
        <div className="h-[30px] w-[35px] dark:bg-accent flex items-center justify-center rounded-md">
          <Trash color="red" size={17} />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl tracking-wide">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            module please be sure on what your doing
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
