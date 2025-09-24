import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, Mic, Play, Square } from "lucide-react";

interface SpeakingDrillSlideProps {
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

const drillPhrases = [
  { text: "Hello", phonetic: "/həˈloʊ/", tip: "Say 'huh-LOW' with stress on 'LOW'" },
  { text: "My name is Anna", phonetic: "/maɪ neɪm ɪz ˈænə/", tip: "Say 'MY name iz AN-nah'" },
  { text: "Nice to meet you", phonetic: "/naɪs tu mit ju/", tip: "Say 'NICE to MEET you'" },
  { text: "Hello, my name is Anna. Nice to meet you.", phonetic: "Full sentence", tip: "Put it all together smoothly" },
];

export function SpeakingDrillSlide({ onComplete, onNext, isCompleted }: SpeakingDrillSlideProps) {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState<Set<number>>(new Set());
  const [isListening, setIsListening] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);

  const phrase = drillPhrases[currentPhrase];

  const playModel = () => {
    const utterance = new SpeechSynthesisUtterance(phrase.text);
    utterance.rate = 0.7; // Slower for learning
    utterance.pitch = 1.1;
    speechSynthesis.speak(utterance);
  };

  const startRecording = () => {
    setIsRecording(true);
    
    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false);
      const newRecorded = new Set(hasRecorded);
      newRecorded.add(currentPhrase);
      setHasRecorded(newRecorded);
      
      // Check if all phrases have been practiced
      if (newRecorded.size === drillPhrases.length) {
        setAllCompleted(true);
        if (!isCompleted) {
          onComplete();
        }
      }
    }, 3000);
  };

  const nextPhrase = () => {
    if (currentPhrase < drillPhrases.length - 1) {
      setCurrentPhrase(prev => prev + 1);
    }
  };

  const prevPhrase = () => {
    if (currentPhrase > 0) {
      setCurrentPhrase(prev => prev - 1);
    }
  };

  const startListeningPractice = () => {
    setIsListening(true);
    
    // Auto-play each phrase with pauses for repetition
    drillPhrases.forEach((phrase, index) => {
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(phrase.text);
        utterance.rate = 0.7;
        utterance.pitch = 1.1;
        speechSynthesis.speak(utterance);
        
        if (index === drillPhrases.length - 1) {
          setTimeout(() => {
            setIsListening(false);
          }, 2000);
        }
      }, index * 4000);
    });
  };

  return (
    <div className="text-center space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🗣️ Speaking Drill
        </h2>
        <p className="text-lg text-gray-600">
          Listen, repeat, and practice perfect pronunciation!
        </p>
      </div>

      <div className="text-sm text-gray-500">
        Phrase {currentPhrase + 1} of {drillPhrases.length}
      </div>

      {!allCompleted && (
        <>
          {/* Main Practice Card */}
          <Card className="p-8 max-w-2xl mx-auto">
            <div className="space-y-6">
              {/* Phrase Display */}
              <div className="text-3xl font-bold text-gray-800">
                "{phrase.text}"
              </div>
              
              {/* Phonetic Guide */}
              <div className="text-lg text-gray-600">
                <strong>Pronunciation:</strong> {phrase.phonetic}
              </div>
              
              {/* Tip */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  💡 <strong>Tip:</strong> {phrase.tip}
                </p>
              </div>

              {/* Practice Buttons */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={playModel}
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 flex items-center gap-2"
                >
                  <Volume2 className="w-5 h-5" />
                  Listen to Model
                </Button>
                
                <Button
                  onClick={startRecording}
                  disabled={isRecording}
                  variant="outline"
                  className={`flex items-center gap-2 ${
                    isRecording ? 'bg-red-100 border-red-500' : ''
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Square className="w-5 h-5 text-red-600" />
                      Recording...
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      Practice Speaking
                    </>
                  )}
                </Button>
              </div>

              {/* Recording Feedback */}
              {isRecording && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-700 font-medium">
                      Recording... Say the phrase clearly!
                    </span>
                  </div>
                </div>
              )}

              {hasRecorded.has(currentPhrase) && !isRecording && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-green-700 font-medium">
                    ✅ Great job! You've practiced this phrase.
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={prevPhrase}
              disabled={currentPhrase === 0}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={nextPhrase}
              disabled={currentPhrase === drillPhrases.length - 1}
              variant="outline"
            >
              Next
            </Button>
          </div>

          {/* Quick Listen Practice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <Button
              onClick={startListeningPractice}
              disabled={isListening}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isListening ? "Playing all phrases..." : "Quick Listen Practice"}
            </Button>
            <p className="text-sm text-blue-700 mt-2">
              Listen to all phrases in sequence for quick review
            </p>
          </div>
        </>
      )}

      {allCompleted && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🎤</div>
            <div className="text-2xl font-bold text-green-600 mb-2">
              Excellent Speaking Practice!
            </div>
            <div className="text-lg text-gray-600">
              You've practiced all the key phrases!
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-green-800 mb-3">What you practiced:</h3>
            <ul className="text-left space-y-2 text-green-700">
              {drillPhrases.map((phrase, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  "{phrase.text}"
                </li>
              ))}
            </ul>
          </div>

          <Button 
            onClick={onNext}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Ready for Role Play!
          </Button>
        </div>
      )}

      {/* Progress Indicators */}
      <div className="flex justify-center gap-2">
        {drillPhrases.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              hasRecorded.has(index)
                ? 'bg-green-500'
                : currentPhrase === index
                ? 'bg-blue-500'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-sm text-purple-800">
          🎯 <strong>Speaking Tips:</strong> Listen carefully to the model, then speak clearly and slowly. Don't worry about being perfect - practice makes progress!
        </p>
      </div>
    </div>
  );
}