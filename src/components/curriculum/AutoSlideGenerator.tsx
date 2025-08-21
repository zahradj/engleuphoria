import React, { useEffect, useState } from 'react';
import { generateGreetingsSlides } from '@/utils/generateGreetingsSlides';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

export const AutoSlideGenerator: React.FC = () => {
  const [status, setStatus] = useState<'generating' | 'success' | 'error' | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const generateSlides = async () => {
      try {
        setStatus('generating');
        setMessage('Generating 25 slides for "Greetings and Introductions"...');
        
        const result = await generateGreetingsSlides();
        
        setStatus('success');
        setMessage(`Successfully generated ${result.total_slides} slides!`);
        
        // Hide success message after 5 seconds
        setTimeout(() => setStatus(null), 5000);
        
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Failed to generate slides');
      }
    };

    generateSlides();
  }, []);

  if (!status) return null;

  return (
    <Alert className={`mb-4 ${
      status === 'success' ? 'border-green-200 bg-green-50' : 
      status === 'error' ? 'border-red-200 bg-red-50' : 
      'border-blue-200 bg-blue-50'
    }`}>
      <div className="flex items-center gap-2">
        {status === 'generating' && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
        {status === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
        {status === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
        
        <AlertDescription className={`${
          status === 'success' ? 'text-green-800' : 
          status === 'error' ? 'text-red-800' : 
          'text-blue-800'
        }`}>
          {message}
        </AlertDescription>
      </div>
    </Alert>
  );
};