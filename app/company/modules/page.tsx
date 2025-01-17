import ModuleDetails from "@/components/modules/module";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
export default function ModulePage() {
  return (
    <>
      <Separator className="bg-neutral-400" />
      <div className="h-full mx-3">
        <ModuleDetails />
      </div>
      <Toaster position="top-left" />
    </>
  );
}
