import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useRef, useState } from "react";
import { showToast } from "../shared/toast";
import { useRouter } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface UpdateModuleProps {
  id?: string;
}

export const UpdateModule = ({ id }: UpdateModuleProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const descriptionRef = useRef<HTMLInputElement>(null);
  const { mutate } = useMutation({
    mutationKey: ["update-module"],
    mutationFn: async (data: unknown) => {
      const response = await fetch(`${BASE_URL}/modules/update_module`, {
        method: "PUT",
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
  const [open, setOpen] = useState<boolean>(false);
  const handleUpdate = () => {
    mutate(
      {
        id: id,
        description:
          descriptionRef.current?.value === ""
            ? null
            : descriptionRef.current?.value,
      },
      {
        onSuccess: (data) => {
          if (data.status_code === 502) {
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
    setOpen(false);
  };
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <div className="h-[30px] w-[35px] dark:bg-accent flex items-center justify-center rounded-md">
          <Pencil size={17} />
        </div>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-5">
        <SheetHeader>
          <SheetTitle className="font-serif tracking-wide text-2xl">
            Updating Module
          </SheetTitle>
          <SheetDescription />
        </SheetHeader>
        <section className=" flex flex-col gap-2">
          <div>
            <Label>Description</Label>
            <Input ref={descriptionRef} placeholder="Description" />
          </div>
          <div>
            <Button onClick={handleUpdate}>Update</Button>
          </div>
        </section>
      </SheetContent>
    </Sheet>
  );
};
