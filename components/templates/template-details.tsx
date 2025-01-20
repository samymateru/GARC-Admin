"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { Label } from "../ui/label";
import EngagementDetailsTemplate from "./engagement/engagement-details";

export default function TemplatesDetails() {
  return (
    <Tabs
      defaultValue="engagement"
      orientation="vertical"
      className="flex w-full h-full gap-2 p-3 bg-white dark:bg-background">
      <ScrollArea className="h-[calc(100%-50px)]">
        <TabsList className="flex-col  p-2 h-full bg-white dark:bg-background">
          <TabsTrigger
            value="engagement"
            className="hover:bg-accent text-neutral-800 dark:text-neutral-400 w-[150px] relative py-3 justify-start rounded-md after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary">
            <Label className="cursor-pointer">Engagement</Label>
          </TabsTrigger>
          <TabsTrigger
            value="risk"
            className=" hover:bg-accent text-neutral-800 dark:text-neutral-400 w-[150px] relative py-3 justify-start rounded-md after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary">
            <Label className="cursor-pointer">Risk</Label>
          </TabsTrigger>
          <TabsTrigger
            value="fraud"
            className=" hover:bg-accent text-neutral-800 dark:text-neutral-400 w-[150px] relative  py-3 justify-start rounded-md after:absolute after:inset-y-0 after:start-0 after:w-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary">
            <Label className="cursor-pointer">Fraud</Label>
          </TabsTrigger>
        </TabsList>
      </ScrollArea>
      <div className="grow rounded-lg border border-border text-start h-full">
        <TabsContent value="engagement" className="m-0 relative">
          <EngagementDetailsTemplate />
        </TabsContent>
        <TabsContent value="risk">Risk</TabsContent>
        <TabsContent value="fraud">Fraud</TabsContent>
      </div>
    </Tabs>
  );
}
