
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
        <p className="text-lg text-gray-600 mb-8">
          Start your child's English learning journey with EnglEuphoria today. 
          Join thousands of families who trust us with their children's education.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Start Free Trial
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate("/contact")}
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
};
