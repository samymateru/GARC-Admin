"use client";
import { useQuery } from "@tanstack/react-query";
import { ModuleColumns } from "./module-column-def";
import PropagateLoader from "react-spinners/PropagateLoader";
import { CircleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { ModuleTable } from "./module-table";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type Module = {
  id?: number | null;
  name?: string | null;
  description?: string;
  status: string | null;
  created_at: Date | null;
};

type Response = {
  detail?: string;
  status_code?: number;
  payload: Module[];
};

export default function ModuleDetails() {
  const router = useRouter();
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["fetch-modules"],
    queryFn: async (): Promise<Response> => {
      const response = await fetch(`${BASE_URL}/modules/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch modules: ${response.statusText}`);
      }
      return await response.json();
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <PropagateLoader color="white" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="h-full flex justify-center items-center">
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
    if (data?.status_code === 201) {
      const data: Module[] = [
        {
          id: null,
          name: null,
          created_at: null,
          status: null,
          description: "",
        },
      ];
      return <ModuleTable columns={ModuleColumns} data={data} />;
    }
    if (data?.status_code === 200) {
      return <ModuleTable columns={ModuleColumns} data={data.payload} />;
    }
    if (data.status_code === 404) {
      router.push("/admin-signin");
    }
  }
}
