import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StudentProfile } from "@/types/curriculum";
import { Plus, Edit, Trash, User } from "lucide-react";

interface StudentProfileFormProps {
  students: StudentProfile[];
}

export function StudentProfileForm({ students }: StudentProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    age: 8,
    cefrLevel: "A1" as StudentProfile['cefrLevel'],
    strengths: "",
    gaps: "",
    learningStyle: "Visual" as StudentProfile['learningStyle'],
    interests: "",
    weeklyMinutes: 100,
    longTermGoal: "",
    parentEmail: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to database
    console.log("Saving student profile:", formData);
    setIsEditing(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      age: 8,
      cefrLevel: "A1",
      strengths: "",
      gaps: "",
      learningStyle: "Visual",
      interests: "",
      weeklyMinutes: 100,
      longTermGoal: "",
      parentEmail: ""
    });
    setEditingStudent(null);
  };

  const editStudent = (student: StudentProfile) => {
    setFormData({
      name: student.name,
      age: student.age,
      cefrLevel: student.cefrLevel,
      strengths: student.strengths.join(", "),
      gaps: student.gaps.join(", "),
      learningStyle: student.learningStyle,
      interests: student.interests.join(", "),
      weeklyMinutes: student.weeklyMinutes,
      longTermGoal: student.longTermGoal,
      parentEmail: student.parentContact.email
    });
    setEditingStudent(student);
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Student Profiles</h3>
        <Button onClick={() => setIsEditing(true)}>
          <Plus size={16} className="mr-2" />
          Add Student
        </Button>
      </div>

      {/* Student List */}
      <div className="grid gap-4">
        {students.map((student) => (
          <Card key={student.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User size={20} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">{student.name}</h4>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline">{student.cefrLevel}</Badge>
                    <Badge variant="secondary">Age {student.age}</Badge>
                    <Badge variant="outline">{student.learningStyle}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => editStudent(student)}>
                  <Edit size={14} />
                </Button>
                <Button size="sm" variant="outline">
                  <Trash size={14} />
                </Button>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-sm text-gray-600">
              <p><strong>Interests:</strong> {student.interests.join(", ")}</p>
              <p><strong>Weekly Time:</strong> {student.weeklyMinutes} minutes</p>
              <p><strong>Goal:</strong> {student.longTermGoal}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Form */}
      {isEditing && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">
              {editingStudent ? "Edit Student Profile" : "Add New Student"}
            </h4>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Student Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="5"
                  max="18"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="level">CEFR Level</Label>
                <Select value={formData.cefrLevel} onValueChange={(value: StudentProfile['cefrLevel']) => setFormData({...formData, cefrLevel: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A1">A1 - Beginner</SelectItem>
                    <SelectItem value="A2">A2 - Elementary</SelectItem>
                    <SelectItem value="B1">B1 - Intermediate</SelectItem>
                    <SelectItem value="B2">B2 - Upper-Intermediate</SelectItem>
                    <SelectItem value="C1">C1 - Advanced</SelectItem>
                    <SelectItem value="C2">C2 - Proficient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="style">Learning Style</Label>
                <Select value={formData.learningStyle} onValueChange={(value: StudentProfile['learningStyle']) => setFormData({...formData, learningStyle: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Visual">Visual</SelectItem>
                    <SelectItem value="Auditory">Auditory</SelectItem>
                    <SelectItem value="Kinesthetic">Kinesthetic</SelectItem>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="interests">Interests (comma-separated)</Label>
              <Input
                id="interests"
                value={formData.interests}
                onChange={(e) => setFormData({...formData, interests: e.target.value})}
                placeholder="Animals, Music, Sports"
              />
            </div>

            <div>
              <Label htmlFor="strengths">Strengths (comma-separated)</Label>
              <Input
                id="strengths"
                value={formData.strengths}
                onChange={(e) => setFormData({...formData, strengths: e.target.value})}
                placeholder="Visual learning, Creative activities"
              />
            </div>

            <div>
              <Label htmlFor="gaps">Learning Gaps (comma-separated)</Label>
              <Input
                id="gaps"
                value={formData.gaps}
                onChange={(e) => setFormData({...formData, gaps: e.target.value})}
                placeholder="Grammar structures, Speaking confidence"
              />
            </div>

            <div>
              <Label htmlFor="goal">Long-term Goal</Label>
              <Textarea
                id="goal"
                value={formData.longTermGoal}
                onChange={(e) => setFormData({...formData, longTermGoal: e.target.value})}
                placeholder="What should the student achieve by the end of the program?"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minutes">Weekly Minutes</Label>
                <Input
                  id="minutes"
                  type="number"
                  min="30"
                  max="300"
                  value={formData.weeklyMinutes}
                  onChange={(e) => setFormData({...formData, weeklyMinutes: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="email">Parent Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) => setFormData({...formData, parentEmail: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit">
                {editingStudent ? "Update Student" : "Add Student"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
