"use client";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReactNode, useRef, useState } from "react";
import {
  PlusCircle,
  Trash,
  ArrowRightCircle,
  CircleArrowLeft,
  CircleArrowLeftIcon,
  Send,
  X,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation } from "@tanstack/react-query";

interface AddEngagementProps {
  children?: ReactNode;
}

export default function AddEngagementTemplate({
  children,
}: AddEngagementProps) {
  const [tab, setTab] = useState<string>("phases");
  const [phases, setPhase] = useState<Array<string | undefined>>([]);
  const [actions, setActions] = useState<Array<string | undefined>>([]);
  const [procedures, setProcedures] = useState<Array<string | undefined>>([]);
  const actionRef = useRef<HTMLInputElement>(null);
  const phaseRef = useRef<HTMLInputElement>(null);
  const procudureRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { mutate } = useMutation({
    mutationFn: async (data: unknown) => {
      const response = await fetch(`${BASE_URL}/templates/new_template`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("failed to add role");
      }
      return await response.json();
    },
  });
  const onSubmit = () => {
    const template = {
      name: name,
      phases: phases,
      actions: actions,
      procedures: procedures,
      category: "Engagement",
    };
    mutate(template, {
      onSuccess: (data) => {
        console.log(data);
      },
      onError: (error) => {
        console.log(error.message);
      },
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="flex flex-col gap-1">
        <Button
          className="absolute top-2 right-2  rounded-full p-0 mt-0 h-[30px] w-[30px]"
          variant="ghost"
          onClick={() => setOpen(false)}>
          <X size={20} />
        </Button>
        <DialogHeader className="">
          <DialogTitle className="font-bold tracking-tight scroll-m-0 text-3xl">
            Engagement Template Wizard
          </DialogTitle>
          <DialogDescription className="p-0 m-0" />
        </DialogHeader>
        <Tabs
          defaultValue={tab}
          value={tab}
          className="w-[calc(100%-30px)] self-center pb-3">
          <TabsContent value="phases" className="flex flex-col mt-0">
            <Label className="tracking-tight font-semibold text-sm">
              Phases
            </Label>
            <div className="pt-2">
              <ScrollArea className="h-[250px] px-4">
                <ul className="flex flex-col gap-1 cursor-pointer">
                  {phases.map((item, index) => (
                    <li
                      className="w-full bg-zinc-900 p-2 flex items-center justify-between rounded-md"
                      key={index}>
                      <Label className="font-semibold tracking-tight scroll-m-1 pl-3">
                        <strong className="mr-1">{index + 1}.</strong>
                        {item}
                      </Label>
                      <Button
                        variant="ghost"
                        className="w-4 h-6"
                        onClick={() => {
                          setPhase(phases.filter((_, i) => i !== index));
                        }}>
                        <Trash size={20} />
                      </Button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
            <div className="pt-5">
              <Label className="font-bold tracking-tight scroll-m-0">
                Phase Name
              </Label>
              <Input ref={phaseRef} placeholder="Provide phase name" />
              <div className="flex justify-between mt-3">
                <Button
                  variant="ghost"
                  className=""
                  onClick={() => {
                    if (phaseRef.current?.value !== "") {
                      setPhase([...phases, phaseRef.current?.value]);
                    }

                    if (phaseRef.current) {
                      phaseRef.current.value = ""; // Reset the input value
                    }
                  }}>
                  <PlusCircle />
                  <Label className="tracking-tight font-semibold cursor-pointer">
                    Add
                  </Label>
                </Button>
                {phases.length !== 0 ? (
                  <Button
                    className=""
                    variant="ghost"
                    onClick={() => setTab("actions")}>
                    <Label className="tracking-tight font-semibold cursor-pointer">
                      Next
                    </Label>
                    <ArrowRightCircle size={20} />
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="actions" className="flex flex-col mt-0">
            <Label className="tracking-tight font-semibold text-sm">
              Actions
            </Label>
            <div className="pt-2">
              <ScrollArea className="h-[250px] px-4">
                <ul className="flex flex-col gap-1 cursor-pointer">
                  {actions.map((item, index) => (
                    <li
                      className="w-full bg-zinc-900 p-2 flex items-center justify-between rounded-md"
                      key={index}>
                      <Label className="font-semibold tracking-tight scroll-m-1 pl-3">
                        <strong className="mr-1">{index + 1}.</strong>
                        {item}
                      </Label>
                      <Button
                        variant="ghost"
                        className="w-4 h-6"
                        onClick={() => {
                          setActions(actions.filter((_, i) => i !== index));
                        }}>
                        <Trash size={20} />
                      </Button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
            <div className="pt-5">
              <Label className="font-bold tracking-tight scroll-m-0">
                Action Name
              </Label>
              <Input ref={actionRef} placeholder="Provide phase name" />
              <div className="flex justify-between mt-3">
                <div>
                  <Button
                    variant="ghost"
                    className=""
                    onClick={() => {
                      setTab("phases");
                    }}>
                    <CircleArrowLeft />
                    <Label className="tracking-tight font-semibold cursor-pointer">
                      Back
                    </Label>
                  </Button>
                  <Button
                    variant="ghost"
                    className=""
                    onClick={() => {
                      if (actionRef.current?.value !== "") {
                        setActions([...actions, actionRef.current?.value]);
                      }

                      if (actionRef.current) {
                        actionRef.current.value = ""; // Reset the input value
                      }
                    }}>
                    <PlusCircle />
                    <Label className="tracking-tight font-semibold cursor-pointer">
                      Add
                    </Label>
                  </Button>
                </div>
                {actions.length !== 0 ? (
                  <Button
                    className=""
                    variant="ghost"
                    onClick={() => setTab("procedures")}>
                    <Label className="tracking-tight font-semibold cursor-pointer">
                      Next
                    </Label>
                    <ArrowRightCircle size={20} />
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="procedures" className="flex flex-col mt-0">
            <Label className="tracking-tight font-semibold text-sm">
              Procudures
            </Label>
            <div className="pt-2">
              <ScrollArea className="h-[250px] px-4">
                <ul className="flex flex-col gap-1 cursor-pointer">
                  {procedures.map((item, index) => (
                    <li
                      className="w-full bg-zinc-900 p-2 flex items-center justify-between rounded-md"
                      key={index}>
                      <Label className="font-semibold tracking-tight scroll-m-1 pl-3">
                        <strong className="mr-1">{index + 1}.</strong>
                        {item}
                      </Label>
                      <Button
                        variant="ghost"
                        className="w-4 h-6"
                        onClick={() => {
                          setProcedures(
                            procedures.filter((_, i) => i !== index)
                          );
                        }}>
                        <Trash size={20} />
                      </Button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
            <div className="pt-5">
              <Label className="font-bold tracking-tight scroll-m-0">
                Procedure Name
              </Label>
              <Input ref={procudureRef} placeholder="Provide phase name" />
              <div className="flex justify-between mt-3">
                <div>
                  <Button
                    variant="ghost"
                    className=""
                    onClick={() => {
                      setTab("actions");
                    }}>
                    <CircleArrowLeft />
                    <Label className="tracking-tight font-semibold cursor-pointer">
                      Back
                    </Label>
                  </Button>
                  <Button
                    variant="ghost"
                    className=""
                    onClick={() => {
                      if (procudureRef.current?.value !== "") {
                        setProcedures([
                          ...procedures,
                          procudureRef.current?.value,
                        ]);
                      }
                      if (procudureRef.current) {
                        procudureRef.current.value = ""; // Reset the input value
                      }
                    }}>
                    <PlusCircle />
                    <Label className="tracking-tight font-semibold cursor-pointer">
                      Add
                    </Label>
                  </Button>
                </div>
                {procedures.length !== 0 ? (
                  <Button
                    className=""
                    variant="ghost"
                    onClick={() => {
                      setTab("name");
                    }}>
                    <Label className="tracking-tight font-semibold cursor-pointer">
                      Confirm
                    </Label>
                    <ArrowRightCircle size={20} />
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="name" className="flex flex-col mt-0">
            <div className="pb-4">
              <Label className="font-semibold tracking-tight scroll-m-0">
                Template Name
              </Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex gap-10 items-center">
              <Button onClick={() => setTab("procedures")} variant="ghost">
                <CircleArrowLeftIcon />
                Back
              </Button>
              {name !== "" ? (
                <Button variant="ghost" onClick={onSubmit}>
                  <Send />
                  Confirm
                </Button>
              ) : (
                ""
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
