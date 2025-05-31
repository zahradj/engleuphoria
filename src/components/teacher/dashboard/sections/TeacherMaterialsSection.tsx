
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MaterialItem } from "../MaterialItem";
import { Upload, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TeacherMaterialsSectionProps {
  handlers: {
    handleUploadMaterial: () => void;
    handleUseMaterial: (materialName: string) => void;
  };
}

export const TeacherMaterialsSection = ({ handlers }: TeacherMaterialsSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Teaching Materials</h2>
        <Button onClick={handlers.handleUploadMaterial}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Material
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search materials..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <MaterialItem
              title="Animal Flashcards.pdf"
              type="PDF"
              size="2.4 MB"
              onView={() => handlers.handleUseMaterial("Animal Flashcards.pdf")}
              onUse={() => handlers.handleUseMaterial("Animal Flashcards.pdf")}
            />
            <MaterialItem
              title="Daily Routines Worksheet.pdf"
              type="PDF"
              size="1.8 MB"
              onView={() => handlers.handleUseMaterial("Daily Routines Worksheet.pdf")}
              onUse={() => handlers.handleUseMaterial("Daily Routines Worksheet.pdf")}
            />
            <MaterialItem
              title="Past Tense Exercise.docx"
              type="DOCX"
              size="1.2 MB"
              onView={() => handlers.handleUseMaterial("Past Tense Exercise.docx")}
              onUse={() => handlers.handleUseMaterial("Past Tense Exercise.docx")}
            />
            <MaterialItem
              title="Reading Story - The Lost Dog.pdf"
              type="PDF"
              size="3.1 MB"
              onView={() => handlers.handleUseMaterial("Reading Story - The Lost Dog.pdf")}
              onUse={() => handlers.handleUseMaterial("Reading Story - The Lost Dog.pdf")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
