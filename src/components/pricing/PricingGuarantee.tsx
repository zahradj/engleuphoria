
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, Award } from "lucide-react";

export const PricingGuarantee = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mt-8">
      <Card className="text-center">
        <CardContent className="p-6">
          <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Money-Back Guarantee</h3>
          <p className="text-sm text-gray-600">
            7-day satisfaction guarantee. Not happy? Get a full refund.
          </p>
        </CardContent>
      </Card>
      
      <Card className="text-center">
        <CardContent className="p-6">
          <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Flexible Scheduling</h3>
          <p className="text-sm text-gray-600">
            Book lessons at your convenience. Cancel or reschedule easily.
          </p>
        </CardContent>
      </Card>
      
      <Card className="text-center">
        <CardContent className="p-6">
          <Award className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Certified Teachers</h3>
          <p className="text-sm text-gray-600">
            Learn from qualified, experienced English teachers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
