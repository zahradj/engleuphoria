import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MissionContent } from '@/types/curriculumExpert';
import { Gamepad2, Trophy, Star } from 'lucide-react';

interface MissionPreviewProps {
  content: MissionContent;
}

export const MissionPreview = ({ content }: MissionPreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{content.missionTitle}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Ages {content.ageGroup} • {content.cefrLevel} • {content.totalQuests} quests • ~{content.estimatedWeeks} weeks
            </p>
          </div>
          <div className="flex gap-2">
            <Badge>{content.cefrLevel}</Badge>
            <Badge variant="outline">{content.ageGroup}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <Gamepad2 className="h-4 w-4" />
            <span>Mission Narrative</span>
          </div>
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-lg border border-purple-500/20">
            <p className="text-sm whitespace-pre-wrap">{content.missionNarrative}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <Star className="h-4 w-4" />
            <span>Quest Chain</span>
          </div>
          <div className="space-y-2">
            {content.quests.map((quest, i) => (
              <Card key={i} className="bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Quest {quest.questNumber}: {quest.questTitle}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{quest.xpReward} XP</Badge>
                        <Badge variant="outline" className="text-xs">{quest.badgeUnlocked}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{quest.questDescription}</p>
                    <div className="space-y-1">
                      <div className="text-xs font-medium">Objectives:</div>
                      <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                        {quest.objectives.map((obj, j) => (
                          <li key={j}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-medium">Activities:</div>
                      <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                        {quest.activities.map((activity, j) => (
                          <li key={j}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <Trophy className="h-4 w-4" />
            <span>Final Boss Challenge</span>
          </div>
          <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
            <CardContent className="pt-4">
              <div className="space-y-2">
                <h4 className="font-semibold">{content.finalBoss.challengeName}</h4>
                <p className="text-sm text-muted-foreground">{content.finalBoss.description}</p>
                <div className="space-y-1">
                  <div className="text-xs font-medium">Requirements:</div>
                  <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                    {content.finalBoss.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="font-semibold">Reward Structure</div>
          <div className="grid gap-3">
            <div className="bg-muted p-3 rounded-md">
              <div className="font-medium text-sm">XP per Quest: {content.rewardStructure.xpPerQuest}</div>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <div className="font-medium text-sm mb-2">Badges:</div>
              <div className="flex flex-wrap gap-2">
                {content.rewardStructure.badges.map((badge, i) => (
                  <Badge key={i} variant="secondary">{badge}</Badge>
                ))}
              </div>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <div className="font-medium text-sm mb-1">Final Reward:</div>
              <p className="text-sm text-muted-foreground">{content.rewardStructure.finalReward}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="font-semibold">Gamification Elements</div>
          <div className="flex flex-wrap gap-2">
            {content.gamificationElements.map((element, i) => (
              <Badge key={i} variant="outline">{element}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
