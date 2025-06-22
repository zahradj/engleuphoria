
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const PricingFooter = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center mt-12">
      <p className="text-gray-600 mb-4">
        All plans include access to qualified teachers and interactive lessons.
      </p>
      <Button variant="outline" onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </div>
  );
};
