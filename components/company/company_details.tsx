"use client";
import { useQuery } from "@tanstack/react-query";
import { Label } from "../ui/label";
import PropagateLoader from "react-spinners/PropagateLoader";
import {
  CircleAlert,
  Clipboard,
  Clock,
  Globe,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminNavToolTip from "../navigation/tooltip";
import { Separator } from "../ui/separator";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const CompanyDetails = () => {
  const router = useRouter();
  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["fetch-company"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/companies/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            typeof window === "undefined" ? "" : localStorage.getItem("token")
          }`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch company data: ${response.statusText}`);
      }
      return await response.json();
    },
    refetchOnMount: false,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center w-full">
        <PropagateLoader className="text-white" color="white" />
      </div>
    );
  }
  if (isError) {
    console.log(data.status_code);
    return (
      <div className="h-full flex items-center justify-center w-full">
        <div className="rounded-lg border border-red-500/50 px-4 py-3 text-red-600 w-[200px]">
          <p className="text-sm">
            <CircleAlert
              className="-mt-0.5 me-3 inline-flex opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            An error occurred!
          </p>
        </div>
      </div>
    );
  }
  if (isSuccess) {
    if (data.status_code === 200) {
      console.log(data.payload.status);
      return (
        <div>
          <Separator className="bg-neutral-400" />
          <section className="ml-5 pt-3">
            <div>
              <Label className="ml-2 tracking-wide font-semibold text-pretty text-2xl font-serif italic">
                {data.payload?.name}
              </Label>
            </div>
            <div>
              <div>
                <section className="mt-2">
                  <div className="flex items-center ml-2">
                    <div className="dark:bg-accent p-2 rounded-md">
                      <AdminNavToolTip message="Owner's name" side="top">
                        <User />
                      </AdminNavToolTip>
                    </div>
                    <div className="py-2 rounded-md min-w-[100px] px-3">
                      <Label className="font-serif text-[14px] tracking-wide">
                        {data.payload?.owner}
                      </Label>
                    </div>
                  </div>
                </section>
                <section className="mt-2">
                  <div className="flex items-center ml-2">
                    <div className="dark:bg-accent p-2 rounded-md">
                      <AdminNavToolTip message="Email" side="top">
                        <Mail />
                      </AdminNavToolTip>
                    </div>
                    <div className="py-2 rounded-md min-w-[100px] px-3">
                      <Label className="font-serif text-[14px] tracking-wide">
                        {data.payload?.email}
                      </Label>
                    </div>
                  </div>
                </section>
                <section className="mt-2">
                  <div className="flex items-center ml-2">
                    <div className="dark:bg-accent p-2 rounded-md">
                      <AdminNavToolTip message="Telephone" side="top">
                        <Phone />
                      </AdminNavToolTip>
                    </div>
                    <div className=" py-2 rounded-md min-w-[100px] px-3">
                      <Label className="font-serif text-[14px] tracking-wide">
                        {data.payload?.telephone}
                      </Label>
                    </div>
                  </div>
                </section>
                <section className="mt-2">
                  <div className="flex items-center ml-2">
                    <div className="dark:bg-accent p-2 rounded-md">
                      <AdminNavToolTip message="Website" side="top">
                        <Globe />
                      </AdminNavToolTip>
                    </div>
                    <div className=" py-2 rounded-md min-w-[100px] px-3">
                      <Label className="font-serif text-[14px] tracking-wide">
                        <Link
                          href={
                            data.payload?.website ||
                            "https://www.capstone.co.tz/"
                          }
                          target="_blank">
                          {data.payload?.website ||
                            "https://www.capstone.co.tz/"}
                        </Link>
                      </Label>
                    </div>
                  </div>
                </section>
                <section className="mt-2">
                  <div className="flex items-center ml-2">
                    <div className="dark:bg-accent p-2 rounded-md">
                      <AdminNavToolTip message="Description" side="top">
                        <Clipboard />
                      </AdminNavToolTip>
                    </div>
                    <div className="py-2 rounded-md   px-3">
                      <p className="max-w-[250px] whitespace-normal break-words h-fit text-[14px] font-serif tracking-wide">
                        {data.payload?.description}
                      </p>
                    </div>
                  </div>
                </section>
                <section className="mt-2">
                  <div className="flex items-center ml-2">
                    <div className="dark:bg-accent p-2 rounded-md">
                      <AdminNavToolTip message="Status" side="top">
                        <Clock />
                      </AdminNavToolTip>
                    </div>
                    {JSON.parse(data.payload?.status) === true ? (
                      <div className="py-2 rounded-md   px-3">
                        <p className="max-w-[250px] whitespace-normal break-words h-fit text-[14px] font-serif tracking-wide text-green-800">
                          ACTIVE
                        </p>
                      </div>
                    ) : (
                      <div className="py-2 rounded-md   px-3">
                        <p className="max-w-[250px] whitespace-normal break-words h-fit text-[14px] font-serif tracking-wide text-red-800">
                          INACTIVE
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
              <div></div>
            </div>
          </section>
          <section></section>
        </div>
      );
    }
    if (data.status_code === 404) {
      router.push("/admin-signin");
    }
  }
};
