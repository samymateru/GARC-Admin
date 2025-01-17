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
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useId, useRef, useState } from "react";
import { showToast } from "../shared/toast";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface UpdateMemberProps {
  id?: string;
}

export const UpdateMember = ({ id }: UpdateMemberProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const telephonRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string>("");
  const [type, settype] = useState<string>("");
  const { mutate } = useMutation({
    mutationKey: ["update-member"],
    mutationFn: async (data: any) => {
      const response = await fetch(`${BASE_URL}/users/update_user`, {
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
  const [open, setOpen] = useState<boolean>(false);
  const handleUpdate = () => {
    mutate(
      {
        id: id,
        name: nameRef.current?.value === "" ? null : nameRef.current?.value,
        telephone:
          telephonRef.current?.value === "" ? null : telephonRef.current?.value,
        email: emailRef.current?.value === "" ? null : emailRef.current?.value,
        status: status === "" ? null : status,
        type: type === "" ? null : type,
      },
      {
        onSuccess: (data) => {
          if (data.status_code === 502) {
            showToast(data.detail, "success");
            queryClient.invalidateQueries({ queryKey: ["fetch-members"] });
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
      <SheetContent className="flex flex-col gap-5 bg-white dark:bg-background">
        <SheetHeader>
          <SheetTitle className="font-serif tracking-wide text-2xl">
            Updating Member
          </SheetTitle>
          <SheetDescription />
        </SheetHeader>
        <section className=" flex flex-col gap-2">
          <div>
            <Label>Name</Label>
            <Input ref={nameRef} placeholder="Member Name" />
          </div>
          <div>
            <Label>Email</Label>
            <Input ref={emailRef} placeholder="Member Name" />
          </div>
          <div>
            <Label>Telephone</Label>
            <Input ref={telephonRef} placeholder="Member Name" />
          </div>
          <div className="">
            <Label htmlFor={id}>Status</Label>
            <Select
              value={status}
              required
              onValueChange={(status) => setStatus(status)}>
              <SelectTrigger id={id}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="">
            <Label htmlFor={id}>Type</Label>
            <Select value={type} onValueChange={(type) => settype(type)}>
              <SelectTrigger id={id}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="">
            <Label htmlFor={id}>Roles</Label>
            <Select defaultValue="true" required>
              <SelectTrigger id={id}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Admin</SelectItem>
                <SelectItem value="false">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button onClick={handleUpdate}>Update</Button>
          </div>
        </section>
      </SheetContent>
    </Sheet>
  );
};
