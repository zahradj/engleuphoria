import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  BookOpen, 
  Clock, 
  CheckCircle,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlacementTestFlowProps {
  open: boolean;
  onClose: () => void;
  studentName: string;
}

export function PlacementTestFlow({ open, onClose, studentName }: PlacementTestFlowProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'welcome' | 'info' | 'ready'>('welcome');

  const benefits = [
    {
      icon: Target,
      title: 'Personalized Learning Path',
      description: 'Get lessons tailored to your exact level'
    },
    {
      icon: Star,
      title: 'Skip What You Know',
      description: "Don't waste time on material you've already mastered"
    },
    {
      icon: CheckCircle,
      title: 'Track Your Progress',
      description: 'See your improvement from day one'
    }
  ];

  const handleStartTest = () => {
    navigate('/placement-test');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        {step === 'welcome' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                Welcome to Hello English, {studentName}! 🎉
              </DialogTitle>
              <DialogDescription className="text-center text-base pt-2">
                Let's find the perfect starting point for your English learning journey
              </DialogDescription>
            </DialogHeader>

            <div className="py-6">
              <div className="bg-gradient-to-r from-sky-blue/20 to-lavender/20 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Placement Test</h3>
                    <p className="text-sm text-text-muted">15-20 minutes</p>
                  </div>
                </div>
                <p className="text-text-muted">
                  This quick assessment will help us understand your current English level
                  and create a personalized learning plan just for you.
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-surface-soft rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-text mb-1">{benefit.title}</h4>
                      <p className="text-sm text-text-muted">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={onClose}>
                I'll do this later
              </Button>
              <Button onClick={() => setStep('info')} className="bg-primary">
                Let's Get Started
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'info' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                What to Expect
              </DialogTitle>
            </DialogHeader>

            <div className="py-6 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium">Duration: 15-20 minutes</p>
                  <p className="text-text-muted">Take your time, there's no rush</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium">Test Format</p>
                  <p className="text-text-muted">Reading, listening, grammar, and vocabulary questions</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Target className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium">Be Honest</p>
                  <p className="text-text-muted">Answer to the best of your ability - this helps us help you</p>
                </div>
              </div>

              <div className="bg-warning-bg border border-warning-border rounded-lg p-4 mt-6">
                <p className="text-sm text-warning-foreground">
                  <strong>Tip:</strong> Find a quiet place, use headphones if possible, 
                  and make sure you have a stable internet connection.
                </p>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setStep('welcome')}>
                Back
              </Button>
              <Button onClick={() => setStep('ready')} className="bg-primary">
                I'm Ready
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'ready' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center">
                Ready to Begin? 🚀
              </DialogTitle>
            </DialogHeader>

            <div className="py-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sky-blue to-mint-green rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <p className="text-text-muted mb-8 max-w-md mx-auto">
                You're all set! The test will begin immediately when you click "Start Test".
                Remember to answer honestly and take your time.
              </p>
              <div className="bg-surface-soft rounded-lg p-4 max-w-sm mx-auto">
                <p className="text-sm font-medium text-text mb-2">Good luck! 🍀</p>
                <p className="text-xs text-text-muted">
                  You've got this. We're excited to be part of your learning journey!
                </p>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setStep('info')}>
                Back
              </Button>
              <Button onClick={handleStartTest} className="bg-gradient-to-r from-sky-blue-dark to-mint-green-dark text-white">
                Start Test
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
