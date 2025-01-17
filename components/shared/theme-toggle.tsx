"use client";

import { Toggle } from "@/components/ui/toggle";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import clsx from "clsx";
import { ReactNode } from "react";

interface ToggleThemeProps {
  className?: string;
  children?: ReactNode;
}

export default function ToggleTheme({ className, children }: ToggleThemeProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={clsx(className)}>
      <Toggle
        variant="outline"
        className="group size-9 rounded-full w-[40px] h-[40px] bg-white data-[state=on]:bg-inherit border-none"
        pressed={theme === "dark"}
        onPressedChange={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
        <Moon
          size={22}
          strokeWidth={3}
          className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
          aria-hidden="true"
        />
        <Sun
          size={22}
          strokeWidth={3}
          className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
          aria-hidden="true"
        />
        {children}
      </Toggle>
    </div>
  );
}
