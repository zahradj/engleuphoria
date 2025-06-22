import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/index";
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userType, setUserType] = useState('student');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!name.trim()) return;
    
    // Store user info in localStorage for demo purposes
    localStorage.setItem('userType', userType);
    localStorage.setItem(`${userType}Name`, name);
    
    // Navigate based on user type
    switch (userType) {
      case 'student':
        navigate('/student-dashboard');
        break;
      case 'teacher':
        navigate('/teacher-dashboard');
        break;
      case 'admin':
        navigate('/admin-dashboard');
        break;
      default:
        navigate('/student-dashboard');
    }
    
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          Try Demo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Demo Login</DialogTitle>
          <DialogDescription>
            Choose your role and enter your name to explore the platform
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Your Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">I am a...</label>
            <Select value={userType} onValueChange={setUserType}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleLogin} className="w-full" disabled={!name.trim()}>
            Continue to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
