import { SignIn } from "@/components/admin-signin/signin-form";
import "../../app/globals.css";
import { Toaster } from "sonner";
export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignIn />
      </div>
      <Toaster position="top-left" />
    </div>
  );
}
