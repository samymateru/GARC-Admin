"use client";
import { usePathname } from "next/navigation";
import { Label } from "../ui/label";
export const TopBar = () => {
  const pathname = usePathname();
  return (
    <div className="flex justify-end pr-5 pt-3 bg-white dark:bg-background gap-4 mb-2">
      {pathname === "/company" ? (
        <Label
          className="self-center font-extrabold pl-2 tracking-tight scroll-m-1 text-3xl"
          style={{ marginRight: "auto" }}>
          Profile
        </Label>
      ) : (
        ""
      )}
      {pathname === "/company/templates" ? (
        <Label
          className="self-center font-extrabold pl-2 tracking-tight scroll-m-1 text-3xl"
          style={{ marginRight: "auto" }}>
          Templates
        </Label>
      ) : (
        ""
      )}
      {pathname === "/company/roles" ? (
        <>
          <Label
            className="self-center font-extrabold pl-2 tracking-tight scroll-m-1 text-3xl"
            style={{ marginRight: "auto" }}>
            Roles
          </Label>
        </>
      ) : (
        ""
      )}
      {pathname === "/company/modules" ? (
        <>
          <Label
            className="self-center font-extrabold pl-2 tracking-tight scroll-m-1 text-3xl"
            style={{ marginRight: "auto" }}>
            Modules
          </Label>
        </>
      ) : (
        ""
      )}
      {pathname === "/company/members" ? (
        <>
          <Label
            className="self-center font-extrabold pl-2 tracking-tight scroll-m-1 text-3xl"
            style={{ marginRight: "auto" }}>
            Users
          </Label>
        </>
      ) : (
        ""
      )}
    </div>
  );
};
