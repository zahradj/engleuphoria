import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ParentNotificationSettingsProps {
  parentId: string;
}

export function ParentNotificationSettings({ parentId }: ParentNotificationSettingsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ["parent-notification-preferences", parentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("parent_notification_preferences")
        .select("*")
        .eq("parent_id", parentId)
        .single();

      if (error) {
        // Create default preferences if they don't exist
        const { data: newPrefs, error: insertError } = await supabase
          .from("parent_notification_preferences")
          .insert({ parent_id: parentId })
          .select()
          .single();

        if (insertError) throw insertError;
        return newPrefs;
      }

      return data;
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (updates: Partial<typeof preferences>) => {
      const { error } = await supabase
        .from("parent_notification_preferences")
        .update(updates)
        .eq("parent_id", parentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parent-notification-preferences"] });
      toast({
        title: "Settings updated",
        description: "Your notification preferences have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    },
  });

  const togglePreference = (key: string, value: boolean) => {
    updatePreferencesMutation.mutate({ [key]: value });
  };

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  const notificationOptions = [
    {
      key: "lesson_reminders",
      label: "Lesson Reminders",
      description: "Get notified before upcoming lessons",
    },
    {
      key: "progress_reports",
      label: "Progress Reports",
      description: "Receive regular updates on your child's progress",
    },
    {
      key: "homework_notifications",
      label: "Homework Notifications",
      description: "Get notified when homework is assigned or completed",
    },
    {
      key: "attendance_alerts",
      label: "Attendance Alerts",
      description: "Receive alerts about attendance issues",
    },
    {
      key: "payment_reminders",
      label: "Payment Reminders",
      description: "Get reminded about upcoming payments",
    },
    {
      key: "teacher_messages",
      label: "Teacher Messages",
      description: "Receive notifications for new messages from teachers",
    },
    {
      key: "weekly_summary",
      label: "Weekly Summary",
      description: "Get a weekly summary of your child's activities",
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Notification Preferences</h3>
      <div className="space-y-6">
        {notificationOptions.map((option) => (
          <div key={option.key} className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor={option.key} className="text-base">
                {option.label}
              </Label>
              <p className="text-sm text-muted-foreground">
                {option.description}
              </p>
            </div>
            <Switch
              id={option.key}
              checked={preferences?.[option.key as keyof typeof preferences] || false}
              onCheckedChange={(checked) => togglePreference(option.key, checked)}
              disabled={updatePreferencesMutation.isPending}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
