import React, { createContext, useState, useContext, ReactNode } from "react";

// Add your language translations here
const languages = {
  english: {
    welcome: "Welcome",
    learningProgress: "Learning Progress",
    vocabulary: "Vocabulary",
    grammar: "Grammar",
    listening: "Listening",
    speakingSkill: "Speaking",
    reading: "Reading",
    yourRewards: "Your Rewards",
    upcomingClasses: "Upcoming Classes",
    viewAll: "View All",
    funActivities: "Fun Activities",
    start: "Start",
    points: "points",
    dueDate: "Due Date",
    completed: "Completed",
    typeAnswer: "Type your answer here...",
    attachFile: "Attach File",
    fileAttached: "File Attached",
    fileAttachedDesc: "Your file has been attached successfully",
    submissionRequired: "Submission Required",
    provideAnswer: "Please provide an answer or attach a file",
    homeworkSubmitted: "Homework Submitted",
    earnedPoints: "You earned {} points!",
    submitting: "Submitting...",
    submitHomework: "Submit Homework",
    vocabularyPractice: "Vocabulary Practice",
    question: "Question",
    of: "of",
    selectTranslation: "Select the correct translation",
    nextWord: "Next Word",
    finish: "Finish",
    practiceCompleted: "Practice Completed",
    youScored: "You scored",
    practiceAgain: "Practice Again",

    // Assessment system
    question: "Question",
    of: "of",
    submit: "Submit",
    selectOption: "Select an Option",
    pleaseSelectOption: "Please select an option before submitting",
    correct: "Correct!",
    incorrect: "Incorrect",
    correctFeedback: "Great job! You've got the right answer.",
    incorrectFeedback: "Not quite. Try to remember for next time.",
    quizCompleted: "Quiz Completed",
    yourScore: "Your Score",
    retakeQuiz: "Retake Quiz",
    nextQuestion: "Next Question",
    finish: "Finish",
    animalSoundsQuiz: "Animal Sounds Quiz",
    matchAnimalsWithSounds: "Match these animals with their sounds",
    
    // Interactive learning
    showVocabulary: "Show Vocabulary",
    hideVocabulary: "Hide Vocabulary", 
    newVocabulary: "New Vocabulary",
    finishStory: "Finish Story",
    interactiveStories: "Interactive Stories",
    
    // Learning path
    learningPath: "Learning Path",
    complete: "complete",
    activities: "activities",
    min: "min",
    
    // Teacher tools
    lessonPlanCreator: "Lesson Plan Creator",
    createLessonPlan: "Create Lesson Plan",
    editLessonPlan: "Edit Lesson Plan",
    lessonTitle: "Lesson Title",
    enterLessonTitle: "Enter lesson title",
    grade: "Grade",
    enterGrade: "Enter grade level",
    subject: "Subject",
    enterSubject: "Enter subject",
    objectives: "Objectives",
    addObjective: "Add Objective",
    objective: "Objective",
    activities: "Activities",
    addActivity: "Add Activity",
    activity: "Activity",
    title: "Title",
    enterActivityTitle: "Enter activity title",
    description: "Description",
    enterActivityDescription: "Enter activity description",
    duration: "Duration",
    materials: "Materials",
    addMaterial: "Add Material",
    material: "Material",
    additionalNotes: "Additional Notes",
    enterAdditionalNotes: "Enter any additional notes",
    validationError: "Validation Error",
    lessonTitleRequired: "Lesson title is required",
    objectivesRequired: "At least one objective is required",
    saveLessonPlan: "Save Lesson Plan",
    lessonPlanSaved: "Lesson Plan Saved",
    lessonPlanSavedDesc: "Your lesson plan has been saved successfully",
    
    // Classroom
    lessonContent: "Lesson",
    students: "Students",
    studentsInClass: "Students in Class",
    searchStudents: "Search students",
    noStudentsFound: "No students found",
    handRaised: "Hand Raised",
    handLowered: "Hand Lowered",
    teacherNotified: "Your teacher has been notified",
    handLoweredDesc: "Your hand has been lowered",
    microphoneEnabled: "Microphone Enabled",
    microphoneDisabled: "Microphone Disabled",
    youCanNowSpeak: "You can now speak to the class",
    youAreMuted: "You are now muted",
    cameraEnabled: "Camera Enabled",
    cameraDisabled: "Camera Disabled",
    youAreNowVisible: "You are now visible to the class",
    youAreNowHidden: "Your camera is now turned off",
    clickToPlayVideo: "Click to play the lesson video",
    play: "Play",
    resources: "Resources",
    chat: "Chat",
    participants: "Participants",
    teacher: "Teacher",
    host: "Host",
    you: "You",
    speakingNow: "Speaking",
    online: "Online",
    lastActive: "Last active",
    message: "Message",
    spotlight: "Spotlight",
    leaveClass: "Leave Class",

    // Achievements/Gamification
    achievements: "Achievements",
    all: "All",
    learning: "Learning",
    social: "Social",
    streak: "Streak",
    mastery: "Mastery",
    noAchievementsFound: "No achievements found in this category",
  },

  spanish: {
    welcome: "Bienvenido",
    learningProgress: "Progreso de Aprendizaje",
    vocabulary: "Vocabulario",
    grammar: "Gramática",
    listening: "Comprensión Auditiva",
    speakingSkill: "Expresión Oral",
    reading: "Lectura",
    yourRewards: "Tus Recompensas",
    upcomingClasses: "Próximas Clases",
    viewAll: "Ver Todo",
    funActivities: "Actividades Divertidas",
    start: "Comenzar",
    points: "puntos",
    dueDate: "Fecha de Entrega",
    completed: "Completado",
    typeAnswer: "Escribe tu respuesta aquí...",
    attachFile: "Adjuntar Archivo",
    fileAttached: "Archivo Adjuntado",
    fileAttachedDesc: "Tu archivo ha sido adjuntado exitosamente",
    submissionRequired: "Entrega Requerida",
    provideAnswer: "Por favor proporciona una respuesta o adjunta un archivo",
    homeworkSubmitted: "Tarea Enviada",
    earnedPoints: "¡Has ganado {} puntos!",
    submitting: "Enviando...",
    submitHomework: "Enviar Tarea",
    vocabularyPractice: "Práctica de Vocabulario",
    question: "Pregunta",
    of: "de",
    selectTranslation: "Selecciona la traducción correcta",
    nextWord: "Siguiente Palabra",
    finish: "Terminar",
    practiceCompleted: "Práctica Completada",
    youScored: "Tu puntuación",
    practiceAgain: "Practicar de Nuevo",

    // Assessment system
    question: "Pregunta",
    of: "de",
    submit: "Enviar",
    selectOption: "Seleccionar una Opción",
    pleaseSelectOption: "Por favor selecciona una opción antes de enviar",
    correct: "¡Correcto!",
    incorrect: "Incorrecto",
    correctFeedback: "¡Buen trabajo! Has elegido la respuesta correcta.",
    incorrectFeedback: "No exactamente. Intenta recordar para la próxima.",
    quizCompleted: "Cuestionario Completado",
    yourScore: "Tu Puntaje",
    retakeQuiz: "Volver a Intentar",
    nextQuestion: "Siguiente Pregunta",
    finish: "Terminar",
    animalSoundsQuiz: "Cuestionario de Sonidos de Animales",
    matchAnimalsWithSounds: "Relaciona estos animales con sus sonidos",
    
    // Interactive learning
    showVocabulary: "Mostrar Vocabulario",
    hideVocabulary: "Ocultar Vocabulario", 
    newVocabulary: "Nuevo Vocabulario",
    finishStory: "Terminar Historia",
    interactiveStories: "Historias Interactivas",
    
    // Learning path
    learningPath: "Ruta de Aprendizaje",
    complete: "completo",
    activities: "actividades",
    min: "min",
    
    // Teacher tools
    lessonPlanCreator: "Creador de Plan de Lección",
    createLessonPlan: "Crear Plan de Lección",
    editLessonPlan: "Editar Plan de Lección",
    lessonTitle: "Título de la Lección",
    enterLessonTitle: "Ingresa el título de la lección",
    grade: "Grado",
    enterGrade: "Ingresa el nivel de grado",
    subject: "Asignatura",
    enterSubject: "Ingresa la asignatura",
    objectives: "Objetivos",
    addObjective: "Añadir Objetivo",
    objective: "Objetivo",
    activities: "Actividades",
    addActivity: "Añadir Actividad",
    activity: "Actividad",
    title: "Título",
    enterActivityTitle: "Ingresa el título de la actividad",
    description: "Descripción",
    enterActivityDescription: "Ingresa la descripción de la actividad",
    duration: "Duración",
    materials: "Materiales",
    addMaterial: "Añadir Material",
    material: "Material",
    additionalNotes: "Notas Adicionales",
    enterAdditionalNotes: "Ingresa cualquier nota adicional",
    validationError: "Error de Validación",
    lessonTitleRequired: "El título de la lección es obligatorio",
    objectivesRequired: "Se requiere al menos un objetivo",
    saveLessonPlan: "Guardar Plan de Lección",
    lessonPlanSaved: "Plan de Lección Guardado",
    lessonPlanSavedDesc: "Tu plan de lección ha sido guardado exitosamente",
    
    // Classroom
    lessonContent: "Lección",
    students: "Estudiantes",
    studentsInClass: "Estudiantes en Clase",
    searchStudents: "Buscar estudiantes",
    noStudentsFound: "No se encontraron estudiantes",
    handRaised: "Mano Levantada",
    handLowered: "Mano Bajada",
    teacherNotified: "Tu profesor ha sido notificado",
    handLoweredDesc: "Tu mano ha sido bajada",
    microphoneEnabled: "Micrófono Habilitado",
    microphoneDisabled: "Micrófono Desactivado",
    youCanNowSpeak: "Ahora puedes hablar con la clase",
    youAreMuted: "Ahora estás silenciado",
    cameraEnabled: "Cámara Habilitada",
    cameraDisabled: "Cámara Desactivada",
    youAreNowVisible: "Ahora eres visible para la clase",
    youAreNowHidden: "Tu cámara está apagada",
    clickToPlayVideo: "Haz clic para reproducir el video de la lección",
    play: "Reproducir",
    resources: "Recursos",
    chat: "Chat",
    participants: "Participantes",
    teacher: "Profesor",
    host: "Anfitrión",
    you: "Tú",
    speakingNow: "Hablando",
    online: "En línea",
    lastActive: "Última actividad",
    message: "Mensaje",
    spotlight: "Destacar",
    leaveClass: "Salir de Clase",

    // Achievements/Gamification
    achievements: "Logros",
    all: "Todos",
    learning: "Aprendizaje",
    social: "Social",
    streak: "Racha",
    mastery: "Maestría",
    noAchievementsFound: "No se encontraron logros en esta categoría",
  },
};

type LanguageOptions = keyof typeof languages;
type LanguageContextType = {
  language: LanguageOptions;
  languageText: (typeof languages)[LanguageOptions];
  setLanguage: (language: LanguageOptions) => void;
};

// Create the language context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Language provider component
export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<LanguageOptions>("english");

  const value = {
    language,
    languageText: languages[language],
    setLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};

// Hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
