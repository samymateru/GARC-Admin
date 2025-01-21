"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";
import { ADMIN_PATH } from "@/lib/constants";

export const SessionExpired = () => {
  const router = useRouter();
  const goToSignin = () => {
    router.push(ADMIN_PATH);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger>Open</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-serif">
            Session Expired
          </AlertDialogTitle>
          <AlertDialogDescription>
            Please login to get new session and continue with your work.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant={"ghost"} onClick={goToSignin}>
            <LogIn size={16} />
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
