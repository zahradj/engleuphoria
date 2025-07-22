import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Euro, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { lessonService } from "@/services/lessonService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface EarningsSummary {
  total_earned: number;
  lessons_completed: number;
  pending_penalties: number;
  recent_absences: number;
  can_teach: boolean;
  net_earnings: number;
}

export function TeacherEarningsTracker() {
  const [earnings, setEarnings] = useState<EarningsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!user?.id) return;
      
      try {
        const data = await lessonService.getTeacherEarningsSummary(user.id);
        setEarnings(data);
      } catch (error) {
        console.error('Error fetching teacher earnings:', error);
        toast({
          title: "Error",
          description: "Failed to load earnings summary",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [user?.id, toast]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💰 Earnings & Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!earnings) return null;

  const getPenaltyAlert = () => {
    if (earnings.recent_absences >= 3) {
      return {
        variant: "destructive" as const,
        icon: <XCircle className="h-4 w-4" />,
        title: "Account Suspended",
        description: "Your account has been suspended due to multiple absences. Please contact support."
      };
    }
    
    if (earnings.recent_absences === 2) {
      return {
        variant: "destructive" as const,
        icon: <AlertTriangle className="h-4 w-4" />,
        title: "Final Warning",
        description: "You have 2 absences in the last 30 days. One more absence will result in account suspension."
      };
    }
    
    if (earnings.recent_absences === 1) {
      return {
        variant: "default" as const,
        icon: <AlertTriangle className="h-4 w-4" />,
        title: "Warning Issued",
        description: "You have 1 absence in the last 30 days. Please maintain good attendance."
      };
    }
    
    return null;
  };

  const penaltyAlert = getPenaltyAlert();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          💰 Earnings & Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Account Status */}
        <div className="flex items-center gap-2">
          {earnings.can_teach ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-600 font-medium">Account Active</span>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-600 font-medium">Account Suspended</span>
            </>
          )}
        </div>

        {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <Euro className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-600">€{earnings.total_earned.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total Earned</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <CheckCircle className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{earnings.lessons_completed}</p>
              <p className="text-sm text-muted-foreground">Lessons Completed</p>
            </div>
          </div>
        </div>

        {/* Penalties Section */}
        {earnings.pending_penalties > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-red-600">Pending Penalties</h3>
            <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <span className="text-red-600">Penalty Amount:</span>
              <Badge variant="destructive" className="font-mono">
                -€{earnings.pending_penalties.toFixed(2)}
              </Badge>
            </div>
          </div>
        )}

        {/* Net Earnings */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Gross Earnings:</span>
            <Badge variant="outline" className="font-mono">
              €{earnings.total_earned.toFixed(2)}
            </Badge>
          </div>

          {earnings.pending_penalties > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Penalties:</span>
              <Badge variant="outline" className="font-mono text-red-600">
                -€{earnings.pending_penalties.toFixed(2)}
              </Badge>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-medium">Net Earnings:</span>
            <Badge className={`font-mono ${earnings.net_earnings >= 0 ? '' : 'bg-red-500'}`}>
              €{earnings.net_earnings.toFixed(2)}
            </Badge>
          </div>
        </div>

        {/* Penalty Alert */}
        {penaltyAlert && (
          <Alert variant={penaltyAlert.variant}>
            {penaltyAlert.icon}
            <AlertDescription>
              <strong>{penaltyAlert.title}:</strong> {penaltyAlert.description}
            </AlertDescription>
          </Alert>
        )}

        {/* Payment Policy Reminder */}
        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <p className="font-medium mb-1">💡 Payment Policy</p>
          <p>
            You earn €4 for each completed 25-minute lesson. No payment for no-shows or technical failures. 
            Maintain good attendance to avoid penalties and account suspension.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}