"use client";
import { useQuery } from "@tanstack/react-query";
import PropagateLoader from "react-spinners/PropagateLoader";
import { CircleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { MembersColumns } from "./member.column-def";
import { MemberTable } from "./member-table";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type Member = {
  id?: number | null;
  name?: string | null;
  status?: boolean | null;
  role?: string | null;
  email?: string | null;
  telephone?: string | null;
  created_at?: Date | null;
  type?: string | null;
};

type MemberResponse = {
  detail?: string;
  status_code?: number;
  payload: Member[];
};
export default function MemberDetails() {
  const router = useRouter();
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["fetch-members"],
    queryFn: async (): Promise<MemberResponse> => {
      const response = await fetch(`${BASE_URL}/users/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            typeof window === "undefined" ? "" : localStorage.getItem("token")
          }`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      return await response.json();
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
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
      const member: Member[] = [
        {
          id: null,
          name: null,
          status: null,
          role: null,
          email: null,
          telephone: null,
          created_at: null,
          type: null,
        },
      ];
      return <MemberTable columns={MembersColumns} data={member} />;
    }
    if (data?.status_code === 200) {
      return <MemberTable columns={MembersColumns} data={data?.payload} />;
    }
    if (data.status_code === 404) {
      router.push("/admin-signin");
    }
  }
}
