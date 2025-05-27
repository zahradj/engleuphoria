
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";

interface ClassCardProps {
  title: string;
  time: string;
  students: number;
  buttonText: string;
  onButtonClick: () => void;
}

export const ClassCard = ({ title, time, students, buttonText, onButtonClick }: ClassCardProps) => (
  <Card className="overflow-hidden">
    <div className="bg-primary/10 p-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="flex items-center gap-2 mt-1">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{time}</p>
      </div>
    </div>
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm">{students} students</p>
        </div>
      </div>
      <Button className="w-full" size="sm" onClick={onButtonClick}>
        {buttonText}
      </Button>
    </CardContent>
  </Card>
);
