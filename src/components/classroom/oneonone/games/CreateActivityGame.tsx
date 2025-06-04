
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AIActivityGenerator } from "./AIActivityGenerator";
import { ActivityForm } from "./ActivityForm";
import { ActivityList } from "./ActivityList";
import { EmptyState } from "./EmptyState";

interface CreatedActivity {
  id: string;
  title: string;
  type: string;
  description: string;
  content: any;
  createdAt: Date;
  isAIGenerated?: boolean;
}

export function CreateActivityGame() {
  const [createdActivities, setCreatedActivities] = useState<CreatedActivity[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("manual");
  const { toast } = useToast();

  const handleAIActivityGenerated = (aiActivity: any) => {
    const newActivity: CreatedActivity = {
      id: Date.now().toString(),
      title: aiActivity.title,
      type: aiActivity.type,
      description: aiActivity.description,
      content: aiActivity.content,
      createdAt: new Date(),
      isAIGenerated: true
    };

    setCreatedActivities([newActivity, ...createdActivities]);
    setActiveTab("manual");
  };

  const handleActivityCreated = (activity: CreatedActivity) => {
    setCreatedActivities([activity, ...createdActivities]);
    setIsCreating(false);
    toast({
      title: "Activity Created!",
      description: `"${activity.title}" has been added to your activities.`,
    });
  };

  const deleteActivity = (id: string) => {
    setCreatedActivities(createdActivities.filter(activity => activity.id !== id));
    toast({
      title: "Activity Deleted",
      description: "The activity has been removed.",
    });
  };

  if (!isCreating && createdActivities.length === 0) {
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Creation</TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-1">
            <Sparkles size={14} />
            AI Generator
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="text-center py-8">
          <EmptyState onCreateActivity={() => setIsCreating(true)} />
        </TabsContent>

        <TabsContent value="ai">
          <AIActivityGenerator onActivityGenerated={handleAIActivityGenerated} />
        </TabsContent>
      </Tabs>
    );
  }

  if (isCreating) {
    return (
      <ActivityForm 
        onActivityCreated={handleActivityCreated}
        onCancel={() => setIsCreating(false)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Custom Activities</h3>
        <div className="flex gap-2">
          <Button
            onClick={() => setActiveTab("ai")}
            size="sm"
            variant="outline"
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <Sparkles size={16} className="mr-2" />
            AI Generate
          </Button>
          <Button
            onClick={() => setIsCreating(true)}
            size="sm"
            className="bg-purple-500 hover:bg-purple-600"
          >
            <Plus size={16} className="mr-2" />
            Create New
          </Button>
        </div>
      </div>

      <ActivityList 
        activities={createdActivities}
        onDeleteActivity={deleteActivity}
      />

      {activeTab === "ai" && (
        <div className="mt-6">
          <AIActivityGenerator onActivityGenerated={handleAIActivityGenerated} />
        </div>
      )}
    </div>
  );
}
