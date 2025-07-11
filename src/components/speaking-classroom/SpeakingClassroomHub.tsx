import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Mic, Users, Sparkles, Clock, TrendingUp, Target } from 'lucide-react';
import type { AITopicSuggestion, SpeakingGroup, GroupRecommendation } from '@/types/speaking-classroom';

export const SpeakingClassroomHub = () => {
  const [suggestedTopics, setSuggestedTopics] = useState<AITopicSuggestion[]>([]);
  const [recommendedGroups, setRecommendedGroups] = useState<GroupRecommendation[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadPersonalizedContent();
  }, []);

  const loadPersonalizedContent = async () => {
    await Promise.all([loadTopicSuggestions(), loadGroupRecommendations()]);
  };

  const loadTopicSuggestions = async () => {
    setIsLoadingTopics(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's speaking profile for personalization
      const { data: profile } = await supabase
        .from('student_speaking_profiles')
        .select('*')
        .eq('student_id', user.id)
        .single();

      const { data: sessionCount } = await supabase
        .from('speaking_classroom_sessions')
        .select('id', { count: 'exact' })
        .eq('student_id', user.id);

      const response = await supabase.functions.invoke('ai-topic-generator', {
        body: {
          student_id: user.id,
          cefr_level: profile?.current_cefr_level || 'A2',
          interests: profile?.preferred_topics || ['general'],
          learning_goals: profile?.speaking_goals || ['fluency'],
          session_count: sessionCount?.length || 0
        }
      });

      if (response.error) throw response.error;
      
      setSuggestedTopics(response.data.topics || []);
    } catch (error) {
      console.error('Error loading topic suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to load personalized topics. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingTopics(false);
    }
  };

  const loadGroupRecommendations = async () => {
    setIsLoadingGroups(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const response = await supabase.functions.invoke('speaking-group-matcher', {
        body: {
          student_id: user.id,
          preferred_time: new Date().toISOString()
        }
      });

      if (response.error) throw response.error;
      
      setRecommendedGroups(response.data.recommended_groups || []);
    } catch (error) {
      console.error('Error loading group recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to load group recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const startIndividualSession = async (topic: AITopicSuggestion) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: session, error } = await supabase
        .from('speaking_classroom_sessions')
        .insert({
          student_id: user.id,
          generated_topic: topic.topic,
          session_type: 'guided',
          difficulty_level: topic.difficulty.toString(),
          session_metadata: {
            topic_category: topic.category,
            keywords: topic.keywords,
            estimated_duration: topic.estimated_duration
          }
        })
        .select()
        .single();

      if (error) throw error;

      navigate(`/speaking-classroom/${session.id}`, {
        state: { topic, sessionType: 'individual' }
      });
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: "Error",
        description: "Failed to start speaking session. Please try again.",
        variant: "destructive"
      });
    }
  };

  const joinGroup = async (group: SpeakingGroup) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if already a member
      const { data: existingMembership } = await supabase
        .from('speaking_group_participants')
        .select('id')
        .eq('group_id', group.id)
        .eq('student_id', user.id)
        .single();

      if (existingMembership) {
        navigate(`/speaking-group/${group.id}`);
        return;
      }

      // Join the group
      const { error } = await supabase
        .from('speaking_group_participants')
        .insert({
          group_id: group.id,
          student_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: `You've joined the ${group.group_name}`,
      });

      navigate(`/speaking-group/${group.id}`);
    } catch (error) {
      console.error('Error joining group:', error);
      toast({
        title: "Error",
        description: "Failed to join group. Please try again.",
        variant: "destructive"
      });
    }
  };

  const createNewGroup = async () => {
    try {
      const response = await supabase.functions.invoke('speaking-group-matcher', {
        body: {
          student_id: (await supabase.auth.getUser()).data.user?.id,
          create_new_group: true
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "Group Created!",
        description: "Your new speaking group has been created.",
      });

      loadGroupRecommendations();
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: "Error",
        description: "Failed to create group. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Speaking Classroom</h1>
        <p className="text-muted-foreground">
          Practice speaking with AI guidance and connect with other learners at your level
        </p>
      </div>

      <Tabs defaultValue="individual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Individual Practice
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Group Sessions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoadingTopics ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              suggestedTopics.map((topic, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{topic.topic}</CardTitle>
                        <CardDescription className="text-sm">
                          {topic.context}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {topic.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          Difficulty: {topic.difficulty}/5
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {topic.estimated_duration} min
                        </div>
                      </div>
                      
                      {topic.keywords && topic.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {topic.keywords.slice(0, 3).map((keyword, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                          {topic.keywords.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{topic.keywords.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      <Button 
                        onClick={() => startIndividualSession(topic)}
                        className="w-full"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Start AI Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={loadTopicSuggestions}
              disabled={isLoadingTopics}
            >
              Generate New Topics
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recommended Groups</h2>
            <Button onClick={createNewGroup}>
              Create New Group
            </Button>
          </div>

          <div className="grid gap-4">
            {isLoadingGroups ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-muted rounded-full"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                        <div className="h-3 bg-muted rounded w-1/3"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              recommendedGroups.map((recommendation) => (
                <Card key={recommendation.group.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {recommendation.group.cefr_level}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {recommendation.group.group_name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{recommendation.group.current_participants}/{recommendation.group.max_participants} members</span>
                            <span>{recommendation.group.session_duration} min sessions</span>
                            <Badge variant="outline">
                              {recommendation.group.cefr_level} Level
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">
                              {recommendation.compatibility_score}% match
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="flex flex-wrap gap-1 justify-end">
                          {recommendation.reasons.slice(0, 2).map((reason, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                        <Button onClick={() => joinGroup(recommendation.group)}>
                          Join Group
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {!isLoadingGroups && recommendedGroups.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No groups available yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to create a speaking group for your level!
                </p>
                <Button onClick={createNewGroup}>
                  Create First Group
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};