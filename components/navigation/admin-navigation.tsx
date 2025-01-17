"use client";
import Link from "next/link";
import {
  Users,
  Shield,
  File,
  Briefcase,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import AdminNavToolTip from "./tooltip";
import { usePathname } from "next/navigation";
import ToggleTheme from "../shared/theme-toggle";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export const AdminNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="flex flex-col justify-between h-full">
      <ul className="flex flex-col items-center p-1 gap-2 h-full">
        <AdminNavToolTip message="Company" side="right">
          <li
            className={`rounded-md transition-colors duration-300 dark:hover:bg-zinc-800 hover:bg-stone-300 hover dark:bg-background ${
              pathname === "/company"
                ? "bg-stone-500 dark:bg-zinc-700"
                : "bg-inherit"
            }`}>
            <Link
              href="/company"
              className="w-[45px] h-[45px] flex flex-col justify-center  items-center">
              <Briefcase className="text-black dark:text-zinc-400" />
            </Link>
          </li>
        </AdminNavToolTip>
        <AdminNavToolTip message="Modules" side="right">
          <li
            className={`rounded-md transition-colors duration-300 dark:hover:bg-zinc-800 hover:bg-stone-300 hover dark:bg-background ${
              pathname === "/company/modules"
                ? "bg-stone-500 dark:bg-zinc-700"
                : "bg-inherit"
            }`}>
            <Link
              href="/company/modules"
              className="w-[45px] h-[45px] flex flex-col justify-center  items-center">
              <ShoppingBag className="text-black dark:text-zinc-400" />
            </Link>
          </li>
        </AdminNavToolTip>
        <AdminNavToolTip message="Members" side="right">
          <li
            className={`rounded-md transition-colors duration-300 dark:hover:bg-zinc-800 hover:bg-stone-300 hover dark:bg-background ${
              pathname === "/company/members"
                ? "bg-stone-500 dark:bg-zinc-700"
                : "bg-inherit"
            }`}>
            <Link
              href="/company/members"
              className="w-[45px] h-[45px] flex flex-col justify-center items-center">
              <Users className="text-black dark:text-zinc-400" />
            </Link>
          </li>
        </AdminNavToolTip>
        <AdminNavToolTip message="Roles" side="right">
          <li
            className={`rounded-md transition-colors duration-300 dark:hover:bg-zinc-800 hover:bg-stone-300 hover dark:bg-background ${
              pathname === "/company/roles"
                ? "bg-stone-500 dark:bg-zinc-700"
                : "bg-inherit"
            }`}>
            <Link
              href="/company/roles"
              className="w-[45px] h-[45px] flex flex-col justify-center items-center">
              <Shield className="text-black dark:text-zinc-400" />
            </Link>
          </li>
        </AdminNavToolTip>
        <AdminNavToolTip message="Templates" side="right">
          <li
            className={`rounded-md transition-colors duration-300 dark:hover:bg-zinc-800 hover:bg-stone-300 hover dark:bg-background ${
              pathname === "/company/templates"
                ? "bg-stone-500 dark:bg-zinc-700"
                : "bg-inherit"
            }`}>
            <Link
              href="/company/templates"
              className="w-[45px] h-[45px] flex flex-col justify-center items-center">
              <File className="text-black dark:text-zinc-400" />
            </Link>
          </li>
        </AdminNavToolTip>
      </ul>
      <div className="pb-3">
        <AdminNavToolTip message="Theme" side="right">
          <div className=" flex justify-center items-center w-45 h-45 rounded-md mx-1">
            <ToggleTheme className="dark:text-zinc-400" />
          </div>
        </AdminNavToolTip>
        <AdminNavToolTip message="Logout" side="right">
          <div className=" flex justify-center items-center w-45 h-45 rounded-md mx-1">
            <Button
              variant="ghost"
              onClick={() => {
                if (typeof window !== undefined) {
                  localStorage.removeItem("token");
                  router.push("/admin-signin");
                }
              }}>
              <LogOut className="text-black dark:text-zinc-400" />
            </Button>
          </div>
        </AdminNavToolTip>
      </div>
    </div>
  );
};
