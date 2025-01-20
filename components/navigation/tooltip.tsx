import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";
import { Label } from "../ui/label";

interface ToolTipProps {
  children: ReactNode;
  message: string;
  side: "top" | "left" | "right" | "bottom";
}
export default function AdminNavToolTip({
  children,
  message,
  side,
}: ToolTipProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className="bg-zinc-900 text-zinc-300 dark:bg-white dark:text-black px-3 py-1 w-[150px]"
          side={side}>
          <Label className=" font-mono font-bold text-base">{message}</Label>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
