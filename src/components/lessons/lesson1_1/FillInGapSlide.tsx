import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Volume2 } from "lucide-react";

interface FillInGapSlideProps {
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

const sentences = [
  { 
    template: "My name is ____.", 
    placeholder: "your name", 
    example: "Anna",
    audio: "My name is Anna"
  },
  { 
    template: "____ to meet you.", 
    answer: "Nice", 
    audio: "Nice to meet you"
  },
  { 
    template: "____! How are you?", 
    answer: "Hello", 
    audio: "Hello! How are you?"
  }
];

export function FillInGapSlide({ onComplete, onNext, isCompleted }: FillInGapSlideProps) {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);
  const [completedSentences, setCompletedSentences] = useState<Set<number>>(new Set());

  const sentence = sentences[currentSentence];
  const isNameInput = !sentence.answer; // First sentence is name input

  const handleSubmit = () => {
    if (!userInput.trim()) return;

    setSubmitted(true);
    const newCompleted = new Set(completedSentences);
    newCompleted.add(currentSentence);
    setCompletedSentences(newCompleted);

    // Play the completed sentence
    playCompletedSentence();

    setTimeout(() => {
      if (currentSentence < sentences.length - 1) {
        setCurrentSentence(prev => prev + 1);
        setUserInput("");
        setSubmitted(false);
      } else {
        setAllCompleted(true);
        if (!isCompleted) {
          onComplete();
        }
      }
    }, 2500);
  };

  const playCompletedSentence = () => {
    let textToSpeak = sentence.template;
    if (isNameInput) {
      textToSpeak = textToSpeak.replace("____", userInput);
    } else {
      textToSpeak = sentence.audio || textToSpeak.replace("____", userInput);
    }
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const isCorrect = () => {
    if (isNameInput) return true; // Name input is always correct if not empty
    return userInput.toLowerCase().trim() === sentence.answer!.toLowerCase();
  };

  const nextSentence = () => {
    if (currentSentence < sentences.length - 1) {
      setCurrentSentence(prev => prev + 1);
      setUserInput("");
      setSubmitted(false);
    }
  };

  const prevSentence = () => {
    if (currentSentence > 0) {
      setCurrentSentence(prev => prev - 1);
      setUserInput("");
      setSubmitted(false);
    }
  };

  return (
    <div className="text-center space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          ✏️ Fill in the Gap
        </h2>
        <p className="text-lg text-gray-600">
          Complete the sentences with the missing words
        </p>
      </div>

      <div className="text-sm text-gray-500">
        Sentence {currentSentence + 1} of {sentences.length}
      </div>

      {!allCompleted && (
        <>
          {/* Main Sentence Card */}
          <Card className="p-8 max-w-2xl mx-auto">
            <div className="text-3xl font-bold text-gray-800 mb-6">
              {sentence.template.split("____").map((part, index) => (
                <span key={index}>
                  {part}
                  {index < sentence.template.split("____").length - 1 && (
                    <span className="relative">
                      <Input
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={sentence.placeholder || "fill in"}
                        className="inline-block w-48 mx-2 text-center text-2xl font-bold border-2 border-blue-300 focus:border-blue-500"
                        disabled={submitted}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                      />
                    </span>
                  )}
                </span>
              ))}
            </div>

            {!submitted && (
              <Button
                onClick={handleSubmit}
                disabled={!userInput.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Submit Answer
              </Button>
            )}

            {submitted && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  {isCorrect() ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span className="text-green-600 font-semibold text-lg">
                        {isNameInput ? "Perfect! Nice to meet you!" : "Correct!"}
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-orange-600" />
                      <span className="text-orange-600 font-semibold text-lg">
                        Close! The answer is "{sentence.answer}"
                      </span>
                    </>
                  )}
                </div>

                <Button
                  onClick={playCompletedSentence}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  Hear the Complete Sentence
                </Button>
              </div>
            )}
          </Card>

          {/* Navigation */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={prevSentence}
              disabled={currentSentence === 0}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={nextSentence}
              disabled={currentSentence === sentences.length - 1 || !submitted}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </>
      )}

      {allCompleted && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <div className="text-2xl font-bold text-green-600 mb-2">
              Excellent Work!
            </div>
            <div className="text-lg text-gray-600">
              You've completed all the fill-in-the-gap exercises!
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-green-800 mb-3">What you practiced:</h3>
            <ul className="text-left space-y-2 text-green-700">
              <li>✅ Introducing yourself: "My name is..."</li>
              <li>✅ Being polite: "Nice to meet you"</li>
              <li>✅ Starting conversations: "Hello! How are you?"</li>
            </ul>
          </div>

          <Button 
            onClick={onNext}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Ready for Matching Games!
          </Button>
        </div>
      )}

      {/* Progress Indicators */}
      <div className="flex justify-center gap-2">
        {sentences.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              completedSentences.has(index)
                ? 'bg-green-500'
                : currentSentence === index
                ? 'bg-blue-500'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> {
            isNameInput 
              ? "Type your real name or any name you like!"
              : `The missing word is "${sentence.answer}". Think about common greetings!`
          }
        </p>
      </div>
    </div>
  );
}