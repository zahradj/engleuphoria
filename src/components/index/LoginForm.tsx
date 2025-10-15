
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userType, setUserType] = useState('student');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!name.trim()) return;
    
    console.log('=== Login Form Handling ===');
    console.log('Selected userType:', userType);
    console.log('Name:', name);
    
    // Clear all previous user data first
    localStorage.removeItem('studentName');
    localStorage.removeItem('teacherName');
    localStorage.removeItem('adminName');
    localStorage.removeItem('points');
    
    console.log('Cleared previous user data');
    
    // Set the user type first
    localStorage.setItem('userType', userType);
    console.log('Set userType to:', userType);
    
    // Then set the appropriate name
    if (userType === 'admin') {
      localStorage.setItem('adminName', name);
      console.log('Set adminName to:', name);
    } else if (userType === 'teacher') {
      localStorage.setItem('teacherName', name);
      console.log('Set teacherName to:', name);
    } else {
      localStorage.setItem('studentName', name);
      localStorage.setItem('points', '50');
      console.log('Set studentName to:', name);
    }
    
    // Verify what was actually stored
    const storedUserType = localStorage.getItem('userType');
    const storedName = localStorage.getItem(`${userType}Name`);
    console.log('Verification - stored userType:', storedUserType);
    console.log('Verification - stored name:', storedName);
    
    // Dispatch custom event to notify useAuth hook
    console.log('=== Dispatching auth state change event ===');
    window.dispatchEvent(new CustomEvent('authStateChanged'));
    
    // Small delay to ensure auth state is updated before navigation
    setTimeout(() => {
      console.log('=== Navigating to dashboard ===');
      
      // Navigate based on user type
      switch (userType) {
        case 'student':
          console.log('Navigating to student dashboard');
          navigate('/student');
          break;
        case 'teacher':
          console.log('Navigating to teacher dashboard');
          navigate('/teacher');
          break;
        case 'admin':
          console.log('Navigating to admin dashboard');
          navigate('/admin');
          break;
        default:
          console.log('Default: Navigating to student dashboard');
          navigate('/student');
      }
      
      setIsOpen(false);
    }, 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 hover:from-purple-700 hover:via-pink-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse">
          ✨ Try Demo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-purple-200">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent font-bold">
            🎉 Demo Login
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Choose your role and enter your name to explore the platform
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-purple-700">Your Name ✏️</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-purple-700">I am a... 👤</label>
            <Select value={userType} onValueChange={setUserType}>
              <SelectTrigger className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="student">🎓 Student</SelectItem>
                <SelectItem value="teacher">👨‍🏫 Teacher</SelectItem>
                <SelectItem value="admin">⚙️ Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleLogin} 
            className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-300" 
            disabled={!name.trim()}
          >
            🚀 Continue to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
