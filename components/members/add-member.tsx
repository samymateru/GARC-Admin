import { ReactNode, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FormError } from "@/components/shared/form-error";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { Response } from "../roles/roles-details";
import { useRouter } from "next/navigation";
import { showToast } from "../shared/toast";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AddMemberProps {
  children?: ReactNode;
}

export type Member = {
  name?: string;
  email?: string;
  type?: string;
  status?: string;
  created_at: Date;
};

type MemberResponse = {
  detail?: string;
  status_code?: number;
  payload?: Member[];
};

interface RoleElement {
  value?: string;
  label?: string;
}

const MemberSchema = z.object({
  name: z.string().min(1, "Company name cannot be empty"),
  email: z.string().email({ message: "Provide valid email" }),
  role_id: z.array(z.number()).min(1, "At least one role ID must be provided"),
});
export default function AddMember({ children }: AddMemberProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const [roles, setRole] = useState<RoleElement[]>([]);
  const { data, isLoading } = useQuery({
    queryKey: ["fetch-roles"],
    queryFn: async (): Promise<Response> => {
      const response = await fetch(`${BASE_URL}/roles/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch roles: ${response.statusText}`);
      }
      return await response.json();
    },
    refetchOnMount: false,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
  const {
    control,
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<z.infer<typeof MemberSchema>>({
    resolver: zodResolver(MemberSchema),
  });
  useEffect(() => {
    if (!isLoading) {
      if (data?.status_code === 200) {
        setRole(
          data.payload.map(({ id, name }) => ({
            value: id?.toString() || "",
            label: name || "",
          }))
        );
      }
      if (data?.status_code === 201) {
        setRole([]);
      }
      if (data?.status_code === 404) {
        router.push("/admin-signin");
      }
    }
  }, [data, isLoading, router]);

  const { mutate } = useMutation({
    mutationKey: ["add-member"],
    mutationFn: async (
      data: z.infer<typeof MemberSchema>
    ): Promise<MemberResponse> => {
      const response = await fetch(`${BASE_URL}/users/new_user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            typeof window === "undefined" ? "" : localStorage.getItem("token")
          }`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Registration failed");
      }
      return response.json();
    },
  });
  const onSubmit: SubmitHandler<z.infer<typeof MemberSchema>> = async (
    data
  ) => {
    console.log(data);
    mutate(data, {
      onSuccess: (data) => {
        reset();
        setOpen(false);
        if (data.status_code === 501) {
          showToast(data.detail, "success");
          queryClient.invalidateQueries({ queryKey: ["fetch-members"] });
        } else if (data.status_code === 404) {
          router.push("/admin-signin");
          showToast(data.detail, "error");
        } else if (data.status_code === 401) {
          showToast(data.detail, "error");
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
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-[40px] h-[40px] flex justify-center items-center">
          {children}
        </DialogTrigger>
        <DialogContent className="bg-white dark:bg-background">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-1">
                <Label>Member Name</Label>
                <div className="relative">
                  <Input
                    className="peer pe-9"
                    placeholder="i.e Samuel Alfred"
                    {...register("name")}
                  />
                  <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
                    <User size={16} strokeWidth={2} aria-hidden="true" />
                  </div>
                </div>
                <FormError error={errors.name} />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <div className="relative">
                  <Input
                    className="peer pe-9"
                    placeholder="i.e example@email.com"
                    {...register("email")}
                  />
                  <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
                    <Mail size={16} strokeWidth={2} aria-hidden="true" />
                  </div>
                </div>
                <FormError error={errors.name} />
              </div>

              <div className="space-y-1">
                <Label>Roles</Label>
                <Controller
                  name="role_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={
                        field.value && field.value.length > 0
                          ? field.value[0].toString()
                          : ""
                      }
                      onValueChange={(value) =>
                        field.onChange([parseInt(value, 10)])
                      }>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="p-2">
                        {roles.length > 0 ? (
                          roles.map((item: RoleElement) => (
                            <SelectItem
                              key={item.value}
                              value={item.value || ""}
                              className="dark:hover:bg-accent cursor-pointer">
                              {item.label || ""}
                            </SelectItem>
                          ))
                        ) : (
                          <span className="text-base pl-10">
                            No roles availble
                          </span>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormError error={errors.role_id} />
              </div>

              <div className="flex justify-end items-center gap-2">
                <Button
                  type="button"
                  className="font-semibold tracking-tight w-[100px] hover:bg-zinc-900 hover:text-white"
                  variant="ghost"
                  onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="font-semibold tracking-tight w-[100px] hover:bg-zinc-900 hover:text-white"
                  variant="ghost">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
