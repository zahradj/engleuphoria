import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LessonFormData } from "./LessonCreatorModal";

interface StepBasicInfoProps {
  formData: LessonFormData;
  setFormData: (data: LessonFormData) => void;
}

export const StepBasicInfo = ({ formData, setFormData }: StepBasicInfoProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="topic">Lesson Topic *</Label>
        <Input
          id="topic"
          placeholder="e.g., Family Members, Daily Routines, Weather"
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          className="mt-2"
        />
        <p className="text-sm text-muted-foreground mt-1">
          What will this lesson be about?
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="cefrLevel">CEFR Level *</Label>
          <Select 
            value={formData.cefrLevel} 
            onValueChange={(val) => setFormData({ ...formData, cefrLevel: val })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pre-A1">Pre-A1 (Beginner)</SelectItem>
              <SelectItem value="A1">A1 (Elementary)</SelectItem>
              <SelectItem value="A2">A2 (Pre-Intermediate)</SelectItem>
              <SelectItem value="B1">B1 (Intermediate)</SelectItem>
              <SelectItem value="B2">B2 (Upper-Intermediate)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="ageGroup">Age Group *</Label>
          <Select 
            value={formData.ageGroup} 
            onValueChange={(val) => setFormData({ ...formData, ageGroup: val })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5-7">5-7 years (Young Learners)</SelectItem>
              <SelectItem value="8-11">8-11 years (Children)</SelectItem>
              <SelectItem value="12-14">12-14 years (Teens)</SelectItem>
              <SelectItem value="15-17">15-17 years (Older Teens)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="duration">Lesson Duration (minutes)</Label>
        <Select 
          value={formData.duration.toString()} 
          onValueChange={(val) => setFormData({ ...formData, duration: parseInt(val) })}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15 minutes</SelectItem>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="45">45 minutes</SelectItem>
            <SelectItem value="60">60 minutes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
