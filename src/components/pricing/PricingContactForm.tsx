
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, AlertCircle } from "lucide-react";
import { useFormValidation } from "@/hooks/useFormValidation";

interface PricingContactFormProps {
  formData: {
    name: string;
    email: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PricingContactForm: React.FC<PricingContactFormProps> = ({ 
  formData, 
  onInputChange 
}) => {
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  const { errors, validateSingleField } = useFormValidation({
    name: { 
      required: true, 
      minLength: 2,
      custom: (value) => {
        if (value && !/^[a-zA-Z\s]+$/.test(value)) {
          return "Name can only contain letters and spaces";
        }
        return null;
      }
    },
    email: { required: true, email: true }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onInputChange(e);
    
    if (touched[name]) {
      validateSingleField(name, value);
    }
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateSingleField(name, value);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={errors.name && touched.name ? "border-red-500" : ""}
            required
          />
          {errors.name && touched.name && (
            <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={errors.email && touched.email ? "border-red-500" : ""}
            required
          />
          {errors.email && touched.email && (
            <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
