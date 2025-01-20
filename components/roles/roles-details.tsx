"use client";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "../shared/data-table";
import { RolesColumns } from "./roles-column-def";
import PropagateLoader from "react-spinners/PropagateLoader";
import { CircleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { RoleTable } from "./roles-table";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type Roles = {
  id: number | null;
  name?: string | null;
  description?: string | null;
  category?: string | null;
  write?: boolean | null;
  read?: boolean | null;
  edit?: boolean | null;
  delete: boolean | null;
  assign?: boolean | null;
  approve?: boolean | null;
  created_at?: Date | null;
};

export type Response = {
  status_code?: number;
  payload: Roles[];
  detail?: string;
};

export default function Roles() {
  const router = useRouter();
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["fetch-roles"],
    queryFn: async (): Promise<Response> => {
      const response = await fetch(`${BASE_URL}/roles/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch roles: ${response.statusText}`);
      }
      return await response.json();
    },
    refetchOnMount: false,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <PropagateLoader className="text-white" color="white" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="h-full flex items-center justify-center">
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
    if (data.status_code === 201) {
      const defaultRole: Roles[] = [
        {
          id: null,
          name: null,
          description: null,
          category: null,
          write: null,
          read: null,
          edit: null,
          delete: null,
          assign: null,
          approve: null,
          created_at: null,
        },
      ];
      return (
        <div className=" bg-white h-full dark:bg-background">
          <RoleTable data={defaultRole} columns={RolesColumns} />
        </div>
      );
    }
    if (data.status_code === 200) {
      console.log(data.payload);
      return (
        <div className=" bg-white h-full dark:bg-background">
          <RoleTable data={data?.payload} columns={RolesColumns} />
        </div>
      );
    }
    if (data.status_code === 404) {
      router.push("/admin-signin");
    }
  }
}
