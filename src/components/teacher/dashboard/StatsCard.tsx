
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export const StatsCard = ({ title, value, icon }: StatsCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="bg-primary/10 p-3 rounded-full">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);
