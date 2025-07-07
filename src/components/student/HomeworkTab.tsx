
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Clock, CheckCircle } from "lucide-react";

interface HomeworkTabProps {
  points: number;
  setPoints: (points: number) => void;
}

export const HomeworkTab = ({ points, setPoints }: HomeworkTabProps) => {
  const assignments: any[] = [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Homework Assignments</h1>
      
      <div className="grid gap-4">
        {assignments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Homework Assignments</h3>
              <p className="text-gray-500">You don't have any homework assignments at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          assignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={assignment.status === 'submitted' ? 'default' : 'secondary'}>
                      {assignment.status === 'submitted' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {assignment.status}
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      {assignment.points} pts
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{assignment.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>Due: {assignment.dueDate}</span>
                  </div>
                  
                  {assignment.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-1" />
                        Upload File
                      </Button>
                      <Button size="sm" className="bg-green-500 hover:bg-green-600">
                        <FileText className="h-4 w-4 mr-1" />
                        Submit
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
