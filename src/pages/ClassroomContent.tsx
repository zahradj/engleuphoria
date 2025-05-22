
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { QuizContainer } from "@/components/assessment/QuizContainer";
import { InteractiveStory } from "@/components/interactive/InteractiveStory";
import { LearningPath } from "@/components/gamification/LearningPath";
import { ClassroomStudents } from "@/components/classroom/ClassroomStudents";
import { Book, PlayCircle, LayoutGrid, Award, BookOpen, MessageCircle, Video } from "lucide-react";

// This component handles the content tabs in the classroom
export function ClassroomContent() {
  const { languageText } = useLanguage();
  const [vocabPoints, setVocabPoints] = useState(0);
  
  // Demo data for various components
  const quizQuestions = [
    {
      id: "q1",
      question: "What sound does a dog make?",
      options: [
        { id: "a", text: "Meow", isCorrect: false },
        { id: "b", text: "Woof", isCorrect: true },
        { id: "c", text: "Moo", isCorrect: false },
        { id: "d", text: "Quack", isCorrect: false },
      ],
      type: "multiple-choice" as const,
    },
    {
      id: "q2",
      question: "What color is a banana?",
      options: [
        { id: "a", text: "Red", isCorrect: false },
        { id: "b", text: "Blue", isCorrect: false },
        { id: "c", text: "Yellow", isCorrect: true },
        { id: "d", text: "Green", isCorrect: false },
      ],
      type: "multiple-choice" as const,
    },
    {
      id: "q3",
      question: "Which of these is a fruit?",
      options: [
        { id: "a", text: "Carrot", isCorrect: false },
        { id: "b", text: "Apple", isCorrect: true },
        { id: "c", text: "Potato", isCorrect: false },
        { id: "d", text: "Broccoli", isCorrect: false },
      ],
      type: "multiple-choice" as const,
    },
  ];
  
  const storyScenes = [
    {
      id: "scene1",
      title: "The Friendly Lion",
      content: "Once upon a time, there was a friendly lion named Leo. Leo lived in the jungle but he was different from other lions. He didn't want to hunt. He wanted to make friends!",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=lion",
      vocabularyWords: [
        { word: "friendly", translation: "amistoso", example: "The friendly dog wagged its tail." },
        { word: "jungle", translation: "selva", example: "Many animals live in the jungle." },
      ],
      choices: [
        {
          id: "c1",
          text: "Leo decides to visit the river",
          nextSceneId: "scene2",
          vocabularyWords: ["river"],
        },
        {
          id: "c2",
          text: "Leo stays in his cave",
          nextSceneId: "scene3",
        },
      ],
    },
    {
      id: "scene2",
      title: "At the River",
      content: "Leo went to the river. The water was blue and clear. He saw fish swimming and birds drinking water. 'Hello!' said Leo. But the animals ran away because they were afraid.",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=river",
      vocabularyWords: [
        { word: "river", translation: "río", example: "We swim in the river during summer." },
        { word: "afraid", translation: "asustado", example: "The mouse was afraid of the cat." },
      ],
      choices: [
        {
          id: "c3",
          text: "Leo feels sad and goes home",
          nextSceneId: "scene4",
          vocabularyWords: ["sad"],
        },
        {
          id: "c4",
          text: "Leo sings a happy song",
          nextSceneId: "scene5",
          vocabularyWords: ["happy", "song"],
        },
      ],
    },
    {
      id: "scene3",
      title: "In the Cave",
      content: "Leo stayed in his cave. It was dark and boring. 'I need friends,' thought Leo. Suddenly, he heard a small voice outside.",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=cave",
      vocabularyWords: [
        { word: "cave", translation: "cueva", example: "Bears often sleep in caves." },
        { word: "boring", translation: "aburrido", example: "The movie was boring." },
      ],
      choices: [
        {
          id: "c5",
          text: "Leo goes outside to check",
          nextSceneId: "scene6",
        },
        {
          id: "c6",
          text: "Leo ignores the voice",
          nextSceneId: "scene7",
          vocabularyWords: ["ignore"],
        },
      ],
    },
    {
      id: "scene4",
      title: "Going Home Sad",
      content: "Leo went home feeling very sad. 'Nobody wants to be my friend,' he thought. As he walked, he didn't notice a small rabbit following him.",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=sad",
      vocabularyWords: [
        { word: "sad", translation: "triste", example: "She was sad when her toy broke." },
        { word: "notice", translation: "darse cuenta", example: "Did you notice the bird on the tree?" },
      ],
      choices: [
        {
          id: "c7",
          text: "Leo turns around and sees the rabbit",
          nextSceneId: "scene8",
        },
        {
          id: "c8",
          text: "Leo continues walking home",
          nextSceneId: "scene9",
        },
      ],
    },
    {
      id: "scene8",
      title: "A New Friend",
      content: "Leo turned around and saw the small rabbit. 'Hello,' said Leo softly. 'I'm Leo.' The rabbit was scared at first but then said, 'I'm Ruby. Would you like to be friends?' Leo smiled. He had made his first friend!",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=friend",
      vocabularyWords: [
        { word: "softly", translation: "suavemente", example: "She spoke softly to the baby." },
        { word: "scared", translation: "asustado", example: "The child was scared of the thunder." },
      ],
      isEnding: true,
      choices: [],
    }
  ];
  
  const learningPath = {
    title: "Animal Vocabulary Journey",
    description: "Learn all about animals through engaging activities",
    milestones: [
      {
        id: "learning-intro",
        title: "Introduction to Animals",
        description: "Learn basic animal names and sounds",
        isCompleted: true,
        isLocked: false,
        points: 50,
        activities: [
          {
            id: "activity-1",
            title: "Animal Flashcards",
            type: "game",
            isCompleted: true,
            duration: 10,
          },
          {
            id: "activity-2",
            title: "Animal Sounds Quiz",
            type: "quiz",
            isCompleted: true,
            duration: 5,
          },
          {
            id: "activity-3",
            title: "Animal Habitats",
            type: "video",
            isCompleted: true,
            duration: 8,
          },
        ],
      },
      {
        id: "learning-farm",
        title: "Farm Animals",
        description: "Learn about farm animals and their characteristics",
        isCompleted: false,
        isLocked: false,
        points: 75,
        activities: [
          {
            id: "activity-4",
            title: "Farm Animal Vocabulary",
            type: "reading",
            isCompleted: true,
            duration: 12,
          },
          {
            id: "activity-5",
            title: "Farm Animal Matching Game",
            type: "game",
            isCompleted: false,
            duration: 10,
          },
          {
            id: "activity-6",
            title: "Farm Animal Sounds Practice",
            type: "practice",
            isCompleted: false,
            duration: 7,
          },
        ],
      },
      {
        id: "learning-wild",
        title: "Wild Animals",
        description: "Learn about wildlife and jungle creatures",
        isCompleted: false,
        isLocked: false,
        points: 100,
        activities: [
          {
            id: "activity-7",
            title: "Jungle Animal Vocabulary",
            type: "reading",
            isCompleted: false,
            duration: 15,
          },
          {
            id: "activity-8",
            title: "Wild Animal Quiz",
            type: "quiz",
            isCompleted: false,
            duration: 10,
          },
        ],
      },
      {
        id: "learning-advanced",
        title: "Advanced Animal Knowledge",
        description: "Learn advanced facts about animals",
        isCompleted: false,
        isLocked: true,
        points: 150,
        activities: [
          {
            id: "activity-9",
            title: "Animal Classification",
            type: "video",
            isCompleted: false,
            duration: 15,
          },
          {
            id: "activity-10",
            title: "Animal Adaptations",
            type: "reading",
            isCompleted: false,
            duration: 20,
          },
          {
            id: "activity-11",
            title: "Animal Facts Challenge",
            type: "quiz",
            isCompleted: false,
            duration: 15,
          },
        ],
      },
    ],
  };
  
  const classStudents = [
    {
      id: "student1",
      name: "Emma Johnson",
      points: 450,
      status: "online",
      handRaised: true,
      micEnabled: true,
      cameraEnabled: false,
      progress: {
        vocabulary: 75,
        grammar: 60,
        listening: 80,
        speaking: 65,
        reading: 70,
      },
    },
    {
      id: "student2",
      name: "Liam Taylor",
      points: 380,
      status: "online",
      handRaised: false,
      micEnabled: false,
      cameraEnabled: true,
      progress: {
        vocabulary: 65,
        grammar: 70,
        listening: 60,
        speaking: 55,
        reading: 75,
      },
    },
    {
      id: "student3",
      name: "Olivia Brown",
      points: 420,
      status: "online",
      handRaised: false,
      micEnabled: true,
      cameraEnabled: true,
      progress: {
        vocabulary: 80,
        grammar: 65,
        listening: 70,
        speaking: 60,
        reading: 85,
      },
    },
    {
      id: "student4",
      name: "Noah Smith",
      points: 350,
      status: "idle",
      handRaised: false,
      micEnabled: false,
      cameraEnabled: false,
      lastActive: "5 min ago",
      progress: {
        vocabulary: 55,
        grammar: 60,
        listening: 65,
        speaking: 50,
        reading: 60,
      },
    },
    {
      id: "student5",
      name: "Sophia Garcia",
      points: 405,
      status: "offline",
      handRaised: false,
      micEnabled: false,
      cameraEnabled: false,
      lastActive: "15 min ago",
      progress: {
        vocabulary: 70,
        grammar: 75,
        listening: 60,
        speaking: 65,
        reading: 80,
      },
    },
    {
      id: "student6",
      name: "Jackson Miller",
      points: 390,
      status: "offline",
      handRaised: false,
      micEnabled: false,
      cameraEnabled: false,
      lastActive: "30 min ago",
      progress: {
        vocabulary: 65,
        grammar: 60,
        listening: 75,
        speaking: 70,
        reading: 65,
      },
    },
  ];
  
  // Event handlers
  const handleQuizComplete = (score: number, total: number) => {
    const points = score * 10;
    setVocabPoints(prev => prev + points);
    
    // In a real app, we would send this to an API
    console.log(`Quiz completed with score: ${score}/${total}`);
  };
  
  const handleStoryComplete = () => {
    setVocabPoints(prev => prev + 25);
    console.log("Story completed!");
  };
  
  const handleVocabLearned = (newWords: string[]) => {
    const points = newWords.length * 5;
    setVocabPoints(prev => prev + points);
    console.log(`Learned ${newWords.length} new words! +${points} points`);
  };
  
  const handleStartActivity = (milestoneId: string, activityId: string) => {
    console.log(`Starting activity ${activityId} from milestone ${milestoneId}`);
    // In a real app, we would load the activity content
  };
  
  const handleMessageStudent = (studentId: string) => {
    console.log(`Opening message dialog for student ${studentId}`);
    // In a real app, we would open a message dialog
  };
  
  const handleToggleSpotlight = (studentId: string) => {
    console.log(`Toggling spotlight for student ${studentId}`);
    // In a real app, we would feature this student's video
  };

  return (
    <Tabs defaultValue="lesson">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="lesson" className="flex items-center gap-1.5">
          <LayoutGrid size={16} />
          <span>{languageText.lessonContent}</span>
        </TabsTrigger>
        <TabsTrigger value="activities" className="flex items-center gap-1.5">
          <Award size={16} />
          <span>{languageText.activities}</span>
        </TabsTrigger>
        <TabsTrigger value="learning-path" className="flex items-center gap-1.5">
          <BookOpen size={16} />
          <span>{languageText.learningPath}</span>
        </TabsTrigger>
        <TabsTrigger value="students" className="flex items-center gap-1.5">
          <Video size={16} />
          <span>{languageText.students}</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="lesson" className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-bold mb-2">Animal Sounds</h2>
            <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <PlayCircle className="mx-auto h-12 w-12 text-muted-foreground/60 mb-2" />
                <p className="text-muted-foreground">{languageText.clickToPlayVideo}</p>
                <Button className="mt-2">{languageText.play}</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-4">
              <Button variant="outline" className="flex items-center gap-2">
                <MessageCircle size={16} />
                {languageText.chat}
              </Button>
              <Button className="flex items-center gap-2">
                <Book size={16} />
                {languageText.resources}
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Animal Sounds Quiz</h2>
            <QuizContainer 
              title={languageText.animalSoundsQuiz} 
              description={languageText.matchAnimalsWithSounds}
              questions={quizQuestions}
              onComplete={handleQuizComplete}
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="activities">
        <div className="space-y-6">
          <h2 className="text-lg font-bold mb-4">{languageText.interactiveStories}</h2>
          <InteractiveStory
            title="The Friendly Lion"
            scenes={storyScenes}
            initialSceneId="scene1"
            onComplete={handleStoryComplete}
            onVocabLearned={handleVocabLearned}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="learning-path">
        <LearningPath
          path={learningPath}
          onStartActivity={handleStartActivity}
        />
      </TabsContent>
      
      <TabsContent value="students">
        <ClassroomStudents
          students={classStudents}
          onMessageStudent={handleMessageStudent}
          onToggleSpotlight={handleToggleSpotlight}
        />
      </TabsContent>
    </Tabs>
  );
}
