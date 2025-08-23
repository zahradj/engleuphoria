import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CreateAdminTest = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createAdmin = async () => {
    setIsCreating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('admin-create', {
        body: {
          fullName: 'fatima zahra djaanine',
          email: 'f.zahra.djaanine@engleuphoria.com',
          password: 'ENGLEUPHORIA_ADMIN_2024',
          secretKey: 'YOUR_SECRET_KEY_HERE' // You'll need to replace this with the actual secret
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      if (data?.success) {
        toast({
          title: "Success!",
          description: data.message,
          variant: "default"
        });
      } else {
        toast({
          title: "Error",
          description: data?.error || "Failed to create admin",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Error creating admin:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Admin Account</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This will create an admin account for: f.zahra.djaanine@engleuphoria.com
          </p>
          <Button 
            onClick={createAdmin} 
            disabled={isCreating}
            className="w-full"
          >
            {isCreating ? 'Creating Admin...' : 'Create Admin'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAdminTest;