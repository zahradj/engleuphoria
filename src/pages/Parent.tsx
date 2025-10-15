import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParentStudentList } from "@/components/parent/ParentStudentList";
import { ParentMessages } from "@/components/parent/ParentMessages";
import { ParentNotificationSettings } from "@/components/parent/ParentNotificationSettings";
import { ParentStudentProgress } from "@/components/parent/ParentStudentProgress";
import { Users, MessageSquare, Bell, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Parent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Fetch parent profile
  const { data: parentProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["parent-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("parent_profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch student relationships
  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ["parent-students", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_parent_relationships")
        .select(`
          *,
          student:users!student_parent_relationships_student_id_fkey (
            id,
            full_name,
            email
          )
        `)
        .eq("parent_id", user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch unread messages count
  const { data: unreadCount } = useQuery({
    queryKey: ["parent-unread-messages", user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("parent_teacher_messages")
        .select("*", { count: "exact", head: true })
        .eq("parent_id", user?.id)
        .eq("is_read", false)
        .eq("sender_type", "teacher");

      if (error) throw error;
      return count || 0;
    },
    enabled: !!user?.id,
  });

  if (profileLoading || studentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading parent dashboard...</p>
        </div>
      </div>
    );
  }

  if (!parentProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Parent Profile Setup Required</h2>
          <p className="text-muted-foreground mb-4">
            Please complete your parent profile to access the dashboard.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Parent Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your children's learning progress and communicate with teachers
        </p>
      </div>

      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            My Children
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages
            {unreadCount && unreadCount > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-destructive text-destructive-foreground rounded-full">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <ParentStudentList
            students={students || []}
            onSelectStudent={setSelectedStudentId}
          />
        </TabsContent>

        <TabsContent value="progress">
          <ParentStudentProgress
            students={students || []}
            selectedStudentId={selectedStudentId}
            onSelectStudent={setSelectedStudentId}
          />
        </TabsContent>

        <TabsContent value="messages">
          <ParentMessages
            parentId={user?.id || ""}
            students={students || []}
          />
        </TabsContent>

        <TabsContent value="settings">
          <ParentNotificationSettings parentId={user?.id || ""} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
