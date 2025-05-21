
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/AnimatedButton";

interface LoginFormProps {
  onSubmit: (name: string) => void;
  onGoBack: () => void;
  name: string;
  setName: (name: string) => void;
}

export const LoginForm = ({ onSubmit, onGoBack, name, setName }: LoginFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6 animate-fade-in">
        <h2 className="text-2xl font-bold mb-2">Welcome to Engleuphoria!</h2>
        <p className="text-muted-foreground">Let's start with your name</p>
      </div>
      
      <Card className="p-6 animate-scale-in">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                What's your name?
              </label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-lg"
              />
            </div>
            
            <AnimatedButton type="submit" className="w-full" animationType="scale">
              Continue
            </AnimatedButton>
          </div>
        </form>
      </Card>
      
      <div className="mt-4 text-center">
        <Button variant="ghost" onClick={onGoBack}>
          Go Back
        </Button>
      </div>
    </div>
  );
};
