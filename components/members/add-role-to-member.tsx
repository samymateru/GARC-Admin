import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Label } from "../ui/label";
import { Roles } from "../roles/roles-details";
import { Button } from "../ui/button";
import { Plus, Send, X } from "lucide-react";
import { showToast } from "../shared/toast";
import { useRouter } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AddRoleToMemberProps {
  children?: ReactNode;
  user_id?: number | null;
}

type Data = {
  payload: Roles[];
  status_code: number;
};

type Response = {
  detail?: string;
  status_code?: number;
};

export const AddRoleToMember = ({
  children,
  user_id,
}: AddRoleToMemberProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [roles, setRoles] = useState<Array<any>>([]);
  const [role_id, setId] = useState<number>(0);

  const { mutate } = useMutation({
    mutationKey: ["add-user-role"],
    mutationFn: async (data: any): Promise<Response> => {
      const response = await fetch(`${BASE_URL}/users/add_role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            typeof window === "undefined" ? "" : localStorage.getItem("token")
          }`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Registration failed");
      }
      return response.json();
    },
  });

  useEffect(() => {
    const queries = queryClient.getQueriesData({ queryKey: ["fetch-roles"] });
    if (queries.length > 0) {
      const data = queries[0][1] as Data;
      setRoles(data.payload);
    }
  }, [queryClient]);

  const submit = (id: number) => {
    if (id !== 0) {
      mutate(
        { role_id: id, user_id: user_id },
        {
          onSuccess: (data) => {
            if (data.status_code === 503) {
              showToast(data.detail, "success");
              queryClient.invalidateQueries({ queryKey: ["fetch-user-roles"] });
              setOpen(false);
              setId(0);
            } else if (data.status_code === 404) {
              showToast(data.detail, "error");
              router.push("/admin-signin");
            } else {
              showToast(data.detail, "error");
            }
          },
          onError: (error) => {
            showToast(error.message, "error");
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <Button
          className="absolute right-2 top-2 hover:dark:bg-accent p-0 w-[30px] h-[30px]"
          tabIndex={0}
          onClick={() => setOpen(false)}
          variant={"ghost"}>
          <X size={16} />
        </Button>

        <DialogHeader>
          <DialogTitle className="text-2xl tracking-wide font-serif">
            Add Role
          </DialogTitle>
          <DialogDescription />
          <div className="flex flex-col gap-2 pb-3 pt-2">
            <Label className="text-[14px] font-serif tracking-wide">
              Role Name
            </Label>
            <Select onValueChange={(e) => setId(parseInt(e, 10))}>
              <SelectTrigger className="">
                <SelectValue placeholder="Role" className="font-serif" />
              </SelectTrigger>
              <SelectContent className="w-full py-2">
                {roles.map((item: any, index: number) => (
                  <SelectItem
                    value={item.id}
                    key={index}
                    className="dark:hover:bg-accent cursor-pointer">
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button
              variant="ghost"
              className="w-[100px]"
              onClick={() => submit(role_id)}>
              <Label className="text-[14px] cursor-pointer tracking-wide font-serif">
                Submit
              </Label>
              <Send size={16} />
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
