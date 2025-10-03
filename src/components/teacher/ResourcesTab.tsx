import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Unit {
  id: string;
  title: string;
  description?: string;
  sort_order: number;
  created_at: string;
}

interface Lesson {
  id: string;
  title: string;
  description?: string;
  unit_id?: string;
  sort_order: number;
  created_at: string;
}

export const ResourcesTab = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);

      // Fetch units
      const { data: unitsData, error: unitsError } = await supabase
        .from('units')
        .select('*')
        .order('sort_order');

      if (unitsError) {
        console.error('Error fetching units:', unitsError);
        toast({
          title: "Error loading units",
          description: unitsError.message,
          variant: "destructive",
        });
      } else {
        setUnits(unitsData || []);
      }

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .order('sort_order');

      if (lessonsError) {
        console.error('Error fetching lessons:', lessonsError);
        toast({
          title: "Error loading lessons",
          description: lessonsError.message,
          variant: "destructive",
        });
      } else {
        setLessons(lessonsData || []);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Error",
        description: "Failed to load resources",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Resources</h2>
        <p className="text-muted-foreground">
          Browse and manage your teaching units and lessons
        </p>
      </div>

      <Tabs defaultValue="units" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="units">
            <BookOpen className="mr-2 h-4 w-4" />
            Units ({units.length})
          </TabsTrigger>
          <TabsTrigger value="lessons">
            <FileText className="mr-2 h-4 w-4" />
            Lessons ({lessons.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="units" className="space-y-4 mt-6">
          {units.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No units available yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {units.map((unit) => (
                <Card key={unit.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{unit.title}</CardTitle>
                    <CardDescription>Order: {unit.sort_order}</CardDescription>
                  </CardHeader>
                  {unit.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{unit.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="lessons" className="space-y-4 mt-6">
          {lessons.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No lessons available yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lessons.map((lesson) => (
                <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{lesson.title}</CardTitle>
                    <CardDescription>Order: {lesson.sort_order}</CardDescription>
                  </CardHeader>
                  {lesson.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{lesson.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
