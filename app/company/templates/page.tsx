import TemplatesDetails from "@/components/templates/template-details";
import "../../../app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";
export default function TemplatesPage() {
  return (
    <>
      <Separator className="bg-neutral-400" />
      <div className="h-full p-0">
        <TemplatesDetails />
      </div>
      <Toaster position="top-left" />
    </>
  );
}
