import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, CheckCircle } from "lucide-react";

interface PhonicsSlideProps {
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

const phonicsWords = [
  { 
    word: "Apple", 
    image: "🍎", 
    sound: "/æ/",
    sentence: "An apple a day keeps the doctor away",
    phonetic: "/ˈæpəl/"
  },
  { 
    word: "Ant", 
    image: "🐜", 
    sound: "/æ/",
    sentence: "The ant is very small",
    phonetic: "/ænt/"
  },
  { 
    word: "Alligator", 
    image: "🐊", 
    sound: "/æ/",
    sentence: "The alligator has big teeth",
    phonetic: "/ˈæləˌɡeɪtər/"
  }
];

export function PhonicsSlide({ onComplete, onNext, isCompleted }: PhonicsSlideProps) {
  const [currentWord, setCurrentWord] = useState(0);
  const [wordsInBasket, setWordsInBasket] = useState<Set<number>>(new Set());
  const [showBasket, setShowBasket] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);

  const word = phonicsWords[currentWord];

  const handleDragStart = (e: React.DragEvent, wordIndex: number) => {
    e.dataTransfer.setData("wordIndex", wordIndex.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const wordIndex = parseInt(e.dataTransfer.getData("wordIndex"));
    
    const newWordsInBasket = new Set(wordsInBasket);
    newWordsInBasket.add(wordIndex);
    setWordsInBasket(newWordsInBasket);
    
    if (newWordsInBasket.size === phonicsWords.length) {
      setAllCompleted(true);
      if (!isCompleted) {
        onComplete();
      }
    }
  };

  const playWordSound = (wordIndex: number) => {
    const wordToPlay = phonicsWords[wordIndex];
    const utterance = new SpeechSynthesisUtterance(wordToPlay.word);
    utterance.rate = 0.7;
    speechSynthesis.speak(utterance);
  };

  const playSentence = (wordIndex: number) => {
    const wordToPlay = phonicsWords[wordIndex];
    const utterance = new SpeechSynthesisUtterance(wordToPlay.sentence);
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const nextWord = () => {
    if (currentWord < phonicsWords.length - 1) {
      setCurrentWord(prev => prev + 1);
    }
  };

  const prevWord = () => {
    if (currentWord > 0) {
      setCurrentWord(prev => prev - 1);
    }
  };

  return (
    <div className="text-center space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🔤 Phonics: Letter Aa
        </h2>
        <p className="text-lg text-gray-600">
          Learn the letter A sound with these words!
        </p>
      </div>

      {/* Letter A Display */}
      <Card className="p-6 bg-gradient-to-r from-red-100 to-orange-100 max-w-md mx-auto">
        <div className="text-6xl font-bold text-red-600 mb-4">Aa</div>
        <div className="text-2xl font-bold text-gray-800 mb-2">
          The "A" Sound: {phonicsWords[0].sound}
        </div>
        <div className="text-gray-600">
          Like the "a" in "cat" or "hat"
        </div>
      </Card>

      {!allCompleted && (
        <>
          {/* Current Word Focus */}
          <Card className="p-8 max-w-2xl mx-auto">
            <div className="space-y-6">
              <div className="text-8xl">{word.image}</div>
              <div className="text-3xl font-bold text-gray-800">{word.word}</div>
              <div className="text-lg text-gray-600">{word.phonetic}</div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => playWordSound(currentWord)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
                >
                  <Volume2 className="w-5 h-5" />
                  Say "{word.word}"
                </Button>
                
                <Button
                  onClick={() => playSentence(currentWord)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Volume2 className="w-5 h-5" />
                  Hear in Sentence
                </Button>
              </div>

              {/* Example Sentence */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-blue-800 mb-1">Example sentence:</div>
                <div className="text-lg font-medium text-blue-900">
                  "{word.sentence}"
                </div>
              </div>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={prevWord}
              disabled={currentWord === 0}
              variant="outline"
            >
              Previous Word
            </Button>
            <Button
              onClick={nextWord}
              disabled={currentWord === phonicsWords.length - 1}
              variant="outline"
            >
              Next Word
            </Button>
          </div>

          {/* Drag and Drop Game */}
          <div className="space-y-6">
            <div className="text-xl font-semibold text-gray-700">
              🎯 Drag the "Aa" words to the basket!
            </div>

            {/* Words to Drag */}
            <div className="flex justify-center gap-4">
              {phonicsWords.map((phoneticWord, index) => (
                <Card
                  key={index}
                  className={`p-4 cursor-grab active:cursor-grabbing transition-all ${
                    wordsInBasket.has(index)
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:shadow-lg hover:scale-105'
                  }`}
                  draggable={!wordsInBasket.has(index)}
                  onDragStart={(e) => handleDragStart(e, index)}
                >
                  <div className="text-4xl mb-2">{phoneticWord.image}</div>
                  <div className="text-lg font-bold text-gray-800">
                    {phoneticWord.word}
                  </div>
                  {wordsInBasket.has(index) && (
                    <CheckCircle className="w-5 h-5 text-green-600 mx-auto mt-2" />
                  )}
                </Card>
              ))}
            </div>

            {/* Basket Drop Zone */}
            <div className="flex justify-center">
              <Card
                className="p-8 border-4 border-dashed border-orange-300 hover:border-orange-500 transition-colors min-h-[120px] min-w-[200px] flex flex-col items-center justify-center"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="text-4xl mb-2">🧺</div>
                <div className="text-xl font-bold text-orange-600">Aa Basket</div>
                <div className="text-sm text-gray-500 mt-1">
                  {wordsInBasket.size}/{phonicsWords.length} words
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      {allCompleted && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <div className="text-2xl font-bold text-green-600 mb-2">
              Fantastic Phonics Work!
            </div>
            <div className="text-lg text-gray-600">
              You've learned the "Aa" sound and three new words!
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-green-800 mb-3">What you learned:</h3>
            <ul className="text-left space-y-2 text-green-700">
              <li className="flex items-center gap-2">
                🍎 <strong>Apple</strong> - /ˈæpəl/ - "An apple a day..."
              </li>
              <li className="flex items-center gap-2">
                🐜 <strong>Ant</strong> - /ænt/ - "The ant is very small"
              </li>
              <li className="flex items-center gap-2">
                🐊 <strong>Alligator</strong> - /ˈæləˌɡeɪtər/ - "The alligator has big teeth"
              </li>
            </ul>
          </div>

          <Button 
            onClick={onNext}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Ready for Spin the Wheel!
          </Button>
        </div>
      )}

      {/* Progress Indicators */}
      <div className="flex justify-center gap-2">
        {phonicsWords.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              wordsInBasket.has(index)
                ? 'bg-green-500'
                : currentWord === index
                ? 'bg-blue-500'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          📚 <strong>Phonics Tip:</strong> All these words start with the same "æ" sound. Listen carefully and practice saying each word clearly!
        </p>
      </div>
    </div>
  );
}