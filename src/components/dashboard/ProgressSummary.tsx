
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';

interface ProgressSummaryProps {
  weeklyActivities: { completed: number, total: number };
  classesAttended: number;
  points: number;
}

export function ProgressSummary({ weeklyActivities, classesAttended, points }: ProgressSummaryProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{t('yourProgress')}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{t('thisWeekActivities')}</span>
              <span className="text-sm font-medium">{weeklyActivities.completed}/{weeklyActivities.total}</span>
            </div>
            <div className="h-2 bg-muted rounded-full">
              <div 
                className="h-full rounded-full bg-purple" 
                style={{ width: `${(weeklyActivities.completed / weeklyActivities.total) * 100}%` }} 
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{t('classesAttended')}</span>
              <span className="text-sm font-medium">{classesAttended}</span>
            </div>
            <div className="h-2 bg-muted rounded-full">
              <div 
                className="h-full rounded-full bg-teal" 
                style={{ width: "40%" }} 
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{t('pointsEarned')}</span>
              <span className="text-sm font-medium">{points}</span>
            </div>
            <div className="h-2 bg-muted rounded-full">
              <div 
                className="h-full rounded-full bg-yellow" 
                style={{ width: "50%" }} 
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
