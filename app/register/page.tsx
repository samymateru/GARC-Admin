"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import "../../app/globals.css";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Mail, AtSign, User, Factory, Phone, Eye, EyeOff } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormError } from "@/components/shared/form-error";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/shared/toast";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const RegisterSchema = z.object({
  name: z.string().min(1, "Company name cannot be empty"),
  owner: z.string().min(1, "Provide owner name"),
  telephone: z.string().min(1, { message: "Provide company phone" }),
  email: z.string().email({ message: "Provide valid email" }),
  password: z.string().min(1, { message: "Password field can't be empty" }),
  website: z.string().optional(),
  description: z.string().min(1, { message: "Description cannot be empty" }),
});

type RegisterResponse = {
  detail?: string;
  status_code?: number;
};

export default function RegisterCompany() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);
  const { mutate } = useMutation({
    mutationKey: ["register-company"],
    mutationFn: async (
      data: z.infer<typeof RegisterSchema>
    ): Promise<RegisterResponse> => {
      const response = await fetch(`${BASE_URL}/companies/new_company`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Registration failed");
      }
      return response.json();
    },
  });
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
  });
  const onSubmit: SubmitHandler<z.infer<typeof RegisterSchema>> = async (
    data
  ) => {
    mutate(data, {
      onSuccess: (data) => {
        console.log(data);
        if (data.status_code === 201) {
          reset();
          router.push("/admin-signin");
          showToast(data.detail, "success");
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
    <>
      <ScrollArea className="h-[550px]">
        <Card className="h-full rounded-none border-none">
          <CardHeader>
            <CardTitle className="text-center">
              <Label className="font-extrabold text-[27px] tracking-tight scroll-m-0">
                Create Company
              </Label>
            </CardTitle>
            <CardDescription />
          </CardHeader>
          <CardContent className="flex justify-center">
            <form
              action=""
              className="flex flex-col"
              onSubmit={handleSubmit(onSubmit)}>
              <div className="flex gap-3 flex-col md:flex-row">
                <div className="w-[350px] md:w-[300px] mb-1">
                  <Label className="font-bold text-zinc-800 dark:text-zinc-300">
                    Company Name
                  </Label>
                  <div className="relative">
                    <Input
                      className="peer pe-9"
                      placeholder="Capstone Auditiors Ltd"
                      {...register("name")}
                    />
                    <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
                      <Factory size={16} strokeWidth={2} aria-hidden="true" />
                    </div>
                  </div>
                  <FormError error={errors.name} />
                </div>
                <div className="w-[350px] md:w-[300px]">
                  <Label className="font-bold text-zinc-800 dark:text-zinc-300">
                    Owner Name
                  </Label>
                  <div className="relative">
                    <Input
                      className="peer pe-9"
                      placeholder="Samuel Materu"
                      {...register("owner")}
                    />
                    <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
                      <User size={16} strokeWidth={2} aria-hidden="true" />
                    </div>
                  </div>
                  <FormError error={errors.owner} />
                </div>
              </div>
              <div className="flex gap-3 flex-col md:flex-row mb-1">
                <div className="w-[350px] md:w-[300px]">
                  <Label className="font-bold text-zinc-800 dark:text-zinc-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Input
                      className="peer pe-9"
                      placeholder="example@gmail.com"
                      {...register("email")}
                    />
                    <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
                      <Mail size={16} strokeWidth={2} aria-hidden="true" />
                    </div>
                  </div>
                  <FormError error={errors.email} />
                </div>
                <div className="w-[350px] md:w-[300px]">
                  <Label className="font-bold text-zinc-800 dark:text-zinc-300">
                    Website
                  </Label>
                  <div className="relative">
                    <Input
                      className="peer pe-9"
                      placeholder="Website URL"
                      {...register("website")}
                    />
                    <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
                      <AtSign size={16} strokeWidth={2} aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 flex-col md:flex-row mb-1">
                <div className="w-[350px] md:w-[300px]">
                  <Label className="font-bold text-zinc-800 dark:text-zinc-300">
                    Telephone
                  </Label>
                  <div className="relative">
                    <Input
                      className="peer pe-9"
                      placeholder="+255 78787878"
                      {...register("telephone")}
                    />
                    <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
                      <Phone size={16} strokeWidth={2} aria-hidden="true" />
                    </div>
                  </div>
                  <FormError error={errors.telephone} />
                </div>
                <div className="w-[350px] md:w-[300px]">
                  <Label className="font-bold text-zinc-800 dark:text-zinc-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      className="peer pe-9"
                      placeholder="Strong password"
                      type={isVisible ? "text" : "password"}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      className=" absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50"
                      onClick={toggleVisibility}
                      aria-label={isVisible ? "Hide password" : "Show password"}
                      aria-pressed={isVisible}
                      aria-controls="password">
                      {isVisible ? (
                        <EyeOff
                          size={16}
                          strokeWidth={2}
                          aria-hidden="true"
                          className="color-white"
                        />
                      ) : (
                        <Eye size={16} strokeWidth={2} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  <FormError error={errors.password} />
                </div>
              </div>
              <div className="">
                <Label className="font-bold text-zinc-800 dark:text-zinc-300">
                  Company Description
                </Label>
                <Textarea
                  {...register("description")}
                  placeholder="Provide clear description"
                />
                <FormError error={errors.description} />
              </div>
              <div className="w-full pt-2">
                <Button className="w-full text-xl tracking-tight scroll-m-0 font-bold">
                  Create
                </Button>
                <div className="flex justify-center gap-1 mt-2">
                  <span>have an account?</span>
                  <Link href="/admin-signin">
                    <strong>sign in</strong>
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </ScrollArea>
      <Toaster position="top-left" />
    </>
  );
}
