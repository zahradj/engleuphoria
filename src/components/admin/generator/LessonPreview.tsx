import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Gamepad2, Target, MessageSquare, BookOpen, Briefcase } from "lucide-react";

interface LessonPreviewProps {
  data: any;
  system: string;
}

export const LessonPreview = ({ data, system }: LessonPreviewProps) => {
  if (!data) return null;

  const renderKidsPreview = () => (
    <div className="space-y-4">
      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            Hook Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{data.presentation?.hook_activity}</p>
          {data.presentation?.concept_check_questions && (
            <div className="mt-2">
              <p className="text-xs font-medium mb-1">Concept Check Questions:</p>
              <ul className="list-disc list-inside text-xs text-muted-foreground">
                {data.presentation.concept_check_questions.map((q: string, i: number) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Gamepad2 className="h-4 w-4 text-green-500" />
            Practice Game
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{data.practice?.game_mechanic}</p>
          {data.practice?.drill_sentences && (
            <div className="mt-2">
              <p className="text-xs font-medium mb-1">Drill Sentences:</p>
              <ul className="list-disc list-inside text-xs text-muted-foreground">
                {data.practice.drill_sentences.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-purple-500" />
            Production Task
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{data.production?.creative_task}</p>
          <p className="text-xs mt-2">
            <span className="font-medium">Target Output:</span> {data.production?.target_output}
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderTeensPreview = () => (
    <div className="space-y-4">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-500" />
            Context Scenario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{data.presentation?.context_scenario}</p>
          <p className="text-xs mt-2 p-2 bg-muted rounded">
            <span className="font-medium">Grammar Rule:</span> {data.presentation?.grammar_rule}
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-green-500" />
            Practice Activities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.practice?.fill_in_the_blank && (
            <div>
              <p className="text-xs font-medium mb-1">Fill in the Blank:</p>
              {data.practice.fill_in_the_blank.map((item: any, i: number) => (
                <p key={i} className="text-xs text-muted-foreground">
                  {item.sentence} → <span className="text-green-600">{item.answer}</span>
                </p>
              ))}
            </div>
          )}
          {data.practice?.error_correction && (
            <div>
              <p className="text-xs font-medium mb-1">Error Correction:</p>
              {data.practice.error_correction.map((item: any, i: number) => (
                <p key={i} className="text-xs text-muted-foreground">
                  <span className="line-through text-red-400">{item.sentence}</span> → <span className="text-green-600">{item.correction}</span>
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-purple-500" />
            Roleplay Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{data.production?.roleplay_prompt}</p>
          <Badge variant="secondary" className="mt-2">{data.production?.challenge}</Badge>
        </CardContent>
      </Card>
    </div>
  );

  const renderAdultsPreview = () => (
    <div className="space-y-4">
      <Card className="border-l-4 border-l-slate-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-slate-500" />
            Business Case
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-3 rounded text-sm font-mono">{data.presentation?.business_case}</div>
          <p className="text-xs mt-2 text-muted-foreground">{data.presentation?.function_explanation}</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-green-500" />
            Sentence Transformation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.practice?.sentence_transformation?.map((item: any, i: number) => (
            <div key={i} className="text-xs mb-2">
              <p className="text-muted-foreground">Original: {item.original}</p>
              <p className="text-green-600">Professional: {item.professional}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-purple-500" />
            Simulation Task
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{data.production?.simulation_task}</p>
          {data.production?.discussion_questions && (
            <div className="mt-2">
              <p className="text-xs font-medium mb-1">Discussion Questions:</p>
              <ul className="list-disc list-inside text-xs text-muted-foreground">
                {data.production.discussion_questions.map((q: string, i: number) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{data.title}</h3>
        <Badge>{system === "kids" ? "Playground" : system === "teens" ? "Academy" : "Hub"}</Badge>
      </div>
      
      {system === "kids" && renderKidsPreview()}
      {system === "teens" && renderTeensPreview()}
      {system === "adults" && renderAdultsPreview()}
    </div>
  );
};
