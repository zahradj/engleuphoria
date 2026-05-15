import { useAuth } from '@/contexts/AuthContext';
import { CEFRBar } from './CEFRBar';
import { XPStreakWidget } from './XPStreakWidget';
import { RecapCard } from './RecapCard';
import { useActiveTheme } from '@/hooks/useActiveTheme';
import { Card } from '@/components/ui/card';
import { useHubTheme } from '@/components/dashboard/DashboardShell';

export function DashboardHero() {
  const { user } = useAuth();
  const { data: theme } = useActiveTheme();
  const { gradient } = useHubTheme();

  const name =
    (user as any)?.user_metadata?.first_name ||
    (user as any)?.user_metadata?.full_name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'there';

  return (
    <div className="space-y-4">
      <Card className={`p-6 bg-gradient-to-br ${gradient} border-0 shadow-sm`}>
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Welcome back, {name}!
              </h1>
              {theme && (
                <p className="text-sm text-muted-foreground mt-1">
                  Active Theme this week: <span className="font-medium capitalize">{theme.theme}</span>
                </p>
              )}
            </div>
            <CEFRBar />
          </div>
          <XPStreakWidget />
        </div>
      </Card>

      <RecapCard />
    </div>
  );
}
