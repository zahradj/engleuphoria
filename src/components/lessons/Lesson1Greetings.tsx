import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { VocabularyImage } from '@/components/ui/VocabularyImage';
import { Volume2, ArrowLeft, ArrowRight, RotateCcw, Trophy, Star } from 'lucide-react';
import { toast } from 'sonner';

// Import lesson images
import helloImage from '@/assets/lesson-images/hello.png';
import hiImage from '@/assets/lesson-images/hi.png';
import goodbyeImage from '@/assets/lesson-images/goodbye.png';
import appleImage from '@/assets/lesson-images/apple.png';
import appleWordImage from '@/assets/lesson-images/apple-word.png';
import antImage from '@/assets/lesson-images/ant.png';
import antWordImage from '@/assets/lesson-images/ant-word.png';
import spidermanDialogue from '@/assets/lesson-images/spiderman-dialogue.png';
import spongebobDialogue from '@/assets/lesson-images/spongebob-dialogue.png';

interface LessonSlide {
  id: number;
  title: string;
  type: 'warmup' | 'presentation' | 'practice' | 'production' | 'phonics' | 'review' | 'badge';
  content: React.ReactNode;
}

import LessonIntro from './LessonIntro';

const Lesson1Greetings: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(-1); // Start with intro
  const [score, setScore] = useState(0);
  const [studentName, setStudentName] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [completedActivities, setCompletedActivities] = useState<number[]>([]);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const totalSlides = 17;
  const progress = ((currentSlide + 1) / totalSlides) * 100;

  const playSound = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  };

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
      setSelectedItems([]);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setSelectedItems([]);
    }
  };

  const handleCorrectAnswer = () => {
    setScore(score + 10);
    setCompletedActivities([...completedActivities, currentSlide]);
    toast.success("Great job! 🎉");
  };

  const handleIncorrectAnswer = () => {
    toast.error("Try again! 🤔");
  };

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const spins = Math.floor(Math.random() * 4) + 3; // 3-6 full rotations
    const finalRotation = wheelRotation + (spins * 360) + Math.floor(Math.random() * 360);
    setWheelRotation(finalRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      const phrases = ["Hello!", "Goodbye!", "My name is...", "Nice to meet you!"];
      const selectedPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      playSound(selectedPhrase);
      toast.success(`Say: "${selectedPhrase}"`);
    }, 3000);
  };

  // Slide components
  const slides: LessonSlide[] = [
    // Slide 1 - Warm-Up Game
    {
      id: 1,
      title: "Emoji Hello!",
      type: 'warmup',
      content: (
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold text-primary">🎮 Emoji Hello!</h2>
          <p className="text-lg">Drag the right emoji for each greeting!</p>
          <div className="grid grid-cols-2 gap-8">
            <motion.div 
              className="w-32 h-32 cursor-pointer mx-auto"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                playSound("Hello");
                handleCorrectAnswer();
              }}
            >
              <VocabularyImage
                prompt="happy smiling face illustration for greeting"
                alt="Happy face for hello"
                className="w-full h-full rounded-lg"
                style="educational"
              />
            </motion.div>
            <motion.div 
              className="w-32 h-32 cursor-pointer mx-auto"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                playSound("Goodbye");
                handleCorrectAnswer();
              }}
            >
              <VocabularyImage
                prompt="sad face illustration for goodbye"
                alt="Sad face for goodbye"
                className="w-full h-full rounded-lg"
                style="educational"
              />
            </motion.div>
          </div>
          <div className="flex justify-center gap-8">
            <Button onClick={() => playSound("Hello")} className="text-xl px-8 py-4">
              <Volume2 className="mr-2" /> Hello
            </Button>
            <Button onClick={() => playSound("Goodbye")} className="text-xl px-8 py-4">
              <Volume2 className="mr-2" /> Goodbye
            </Button>
          </div>
        </div>
      )
    },

    // Slide 2 - Topic Intro
    {
      id: 2,
      title: "Meet Our Friends!",
      type: 'presentation',
      content: (
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold text-primary">Hello! What's your name?</h2>
          <div className="grid grid-cols-2 gap-8">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <img src={spidermanDialogue} alt="Spider-Man introduction" className="w-full max-w-md mx-auto rounded-lg shadow-lg" />
              <Button onClick={() => playSound("Hello! My name is Spider-Man!")} className="w-full">
                <Volume2 className="mr-2" /> Play Spider-Man
              </Button>
            </motion.div>
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="space-y-4"
            >
              <img src={spongebobDialogue} alt="SpongeBob introduction" className="w-full max-w-md mx-auto rounded-lg shadow-lg" />
              <Button onClick={() => playSound("Hi! My name is SpongeBob!")} className="w-full">
                <Volume2 className="mr-2" /> Play SpongeBob
              </Button>
            </motion.div>
          </div>
        </div>
      )
    },

    // Slide 3 - Greeting Flashcards
    {
      id: 3,
      title: "Greeting Flashcards",
      type: 'practice',
      content: (
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold text-primary">Click to flip the cards!</h2>
          <div className="grid grid-cols-2 gap-6">
            {[
              { front: "Hello", back: helloImage, audio: "Hello" },
              { front: "Hi", back: hiImage, audio: "Hi" },
              { front: "Goodbye", back: goodbyeImage, audio: "Goodbye" },
              { front: "Bye", back: goodbyeImage, audio: "Bye" }
            ].map((card, index) => (
              <motion.div
                key={index}
                className="relative h-48 cursor-pointer"
                onClick={() => {
                  playSound(card.audio);
                  if (!selectedItems.includes(card.front)) {
                    setSelectedItems([...selectedItems, card.front]);
                    if (selectedItems.length === 3) handleCorrectAnswer();
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className={`w-full h-full flex items-center justify-center transition-all duration-300 ${
                  selectedItems.includes(card.front) ? 'bg-green-100 border-green-500' : 'bg-white hover:shadow-lg'
                }`}>
                  {selectedItems.includes(card.front) ? (
                    <img src={card.back} alt={card.front} className="w-24 h-24 object-contain" />
                  ) : (
                    <span className="text-2xl font-bold">{card.front}</span>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },

    // Slide 4 - Listening Challenge
    {
      id: 4,
      title: "Listening Challenge",
      type: 'practice',
      content: (
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold text-primary">Listen and drag the word!</h2>
          <div className="space-y-6">
            <Button 
              onClick={() => playSound("Hello")} 
              className="text-xl px-8 py-4 bg-blue-500 hover:bg-blue-600"
            >
              <Volume2 className="mr-2" /> Play Audio
            </Button>
            <div className="flex justify-center gap-8">
              <motion.div
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                className="bg-yellow-100 border-2 border-yellow-400 px-6 py-3 rounded-lg text-xl font-bold cursor-move"
                whileDrag={{ scale: 1.1, rotate: 5 }}
                onDragEnd={(_, info) => {
                  if (Math.abs(info.offset.x) > 100) {
                    handleCorrectAnswer();
                    playSound("Correct! Hello!");
                  }
                }}
              >
                Hello
              </motion.div>
              <img src={helloImage} alt="Hello" className="w-32 h-32 object-contain border-4 border-dashed border-gray-300 rounded-lg" />
            </div>
          </div>
        </div>
      )
    },

    // Slide 5 - Dialogue Model
    {
      id: 5,
      title: "Learn the Dialogue",
      type: 'presentation',
      content: (
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold text-primary">Perfect Conversation!</h2>
          <div className="bg-blue-50 p-8 rounded-xl max-w-2xl mx-auto">
            <div className="space-y-6 text-left">
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center space-x-4"
              >
                <div className="w-12 h-12">
                  <VocabularyImage
                    prompt="friendly boy character illustration for English learning"
                    alt="Boy character Ed"
                    className="w-full h-full rounded-full"
                    style="cartoon"
                  />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <p className="text-lg"><strong>Ed:</strong> Hello! My name is Ed.</p>
                </div>
                <Button onClick={() => playSound("Hello! My name is Ed.")} size="sm">
                  <Volume2 className="w-4 h-4" />
                </Button>
              </motion.div>
              
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex items-center space-x-4 justify-end"
              >
                <Button onClick={() => playSound("Hi, Ed. My name is Anna. Nice to meet you.")} size="sm">
                  <Volume2 className="w-4 h-4" />
                </Button>
                <div className="bg-pink-100 p-4 rounded-lg shadow-md">
                  <p className="text-lg"><strong>Anna:</strong> Hi, Ed. My name is Anna. Nice to meet you.</p>
                </div>
                <div className="w-12 h-12">
                  <VocabularyImage
                    prompt="friendly girl character illustration for English learning"
                    alt="Girl character Anna"
                    className="w-full h-full rounded-full"
                    style="cartoon"
                  />
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="flex items-center space-x-4"
              >
                <div className="w-12 h-12">
                  <VocabularyImage
                    prompt="friendly boy character illustration for English learning"
                    alt="Boy character Ed"
                    className="w-full h-full rounded-full"
                    style="cartoon"
                  />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <p className="text-lg"><strong>Ed:</strong> Nice to meet you too!</p>
                </div>
                <Button onClick={() => playSound("Nice to meet you too!")} size="sm">
                  <Volume2 className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </div>
          <Button 
            onClick={() => {
              playSound("Hello! My name is Ed. Hi, Ed. My name is Anna. Nice to meet you. Nice to meet you too!");
            }}
            className="mt-4"
          >
            <Volume2 className="mr-2" /> Play Full Dialogue
          </Button>
        </div>
      )
    },

    // Slide 6 - Drag & Drop Practice
    {
      id: 6,
      title: "Drag & Drop Practice",
      type: 'practice',
      content: (
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold text-primary">Drag words to speech bubbles!</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Words</h3>
              {['Hello', 'Hi', 'Goodbye', 'Bye'].map((word, index) => (
                <motion.div
                  key={index}
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  className="bg-blue-100 border-2 border-blue-400 px-4 py-2 rounded-lg text-lg font-bold cursor-move inline-block mx-2"
                  whileDrag={{ scale: 1.1, rotate: 5 }}
                  onClick={() => {
                    if (!selectedItems.includes(word)) {
                      setSelectedItems([...selectedItems, word]);
                      playSound(word);
                      if (selectedItems.length === 3) handleCorrectAnswer();
                    }
                  }}
                >
                  {word}
                </motion.div>
              ))}
            </div>
            <div className="space-y-8">
              <div className="relative">
                <div className="bg-yellow-200 rounded-full p-6 speech-bubble">
                  <span className="text-lg">Meeting someone: ___</span>
                </div>
              </div>
              <div className="relative">
                <div className="bg-red-200 rounded-full p-6 speech-bubble">
                  <span className="text-lg">Leaving: ___</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 7 - Fill-in-the-Gap
    {
      id: 7,
      title: "My Name Is...",
      type: 'practice',
      content: (
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold text-primary">Complete the sentence!</h2>
          <div className="bg-green-50 p-8 rounded-xl max-w-lg mx-auto">
            <div className="text-2xl font-bold mb-6">
              My name is ___
            </div>
            <Input
              type="text"
              placeholder="Type your name here"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="text-xl text-center mb-4"
            />
            <Button 
              onClick={() => {
                if (studentName.trim()) {
                  playSound(`My name is ${studentName}`);
                  handleCorrectAnswer();
                } else {
                  handleIncorrectAnswer();
                }
              }}
              className="text-lg px-8 py-3"
            >
              Say My Name!
            </Button>
          </div>
          <div className="text-lg text-gray-600">
            Example: My name is Maria.
          </div>
        </div>
      )
    },

    // Slide 8 - Matching Game
    {
      id: 8,
      title: "Match Words to Pictures",
      type: 'practice',
      content: (
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold text-primary">Match the greeting to the action!</h2>
          <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Words</h3>
              {[
                { word: 'Hello', correct: 'wave' },
                { word: 'Goodbye', correct: 'leave' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className={`p-4 rounded-lg text-lg font-bold cursor-pointer transition-all ${
                    selectedItems.includes(item.word) ? 'bg-green-200 border-green-500' : 'bg-blue-100 border-blue-300'
                  } border-2`}
                  onClick={() => {
                    if (!selectedItems.includes(item.word)) {
                      setSelectedItems([...selectedItems, item.word]);
                      playSound(item.word);
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.word}
                </motion.div>
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Actions</h3>
              <div className="w-24 h-24 mx-auto mb-4">
                <VocabularyImage
                  prompt="hand waving hello gesture illustration"
                  alt="Waving hand for hello"
                  className="w-full h-full rounded-lg"
                  style="educational"
                />
              </div>
              <div className="text-lg">Waving hand</div>
              <div className="w-24 h-24 mx-auto mb-4">
                <VocabularyImage
                  prompt="person walking away goodbye illustration"
                  alt="Person walking for goodbye"
                  className="w-full h-full rounded-lg"
                  style="educational"
                />
              </div>
              <div className="text-lg">Leaving</div>
            </div>
          </div>
          {selectedItems.length === 2 && (
            <Button onClick={handleCorrectAnswer} className="mt-4">
              Check Answers!
            </Button>
          )}
        </div>
      )
    },

    // Slide 9 - Speaking Drill
    {
      id: 9,
      title: "Speaking Practice",
      type: 'production',
      content: (
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold text-primary">Repeat after me!</h2>
          <div className="bg-purple-50 p-8 rounded-xl max-w-2xl mx-auto">
            <div className="space-y-6">
              {[
                "Hello",
                "My name is ___",
                "Nice to meet you"
              ].map((phrase, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.3 }}
                  className="space-y-4"
                >
                  <div className="text-2xl font-bold p-4 bg-white rounded-lg shadow-md">
                    {phrase}
                  </div>
                  <Button 
                    onClick={() => {
                      const textToSay = phrase.includes('___') ? phrase.replace('___', studentName || 'your name') : phrase;
                      playSound(textToSay);
                    }}
                    className="w-full"
                  >
                    <Volume2 className="mr-2" /> Listen & Repeat
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
          <Button onClick={handleCorrectAnswer} className="bg-green-500 hover:bg-green-600 text-white px-8 py-3">
            I practiced speaking! ✅
          </Button>
        </div>
      )
    },

    // Slide 10 - Role-Play Cards
    {
      id: 10,
      title: "Role-Play Time!",
      type: 'production',
      content: (
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold text-primary">Choose a character to role-play!</h2>
          <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
            <motion.div
              className="cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playSound("Hello! My name is Spider-Man. Nice to meet you!");
                setSelectedItems(['spiderman']);
              }}
            >
              <Card className={`p-6 ${selectedItems.includes('spiderman') ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                <div className="text-6xl mb-4">🕷️</div>
                <h3 className="text-xl font-bold text-red-600">Spider-Man</h3>
                <p className="text-sm text-gray-600 mt-2">Action hero role-play</p>
              </Card>
            </motion.div>
            
            <motion.div
              className="cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                playSound("Hi! My name is SpongeBob. Nice to meet you!");
                setSelectedItems(['spongebob']);
              }}
            >
              <Card className={`p-6 ${selectedItems.includes('spongebob') ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}>
                <div className="text-6xl mb-4">🧽</div>
                <h3 className="text-xl font-bold text-yellow-600">SpongeBob</h3>
                <p className="text-sm text-gray-600 mt-2">Friendly character role-play</p>
              </Card>
            </motion.div>
          </div>
          
          {selectedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 p-6 rounded-xl max-w-md mx-auto"
            >
              <p className="text-lg mb-4">Now practice the dialogue!</p>
              <Button onClick={handleCorrectAnswer} className="w-full">
                I completed the role-play! 🎭
              </Button>
            </motion.div>
          )}
        </div>
      )
    },

    // Slide 11 - Phonics Aa
    {
      id: 11,
      title: "Phonics: Letter Aa",
      type: 'phonics',
      content: (
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold text-primary">Letter Aa Words</h2>
          <div className="text-6xl font-bold text-red-500 mb-6">Aa</div>
          <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
            <motion.div
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              className="cursor-move"
              whileDrag={{ scale: 1.1, rotate: 5 }}
              onClick={() => {
                playSound("Apple starts with A");
                if (!selectedItems.includes('apple')) {
                  setSelectedItems([...selectedItems, 'apple']);
                }
              }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <img src={appleImage} alt="Apple" className="w-24 h-24 mx-auto mb-4" />
                <img src={appleWordImage} alt="Apple word" className="w-32 h-12 mx-auto" />
              </Card>
            </motion.div>
            
            <motion.div
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              className="cursor-move"
              whileDrag={{ scale: 1.1, rotate: 5 }}
              onClick={() => {
                playSound("Ant starts with A");
                if (!selectedItems.includes('ant')) {
                  setSelectedItems([...selectedItems, 'ant']);
                }
              }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <img src={antImage} alt="Ant" className="w-24 h-24 mx-auto mb-4" />
                <img src={antWordImage} alt="Ant word" className="w-32 h-12 mx-auto" />
              </Card>
            </motion.div>
          </div>
          
          <div className="bg-red-100 p-8 rounded-xl border-4 border-dashed border-red-300">
            <div className="text-2xl font-bold text-red-600 mb-4">Aa Basket</div>
            <div className="text-lg">Drag the Aa words here!</div>
          </div>
          
          {selectedItems.length === 2 && (
            <Button onClick={handleCorrectAnswer} className="bg-red-500 hover:bg-red-600 text-white">
              Great! All Aa words collected! 🍎🐜
            </Button>
          )}
        </div>
      )
    },

    // Slide 12 - Spin the Wheel
    {
      id: 12,
      title: "Spin the Wheel!",
      type: 'review',
      content: (
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold text-primary">Spin and Say!</h2>
          <div className="relative mx-auto w-80 h-80">
            <motion.div
              className="w-full h-full rounded-full border-8 border-gray-300 bg-gradient-conic from-red-400 via-yellow-400 via-green-400 via-blue-400 to-red-400 flex items-center justify-center cursor-pointer"
              style={{ rotate: wheelRotation }}
              onClick={spinWheel}
              animate={{ rotate: wheelRotation }}
              transition={{ duration: 3, ease: "easeOut" }}
            >
              <div className="text-center text-white font-bold text-lg bg-black bg-opacity-50 rounded-full p-4">
                <div>🎯</div>
                <div>SPIN</div>
              </div>
            </motion.div>
            
            {/* Wheel segments with text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-sm font-bold text-white">
                <div className="absolute -top-20">Hello</div>
                <div className="absolute -right-20">Goodbye</div>
                <div className="absolute -bottom-20">My name is...</div>
                <div className="absolute -left-20">Nice to meet you</div>
              </div>
            </div>
            
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-black"></div>
            </div>
          </div>
          
          <Button 
            onClick={spinWheel} 
            disabled={isSpinning}
            className="text-xl px-8 py-4"
          >
            {isSpinning ? 'Spinning...' : 'Spin the Wheel!'} 🎡
          </Button>
          
          <div className="text-lg text-gray-600">
            Say the phrase when the wheel stops!
          </div>
        </div>
      )
    },

    // Continue with remaining slides...
    // For brevity, I'll add the final slides structure
    
    // Slide 13-17 would follow similar patterns...
    // Slide 17 - Final Badge
    {
      id: 17,
      title: "Congratulations!",
      type: 'badge',
      content: (
        <div className="text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.5 }}
          >
            <div className="text-8xl mb-6">🏅</div>
          </motion.div>
          
          <h2 className="text-4xl font-bold text-primary">Great Job!</h2>
          <p className="text-xl text-gray-600">You can say hello, your name, and "Nice to meet you!"</p>
          
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-r from-yellow-200 to-yellow-400 p-8 rounded-xl max-w-md mx-auto"
          >
            <Badge className="text-2xl p-4 bg-yellow-500 text-white">
              <Star className="mr-2" />
              Friendly Greeter
            </Badge>
            <div className="mt-4 text-lg">
              Score: {score} points!
            </div>
          </motion.div>
          
          <Button onClick={() => playSound("Congratulations! You completed Lesson 1!")} className="text-xl px-8 py-4">
            <Volume2 className="mr-2" /> Celebrate!
          </Button>
        </div>
      )
    }
  ];

  // Fill in slides 13-16 with similar interactive content
  const additionalSlides: LessonSlide[] = [
    // Slide 13 - Listening & Choose
    {
      id: 13,
      title: "Listening & Choose",
      type: 'practice',
      content: (
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold text-primary">Listen and choose the correct character!</h2>
          <Button onClick={() => playSound("My name is Ed. Nice to meet you.")} className="text-xl px-8 py-4 bg-blue-500">
            <Volume2 className="mr-2" /> Play Audio
          </Button>
          <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                handleCorrectAnswer();
                playSound("Correct! That's Ed!");
              }}
              className="cursor-pointer"
            >
              <Card className="p-6 hover:bg-green-50 transition-colors">
                <div className="text-6xl mb-4">👦</div>
                <div className="text-lg font-bold">Ed</div>
              </Card>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleIncorrectAnswer}
              className="cursor-pointer"
            >
              <Card className="p-6 hover:bg-red-50 transition-colors">
                <div className="text-6xl mb-4">👧</div>
                <div className="text-lg font-bold">Anna</div>
              </Card>
            </motion.div>
          </div>
        </div>
      )
    },

    // Slide 14 - Matching Challenge
    {
      id: 14,
      title: "Matching Challenge",
      type: 'practice',
      content: (
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold text-primary">Match sentences to pictures!</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              {['This is Ed.', 'This is Anna.', 'Nice to meet you.'].map((sentence, index) => (
                <motion.div
                  key={index}
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  className="bg-blue-100 p-4 rounded-lg text-lg font-bold cursor-move"
                  whileDrag={{ scale: 1.1 }}
                  onClick={() => {
                    playSound(sentence);
                    if (!selectedItems.includes(sentence)) {
                      setSelectedItems([...selectedItems, sentence]);
                    }
                  }}
                >
                  {sentence}
                </motion.div>
              ))}
            </div>
            <div className="space-y-8">
              <div className="text-6xl">👦</div>
              <div className="text-6xl">👧</div>
              <div className="text-6xl">🤝</div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 15 - Fill-in Dialogue
    {
      id: 15,
      title: "Complete the Dialogue",
      type: 'practice',
      content: (
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold text-primary">Fill in the names!</h2>
          <div className="bg-gray-50 p-8 rounded-xl max-w-2xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">👦</div>
              <div className="text-lg">
                Ed: Hello! My name is 
                <input className="mx-2 px-2 py-1 border rounded" placeholder="___" />
              </div>
            </div>
            <div className="flex items-center space-x-4 justify-end">
              <div className="text-lg">
                Anna: Hi, 
                <input className="mx-2 px-2 py-1 border rounded" placeholder="___" />
                . Nice to meet you.
              </div>
              <div className="text-4xl">👧</div>
            </div>
          </div>
          <Button onClick={handleCorrectAnswer}>Check Answers!</Button>
        </div>
      )
    },

    // Slide 16 - Review Board Game
    {
      id: 16,
      title: "Review Board Game",
      type: 'review',
      content: (
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold text-primary">Greeting Game Path!</h2>
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              'START', 'Hello!', 'Hi!', 'My name is...',
              'Nice to meet you', 'Goodbye!', 'Bye!', 'FINISH!'
            ].map((step, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-lg text-center font-bold ${
                  selectedItems.includes(step) 
                    ? 'bg-green-200 border-green-500' 
                    : index === 0 || index === 7 
                      ? 'bg-yellow-200 border-yellow-500'
                      : 'bg-blue-100 border-blue-300'
                } border-2 cursor-pointer`}
                onClick={() => {
                  if (step !== 'START' && step !== 'FINISH!') {
                    playSound(step);
                    setSelectedItems([...selectedItems, step]);
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {step}
              </motion.div>
            ))}
          </div>
          <Button onClick={() => setSelectedItems(['dice'])} className="mt-4">
            🎲 Roll Dice & Move!
          </Button>
        </div>
      )
    }
  ];

  // Insert additional slides before the final badge slide
  const allSlides = [
    ...slides.slice(0, -1), // All slides except the last badge slide
    ...additionalSlides,
    slides[slides.length - 1] // The badge slide
  ];

  // Show intro screen first
  if (currentSlide === -1) {
    return <LessonIntro onStart={() => setCurrentSlide(0)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-primary">📘 Lesson 1.1 – Greetings & Self-Introduction</h1>
              <p className="text-gray-600">Unit 0: Getting Started with English</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">Score: {score}</div>
              <Badge variant="secondary">Pre-A1 Level</Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress: Slide {currentSlide + 1} of {allSlides.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>

        {/* Slide Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {allSlides[currentSlide]?.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow-lg p-6">
          <Button 
            onClick={prevSlide} 
            disabled={currentSlide === 0}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <div className="flex items-center space-x-4">
            <Button onClick={() => setCurrentSlide(-1)} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Back to Intro
            </Button>
            <span className="text-sm text-gray-500">
              {allSlides[currentSlide]?.title}
            </span>
          </div>

          <Button 
            onClick={nextSlide}
            disabled={currentSlide === allSlides.length - 1}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Lesson1Greetings;