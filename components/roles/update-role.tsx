import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Pencil } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { showToast } from "../shared/toast";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type UpdateRoleRequest = {
  name?: string | null;
  category?: string | null;
  description?: string | null;
  id: number;
};

type UpdateRoleResponse = {
  detail?: string;
  status_code?: number;
};

interface UpdateRoleProps {
  id: number;
}

export const UpdateRole = ({ id }: UpdateRoleProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const { mutate } = useMutation({
    mutationKey: ["update-role"],
    mutationFn: async (
      data: UpdateRoleRequest
    ): Promise<UpdateRoleResponse> => {
      const response = await fetch(`${BASE_URL}/roles/update_role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      return await response.json();
    },
  });

  const handleUpdate = () => {
    setOpen(false);
    const updateData = {
      category: category === "" ? null : category,
      name: nameRef.current?.value === "" ? null : nameRef.current?.value,
      description:
        descriptionRef.current?.value === ""
          ? null
          : descriptionRef.current?.value,
      id: id,
    };
    mutate(updateData, {
      onSuccess: (data) => {
        if (data.status_code === 502) {
          queryClient.invalidateQueries({ queryKey: ["fetch-roles"] });
          showToast(data.detail, "success");
          setCategory("");
          if (nameRef.current) {
            nameRef.current.value = "";
          }
          if (descriptionRef.current) {
            descriptionRef.current.value = "";
          }
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
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <div
          role="button"
          tabIndex={0}
          className="w-[35px] h-[30px] rounded-md hover:dark:bg-accent flex items-center justify-center">
          <Pencil size={18} />
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl tracking-wide font-serif">
            Updating Role
          </SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="space-y-3 pt-4">
          <div className="space-y-1">
            <Label>Role name</Label>
            <Input ref={nameRef} />
          </div>
          <div className="space-y-1">
            <Label>Description</Label>
            <Input ref={descriptionRef} />
          </div>
          <div className="space-y-1">
            <Label>Category</Label>
            <Select onValueChange={(category) => setCategory(category)}>
              <SelectTrigger id="select-23" className="dark:text-neutral-300">
                <SelectValue placeholder="Select Category" className="" />
              </SelectTrigger>
              <SelectContent className="">
                <SelectItem
                  value="Module"
                  className="self-center cursor-pointer hover:bg-accent py-2 pl-3 font-semibold font-mono text-[14px] dark:text-neutral-300">
                  Modules
                </SelectItem>
                <SelectItem
                  value="AnnualPlan"
                  className="cursor-pointer hover:bg-accent py-2 pl-3 font-semibold font-mono text-[14px] dark:text-neutral-300">
                  Annual-Plans
                </SelectItem>
                <SelectItem
                  value="Engagement"
                  className="cursor-pointer hover:bg-accent py-2 pl-3 font-semibold font-mono text-[14px] dark:text-neutral-300">
                  Engagements
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleUpdate}>Update</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
