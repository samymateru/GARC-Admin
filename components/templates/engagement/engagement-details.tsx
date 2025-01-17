import { useQuery } from "@tanstack/react-query";
import PropagateLoader from "react-spinners/PropagateLoader";
import { CircleAlert } from "lucide-react";
import { EngagementTemplateColumns } from "./engagement-template-def";
import { EngagementTemplateTable } from "./engagement-template-table";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type EngagementTemplate = {
  name: string | null;
  category: string | null;
  phases: Array<string> | null;
  actions: Array<string> | null;
  procedures: Array<string> | null;
  id: string | null;
  created_at: Date | null;
};

export type Response = {
  detail?: string;
  status_code?: number;
  payload: Array<any>;
};

export default function EngagementDetailsTemplate() {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["fetch-engagement-template"],
    queryFn: async (): Promise<Response> => {
      const response = await fetch(`${BASE_URL}/templates/`, {
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
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
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
      const template: EngagementTemplate[] = [
        {
          name: null,
          category: null,
          phases: null,
          actions: null,
          procedures: null,
          id: null,
          created_at: null,
        },
      ];

      return (
        <EngagementTemplateTable
          data={template}
          columns={EngagementTemplateColumns}
        />
      );
    }
    if (data.status_code === 200) {
      const engagement_template: EngagementTemplate[] = data?.payload.map(
        ({
          category,
          template_id,
          phases,
          actions,
          procedures,
          created_at,
          template_name,
        }) => ({
          category: category,
          id: template_id,
          phases: phases,
          actions: actions,
          procedures: procedures,
          created_at: created_at,
          name: template_name,
        })
      );
      return (
        <EngagementTemplateTable
          data={engagement_template}
          columns={EngagementTemplateColumns}
        />
      );
    }
  }
}
