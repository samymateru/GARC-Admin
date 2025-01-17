import MemberDetails from "@/components/members/members-details";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
export default function MemberPage() {
  return (
    <>
      <Separator className="bg-neutral-400" />
      <div className="h-full mx-3">
        <MemberDetails />
      </div>
      <Toaster position="top-left" />
    </>
  );
}
