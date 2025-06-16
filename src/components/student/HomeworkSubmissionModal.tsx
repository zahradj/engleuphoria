
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HomeworkSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentTitle: string;
  onSubmit: (submission: { text: string; files: File[] }) => void;
}

export const HomeworkSubmissionModal = ({ 
  isOpen, 
  onClose, 
  assignmentTitle, 
  onSubmit 
}: HomeworkSubmissionModalProps) => {
  const [textResponse, setTextResponse] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!textResponse.trim() && files.length === 0) {
      toast({
        title: "No Content",
        description: "Please add some text or upload a file.",
        variant: "destructive"
      });
      return;
    }

    onSubmit({ text: textResponse, files });
    setTextResponse("");
    setFiles([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit Homework: {assignmentTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="response">Written Response</Label>
            <Textarea
              id="response"
              placeholder="Type your homework response here..."
              value={textResponse}
              onChange={(e) => setTextResponse(e.target.value)}
              rows={6}
              className="mt-1"
            />
          </div>

          <div>
            <Label>File Upload</Label>
            <div className="mt-1">
              <Input
                type="file"
                multiple
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                className="mb-2"
              />
              
              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1 bg-green-500 hover:bg-green-600">
              <Upload className="h-4 w-4 mr-2" />
              Submit Homework
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
