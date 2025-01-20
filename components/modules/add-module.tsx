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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { showToast } from "../shared/toast";
import { z } from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Package, Plus, X } from "lucide-react";
import { FormError } from "../shared/form-error";
import { Textarea } from "../ui/textarea";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AddModuleProps {
  children?: ReactNode;
}

export type Module = {
  name?: string;
  description?: string;
  created_at?: Date;
};

type Response = {
  detail?: string;
  payload?: Module[];
  status_code?: number;
};

const ModuleSchema = z.object({
  name: z.enum(["Internal", "External", "Compliance", "Fraud", "Risk"], {
    required_error: "Choose Module",
  }),
  description: z.string().min(1, { message: "Description cannot be empty" }),
});

export const AddModule = ({ children }: AddModuleProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate } = useMutation({
    mutationKey: ["add-module"],
    mutationFn: async (
      data: z.infer<typeof ModuleSchema>
    ): Promise<Response> => {
      const response = await fetch(`${BASE_URL}/modules/new_module`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed creating new module");
      }
      return await response.json();
    },
  });
  const {
    control,
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<z.infer<typeof ModuleSchema>>({
    resolver: zodResolver(ModuleSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof ModuleSchema>> = async (
    data
  ) => {
    mutate(data, {
      onSuccess: (data) => {
        if (data.status_code === 501) {
          queryClient.invalidateQueries({ queryKey: ["fetch-modules"] });
          setOpen(false);
          showToast(data.detail, "success");
          reset();
        } else if (data.status_code === 404) {
          showToast(data.detail, "error");
          router.push("/login");
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-[40px] h-[40px] flex justify-center items-center">
        {children}
      </DialogTrigger>
      <DialogDescription></DialogDescription>
      <DialogContent className="pb-16 bg-white dark:bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
                aria-hidden="true">
                <Package size={20} className="opacity-100" strokeWidth={2} />
              </div>
            </div>
            <Label className="font-bold tracking-tight scroll-m-0 text-2xl">
              New Module
            </Label>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Button
          className="absolute top-2 right-2 rounded-full w-9 h-9"
          variant="ghost"
          onClick={() => setOpen(false)}>
          <X size={18} />
        </Button>

        <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <Label htmlFor="select-23" className="font-semibold">
              Module<span className="text-destructive">*</span>
            </Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <SelectTrigger id="select-23">
                    <SelectValue placeholder="Select Module" />
                  </SelectTrigger>
                  <SelectContent className="p-3">
                    <SelectItem
                      value="Internal"
                      className="cursor-pointer hover:bg-accent py-2 font-semibold">
                      Intenal
                    </SelectItem>
                    <SelectItem
                      value="Risk"
                      className="cursor-pointer hover:bg-accent py-2 font-semibold">
                      Risk
                    </SelectItem>
                    <SelectItem
                      value="Compliance"
                      className="cursor-pointer hover:bg-accent py-2 font-semibold">
                      Compliance
                    </SelectItem>
                    <SelectItem
                      value="Fraud"
                      className="cursor-pointer hover:bg-accent py-2 font-semibold">
                      Fraud
                    </SelectItem>
                    <SelectItem
                      value="External"
                      className="cursor-pointer hover:bg-accent py-2 font-semibold">
                      External
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <FormError error={errors.name} />
          <div>
            <Label>Decription</Label>
            <Textarea className="max-h-[150px]" {...register("description")} />
            <FormError error={errors.description} />
          </div>
          <div className="w-ful flex justify-center">
            <Button variant="secondary" className="flex w-full">
              <Plus size={18} strokeWidth={2} />
              <Label className="cursor-pointer">Add</Label>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
