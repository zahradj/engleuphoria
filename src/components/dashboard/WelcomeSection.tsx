
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface WelcomeSectionProps {
  studentName: string;
}

export function WelcomeSection({ studentName }: WelcomeSectionProps) {
  const navigate = useNavigate();
  const { languageText } = useLanguage();

  return (
    <Card className="bg-gradient-to-r from-purple-light/70 to-teal-light/70 border-none">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {languageText.welcomeUser.replace('{}', studentName)}
            </h2>
            <p className="text-muted-foreground">
              {languageText.readyToLearn}
            </p>
          </div>
          
          <Button className="gap-2" onClick={() => navigate("/classroom/class-1")}>
            {languageText.joinNextClass} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
