
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle } from "lucide-react";

export const FAQ = () => {
  const faqs = [
    {
      question: "What age groups do you teach?",
      answer: "We specialize in children aged 5-16 years old. Our curriculum is designed specifically for young learners with age-appropriate content, interactive activities, and engaging teaching methods that keep kids motivated and excited about learning English."
    },
    {
      question: "Do I need special equipment or software?",
      answer: "You just need a device with internet connection (computer, tablet, or smartphone), a webcam, and a microphone. Our platform works directly in your web browser - no downloads required! We'll send you a technical checklist before your first lesson."
    },
    {
      question: "What if my child misses a lesson?",
      answer: "No worries! You can reschedule lessons up to 4 hours before the start time. We also provide lesson recordings and homework assignments so your child won't fall behind. Our flexible scheduling works around your family's busy life."
    },
    {
      question: "Are your teachers qualified?",
      answer: "Absolutely! All our teachers are certified (CELTA/TESOL), native English speakers, and have extensive experience teaching children. They're specially trained to work with Arabic-speaking students and understand the unique challenges they face."
    },
    {
      question: "How do you track my child's progress?",
      answer: "Our platform provides detailed progress reports, XP tracking, achievement badges, and regular assessments. Parents receive weekly progress updates and can access the dashboard anytime to see their child's learning journey, completed activities, and upcoming goals."
    },
    {
      question: "Can I get a trial lesson?",
      answer: "Yes! We offer a completely free 30-minute trial lesson with one of our certified teachers. This gives you and your child a chance to experience our teaching style, test the technology, and see if we're the right fit before committing to a program."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods including BaridiMob, CIB bank transfers, and international credit cards. All payments are secure and encrypted. We also offer flexible payment plans and family discounts for multiple children."
    },
    {
      question: "What's your cancellation policy?",
      answer: "We offer a 30-day money-back guarantee if you're not completely satisfied. You can cancel or pause your subscription anytime with 24 hours notice. We believe in flexibility because we understand family schedules can change."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200 px-4 py-2">
            ❓ Frequently Asked Questions
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Everything Parents
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Want to Know</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get answers to the most common questions about our English learning program
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 shadow-lg">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-purple-600">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 text-purple-600 flex-shrink-0" />
                      {faq.question}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed pl-8">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>

          <div className="text-center mt-8">
            <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Still Have Questions?</h3>
              <p className="text-gray-600 mb-6">
                Our friendly support team is here to help you and your family get started with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat with Support
                </Button>
                <Button variant="outline" className="border-purple-200 hover:border-purple-300">
                  Schedule a Call
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
