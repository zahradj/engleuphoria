
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Plus, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Student {
  id: string;
  name: string;
  level: string;
  lastClass: string;
  progress: number;
  email: string;
}

const StudentManagement = () => {
  const navigate = useNavigate();
  const { languageText } = useLanguage();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Load students from localStorage or use default data
    const savedStudents = localStorage.getItem("students");
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    } else {
      // Default students data
      const defaultStudents: Student[] = [
        {
          id: "1",
          name: "Alex Johnson",
          level: "Intermediate",
          lastClass: "2025-05-20",
          progress: 78,
          email: "alex.johnson@email.com"
        },
        {
          id: "2",
          name: "Maria Garcia",
          level: "Beginner",
          lastClass: "2025-05-21",
          progress: 45,
          email: "maria.garcia@email.com"
        },
        {
          id: "3",
          name: "Li Wei",
          level: "Advanced",
          lastClass: "2025-05-19",
          progress: 92,
          email: "li.wei@email.com"
        }
      ];
      setStudents(defaultStudents);
      localStorage.setItem("students", JSON.stringify(defaultStudents));
    }
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b py-4">
        <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/teacher-dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-bold">{languageText.students}</h1>
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            {languageText.addStudent}
          </Button>
        </div>
      </header>
      
      <main className="container max-w-7xl mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Student Management</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-medium text-primary">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{student.level}</Badge>
                        <span className="text-xs text-muted-foreground">
                          Last class: {student.lastClass}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{student.progress}%</span>
                        <div className="w-20 h-2 bg-muted rounded">
                          <div 
                            className="h-full bg-primary rounded" 
                            style={{ width: `${student.progress}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentManagement;
