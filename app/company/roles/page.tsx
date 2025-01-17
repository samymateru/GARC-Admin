import Roles from "@/components/roles/roles-details";
import "../../../app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";
export default function RolesPage() {
  return (
    <>
      <Separator className="bg-neutral-400" />
      <div className="h-full mx-3">
        <Roles />
      </div>
      <Toaster position="top-left" />
    </>
  );
}
