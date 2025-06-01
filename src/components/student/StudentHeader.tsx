
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface StudentHeaderProps {
  studentName: string;
  points: number;
  onLogout: () => void;
}

export const StudentHeader = ({ studentName, points, onLogout }: StudentHeaderProps) => {
  const { languageText } = useLanguage();

  return (
    <header className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white shadow-2xl relative overflow-hidden">
      {/* Playful background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-300/20 rounded-full translate-y-24 -translate-x-24"></div>
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-green-300/20 rounded-full animate-bounce"></div>
      
      <div className="container max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-white/40 shadow-2xl ring-4 ring-yellow-300/50">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-2xl font-bold">
                  {studentName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold animate-bounce">
                🔥 5
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                Hey {studentName}! 🌟
              </h1>
              <p className="text-blue-100 text-lg mb-3">Intermediate Level • General English Course</p>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className="bg-yellow-400 text-yellow-900 border-yellow-300 px-3 py-1 animate-pulse">
                  🎯 Learning Star
                </Badge>
                <Badge className="bg-green-400 text-green-900 border-green-300 px-3 py-1">
                  🔥 5 Day Streak
                </Badge>
                <Badge className="bg-purple-400 text-purple-900 border-purple-300 px-3 py-1">
                  🏆 3 Achievements
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right bg-white/20 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/30">
              <div className="flex items-center gap-2 text-yellow-300 mb-1">
                <Star className="h-6 w-6 fill-current animate-spin" />
                <span className="text-3xl font-bold">{points}</span>
              </div>
              <p className="text-xs text-blue-100">Learning Points</p>
              <div className="text-xs text-green-300 mt-1">🎉 +50 today!</div>
            </div>
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="bg-white/20 text-white border-2 border-white/40 hover:bg-white/30 px-6"
            >
              {languageText.logout || "Logout"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
