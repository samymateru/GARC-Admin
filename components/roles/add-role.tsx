"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import { CircleArrowRight, CircleArrowLeft, X, Send } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "../shared/form-error";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../shared/toast";
import { useRouter } from "next/navigation";
import AdminNavToolTip from "../navigation/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface AddRoleProps {
  children?: ReactNode;
}

type RoleResponse = {
  detail?: string;
  status_code?: number;
};

const RoleSchema = z.object({
  name: z.string().min(1, "Role name cannot be empty"),
  category: z.enum(["Module", "AnnualPlan", "Engagement"], {
    required_error: "Choose Category",
  }),
  description: z.string().min(1, "Description cannot be empty"),
});

export const AddRole = ({ children }: AddRoleProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [roleTab, setRoleTab] = useState<string>("role");
  const [open, setOpen] = useState<boolean>(false);
  const [write, setWrite] = useState<boolean>(false);
  const [read, setRead] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [assign, setassign] = useState<boolean>(false);
  const [approve, setApprove] = useState<boolean>(false);
  const [role, setRole] = useState<z.infer<typeof RoleSchema>>();
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { mutate } = useMutation({
    mutationKey: ["add-role"],
    mutationFn: async (data: unknown): Promise<RoleResponse> => {
      const response = await fetch(`${BASE_URL}/roles/new_role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("faild to add role");
      }
      return await response.json();
    },
  });
  const {
    reset,
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<z.infer<typeof RoleSchema>>({
    resolver: zodResolver(RoleSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof RoleSchema>> = async (data) => {
    setRoleTab("permission");
    setRole(data);
  };

  function Submit() {
    const data = {
      name: role?.name,
      description: role?.description,
      category: role?.category,
      write: write,
      read: read,
      delete: deleting,
      assign: assign,
      approve: approve,
      edit: edit,
    };
    mutate(data, {
      onSuccess: (data) => {
        if (data.status_code === 501) {
          showToast(data.detail, "success");
          queryClient.invalidateQueries({ queryKey: ["fetch-roles"] });
          setOpen(false);
          reset();
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
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="dark:bg-background bg-transparent text-white hover:bg-transparent w-10 h-10 flex items-center justify-center">
        {children}
      </DialogTrigger>
      <DialogContent className="gap-0">
        <DialogHeader className="p-0">
          <DialogTitle className="font-bold tracking-tight scroll-m-0 text-3xl py-0 font-serif">
            {roleTab === "role" ? "New Role" : "Permissions"}
          </DialogTitle>
          <DialogDescription className="p-0 m-0" />
        </DialogHeader>
        <Tabs className="" value={roleTab}>
          <TabsContent value="role" className="space-y-1">
            <form action="" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-1">
                <Label className="dark:text-neutral-300 tracking-wide">
                  Role Name
                </Label>
                <div className="relative">
                  <Input
                    className="peer pe-9"
                    placeholder="Auditor"
                    {...register("name")}
                  />
                  <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50"></div>
                </div>
                <FormError error={errors.name} />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="select-23"
                  className="dark:text-neutral-300 tracking-wide">
                  Category
                </Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <SelectTrigger
                        id="select-23"
                        className="dark:text-neutral-300">
                        <SelectValue
                          placeholder="Select Category"
                          className=""
                        />
                      </SelectTrigger>
                      <SelectContent className="w-[462px]">
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
                  )}
                />
              </div>
              <FormError error={errors.category} />
              <div className="space-y-1">
                <Label className="dark:text-neutral-300 tracking-wide">
                  Description
                </Label>
                <Textarea
                  {...register("description")}
                  className="max-h-[150px] dark:text-neutral-300 font-mono text-[14px]"
                />
                <FormError error={errors.description} />
              </div>
              <div className="flex justify-end mt-3 mb-2 gap-2">
                <Button
                  type="button"
                  onClick={() => setOpen(false)}
                  variant="ghost">
                  <X />
                  <Label className="font-mono cursor-pointer">Cancel</Label>
                </Button>
                <Button
                  type="submit"
                  variant="ghost"
                  className="cursor-pointer">
                  <Label className="font-mono cursor-pointer">Continue</Label>
                  <CircleArrowRight />
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="permission" className="">
            <div>
              <AdminNavToolTip message="Back" side="left">
                <div>
                  <Button
                    variant="ghost"
                    className="mb-4 flex items-center justify-center"
                    onClick={() => {
                      setRoleTab("role");
                    }}>
                    <CircleArrowLeft size={18} strokeWidth={3} />
                  </Button>
                </div>
              </AdminNavToolTip>
              <div className="flex flex-col gap-4 ml-5">
                <div className="flex items-center gap-2">
                  <Switch id="write" onCheckedChange={(e) => setWrite(e)} />
                  <Label
                    htmlFor="write"
                    className="cursor-pointer font-serif text-[13px]">
                    Create
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="edit" onCheckedChange={(e) => setEdit(e)} />
                  <Label
                    htmlFor="edit"
                    className="cursor-pointer font-serif text-[13px]">
                    Edit
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="read" onCheckedChange={(e) => setRead(e)} />
                  <Label
                    htmlFor="read"
                    className="cursor-pointer font-serif text-[13px]">
                    Read
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="delete" onCheckedChange={(e) => setDeleting(e)} />
                  <Label
                    htmlFor="delete"
                    className="cursor-pointer font-serif text-[13px]">
                    Delete
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="assign" onCheckedChange={(e) => setassign(e)} />
                  <Label
                    htmlFor="assign"
                    className="cursor-pointer font-serif text-[13px]">
                    Assign
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="approve" onCheckedChange={(e) => setApprove(e)} />
                  <Label
                    htmlFor="approve"
                    className="cursor-pointer font-serif text-[13px]">
                    Approve
                  </Label>
                </div>
              </div>
              <div className="mt-3 flex justify-end mr-6">
                <Button
                  type="button"
                  onClick={() => setOpen(false)}
                  variant="ghost">
                  <X />
                  <Label className="font-mono cursor-pointer">Cancel</Label>
                </Button>
                <Button variant="ghost" onClick={Submit}>
                  <Label className="font-mono cursor-pointer">Confirm</Label>
                  <Send />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
