import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, Crown, Star, Zap } from 'lucide-react';

export const PricingSection = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Basic',
      price: '1,500',
      period: '/month',
      description: 'Perfect for beginners starting their English journey',
      features: [
        '2 one-on-one lessons per month',
        'Basic speaking practice',
        'Access to beginner materials',
        'Progress tracking',
        'Email support'
      ],
      icon: Star,
      popular: false
    },
    {
      name: 'Smart Learner',
      price: '3,000',
      period: '/month',
      description: 'Most popular choice for consistent learning',
      features: [
        '4 one-on-one lessons per month',
        'AI-powered conversation practice',
        'Advanced materials library',
        'Personalized learning path',
        'Community access',
        'Priority support'
      ],
      icon: Crown,
      popular: true
    },
    {
      name: 'Pro Learner',
      price: '5,500',
      period: '/month',
      description: 'Intensive learning for rapid progress',
      features: [
        '8 one-on-one lessons per month',
        'Unlimited speaking practice',
        'Premium materials & resources',
        'Live group classes',
        'Exam preparation support',
        'Dedicated support'
      ],
      icon: Zap,
      popular: false
    }
  ];

  const handleGetStarted = () => {
    navigate('/pricing-selection');
  };

  return (
    <section className="py-24 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-6">
            Choose Your Learning Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start your English learning journey with our flexible pricing plans designed for every learner
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 border-2 transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? 'border-primary bg-gradient-to-b from-primary/10 to-background shadow-xl'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-lg text-muted-foreground ml-1">DA{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={handleGetStarted}
                  className={`w-full ${
                    plan.popular
                      ? 'bg-primary hover:bg-primary/90'
                      : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'
                  }`}
                >
                  Get Started
                </Button>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            All plans include 7-day money-back guarantee
          </p>
          <Button variant="outline" onClick={handleGetStarted}>
            View All Plans & Features
          </Button>
        </div>
      </div>
    </section>
  );
};