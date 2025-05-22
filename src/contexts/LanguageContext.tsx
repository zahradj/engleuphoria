
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'english' | 'arabic' | 'french';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  languageText: {
    // Navigation & Common elements
    forParents: string;
    forTeachers: string;
    logIn: string;
    signUp: string;
    aboutUs: string;
    contact: string;
    welcomeBack: string;
    readyToLearn: string;
    joinNextClass: string;
    backToDashboard: string;
    upcomingClasses: string;
    funActivities: string;
    viewAll: string;
    start: string;
    submit: string;
    leaveClass: string;
    yourProgress: string;
    yourRewards: string;
    recentActivity: string;
    notifications: string;
    profile: string;
    language: string;
    getStarted: string;
    joinNow: string;
    
    // Hero section
    learnEnglish: string;
    funWay: string;
    heroDescription: string;
    interactiveClasses: string;
    liveVideoLessons: string;
    gamesAndQuizzes: string;
    community: string;
    learnWithFriends: string;
    
    // Auth
    email: string;
    password: string;
    rememberMe: string;
    forgotPassword: string;
    dontHaveAccount: string;
    createAccount: string;
    fullName: string;
    iAmA: string;
    parent: string;
    teacher: string;
    student: string;
    alreadyHaveAccount: string;
    
    // NotFound
    pageNotFound: string;
    pageNotFoundMessage: string;
    returnHome: string;
    
    // Whiteboard
    interactiveWhiteboard: string;
    activityDrawAndLearn: string;
    useWhiteboardComplete: string;
    drawAnimal: string;
    writeAnimalName: string;
    drawWhatEats: string;
    submitActivity: string;
    
    // Dashboard
    welcomeUser: string;
    thisWeekActivities: string;
    classesAttended: string;
    pointsEarned: string;
    attendedClass: string;
    completedActivity: string;
    earnedBadge: string;
    
    // Classroom
    participants: string;
    host: string;
    you: string;
    speakingNow: string; // Changed from 'speaking' to 'speakingNow'
    sharedContentWillAppear: string;
    openWhiteboard: string;
    todaysLesson: string;
    
    // For Teachers
    teachingToolsTitle: string;
    teachingToolsSubtitle: string;
    interactiveVideos: string;
    interactiveVideosTitle: string;
    interactiveVideosDesc: string;
    readyMadeMaterials: string;
    readyMadeMaterialsTitle: string;
    readyMadeMaterialsDesc: string;
    studentProgress: string;
    studentProgressTitle: string;
    studentProgressDesc: string;
    joinAsTeacher: string;
    
    // New components - Learning progress
    learningProgress: string;
    vocabulary: string;
    grammar: string;
    listening: string;
    speakingSkill: string; // Changed from 'speaking' to 'speakingSkill'
    reading: string;
    
    // Homework
    homework: string;
    homeworkSubmitted: string;
    earnedPoints: string;
    dueDate: string;
    typeAnswer: string;
    attachFile: string;
    submitting: string;
    submitHomework: string;
    completed: string;
    fileAttached: string;
    fileAttachedDesc: string;
    submissionRequired: string;
    provideAnswer: string;
    
    // Vocabulary Practice
    vocabularyPractice: string;
    question: string;
    of: string;
    selectTranslation: string;
    nextWord: string;
    finish: string;
    practiceCompleted: string;
    yourScore: string;
    youScored: string;
    practiceAgain: string;
    
    // Calendar & Events
    studyCalendar: string;
    selectDate: string;
    noEventsForDay: string;
    class: string;
    test: string;
    practice: string;
    
    // Resource Library
    resourceLibrary: string;
    searchResources: string;
    type: string;
    level: string;
    all: string;
    video: string;
    audio: string;
    interactive: string;
    beginner: string;
    intermediate: string;
    advanced: string;
    download: string;
    viewResource: string;
    noResourcesFound: string;
    
    // Parent Dashboard
    parentDashboard: string;
    welcomeParent: string;
    parentDashboardDesc: string;
    contactTeacher: string;
    overview: string;
    childProgress: string;
    schedule: string;
    upcomingEvents: string;
    learningSummary: string;
    timeSpentLearning: string;
    hoursThisWeek: string;
    totalPoints: string;
    completedActivities: string;
    activities: string;
    viewDetailedReport: string;
    teacherNotes: string;
    teacherComment1: string;
    englishTeacher: string;
    teacherComment2: string;
    conversationTeacher: string;
    learningRecommendations: string;
    practiceVocabulary: string;
    focusOnVocabulary: string;
    viewResources: string;
    joinExtraClass: string;
    additionalPractice: string;
    exploreTimes: string;
    useAudiobooks: string;
    improveListening: string;
    browseAudiobooks: string;
    upcomingClassSchedule: string;
    recurring: string;
    homeworkHistory: string;
    submitted: string;
    scoreReceived: string;
    points: string;
  };
}

const translations = {
  english: {
    // Navigation & Common elements
    forParents: 'For Parents',
    forTeachers: 'For Teachers',
    logIn: 'Log In',
    signUp: 'Sign Up',
    aboutUs: 'About Us',
    contact: 'Contact',
    welcomeBack: 'Welcome back',
    readyToLearn: 'Ready for another day of fun learning?',
    joinNextClass: 'Join Next Class',
    backToDashboard: 'Back to Dashboard',
    upcomingClasses: 'Upcoming Classes',
    funActivities: 'Fun Activities',
    viewAll: 'View All',
    start: 'Start',
    submit: 'Submit',
    leaveClass: 'Leave Class',
    yourProgress: 'Your Progress',
    yourRewards: 'Your Rewards',
    recentActivity: 'Recent Activity',
    notifications: 'Notifications',
    profile: 'Profile',
    language: 'Language',
    getStarted: 'Get Started',
    joinNow: 'Join now!',
    
    // Hero section
    learnEnglish: 'Learn English',
    funWay: 'in a Fun & Creative Way!',
    heroDescription: 'Engleuphoria is a vibrant and engaging online learning platform designed for children aged 5–12 to learn English through play and creative activities.',
    interactiveClasses: 'Interactive Classes',
    liveVideoLessons: 'Live video lessons with teachers',
    gamesAndQuizzes: 'Games, quizzes, and stories',
    community: 'Community',
    learnWithFriends: 'Learn with friends',
    
    // Auth
    email: 'Email',
    password: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    dontHaveAccount: 'Don\'t have an account?',
    createAccount: 'Create Your Account',
    fullName: 'Full Name',
    iAmA: 'I am a:',
    parent: 'Parent',
    teacher: 'Teacher',
    student: 'Student (13+ years)',
    alreadyHaveAccount: 'Already have an account?',
    
    // NotFound
    pageNotFound: 'Page Not Found',
    pageNotFoundMessage: 'Oops! It looks like you\'ve wandered to a part of our universe that doesn\'t exist.',
    returnHome: 'Return Home',
    
    // Whiteboard
    interactiveWhiteboard: 'Interactive Whiteboard',
    activityDrawAndLearn: 'Activity: Draw and Learn',
    useWhiteboardComplete: 'Use the whiteboard to complete these activities:',
    drawAnimal: 'Draw your favorite animal',
    writeAnimalName: 'Write the animal\'s name in English',
    drawWhatEats: 'Draw what the animal eats',
    submitActivity: 'Submit Activity (+15 points)',
    
    // Dashboard
    welcomeUser: 'Welcome back, {}! 👋',
    thisWeekActivities: 'This Week\'s Activities',
    classesAttended: 'Total Classes Attended',
    pointsEarned: 'Points Earned',
    attendedClass: 'Attended Class',
    completedActivity: 'Completed Activity',
    earnedBadge: 'Earned Badge',
    
    // Classroom
    participants: 'Participants',
    host: 'Host',
    you: 'You',
    speakingNow: 'Speaking...', // Changed from 'speaking' to 'speakingNow'
    sharedContentWillAppear: 'Shared content will appear here',
    openWhiteboard: 'Open Whiteboard',
    todaysLesson: 'Today\'s Lesson: Animal Sounds',
    
    // For Teachers
    teachingToolsTitle: 'Powerful Tools to Make Teaching English Delightful',
    teachingToolsSubtitle: 'Engleuphoria empowers teachers with intuitive tools for engaging, interactive lessons. Spend less time on lesson planning and more time inspiring your students.',
    interactiveVideos: 'Interactive Video Classes',
    interactiveVideosTitle: 'Interactive Video Classes',
    interactiveVideosDesc: 'Our custom video platform offers whiteboard integration, breakout rooms, fun reactions, and child-friendly controls.',
    readyMadeMaterials: 'Ready-Made Materials',
    readyMadeMaterialsTitle: 'Ready-Made Materials',
    readyMadeMaterialsDesc: 'Browse hundreds of activities, worksheets, games and lesson plans designed by experienced ESL teachers.',
    studentProgress: 'Student Progress Analytics',
    studentProgressTitle: 'Student Progress Analytics',
    studentProgressDesc: 'Our comprehensive dashboard gives you insights into each student\'s progress, helping you tailor your teaching approach to individual needs.',
    joinAsTeacher: 'Join as a Teacher',
    
    // New components - Learning progress
    learningProgress: 'Learning Progress',
    vocabulary: 'Vocabulary',
    grammar: 'Grammar',
    listening: 'Listening',
    speakingSkill: 'Speaking', // Changed from 'speaking' to 'speakingSkill'
    reading: 'Reading',
    
    // Homework
    homework: 'Homework',
    homeworkSubmitted: 'Homework Submitted',
    earnedPoints: 'You earned {} points!',
    dueDate: 'Due Date',
    typeAnswer: 'Type your answer here...',
    attachFile: 'Attach File',
    submitting: 'Submitting...',
    submitHomework: 'Submit Homework',
    completed: 'Completed',
    fileAttached: 'File Attached',
    fileAttachedDesc: 'Your file has been attached successfully.',
    submissionRequired: 'Submission Required',
    provideAnswer: 'Please provide an answer or attach a file before submitting.',
    
    // Vocabulary Practice
    vocabularyPractice: 'Vocabulary Practice',
    question: 'Question',
    of: 'of',
    selectTranslation: 'Select the correct translation',
    nextWord: 'Next Word',
    finish: 'Finish',
    practiceCompleted: 'Practice Completed',
    yourScore: 'Your Score',
    youScored: 'You scored',
    practiceAgain: 'Practice Again',
    
    // Calendar & Events
    studyCalendar: 'Study Calendar',
    selectDate: 'Select a date to view events',
    noEventsForDay: 'No events for this day',
    class: 'Class',
    test: 'Test',
    practice: 'Practice',
    
    // Resource Library
    resourceLibrary: 'Resource Library',
    searchResources: 'Search resources...',
    type: 'Type',
    level: 'Level',
    all: 'All',
    video: 'Video',
    audio: 'Audio',
    interactive: 'Interactive',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    download: 'Download',
    viewResource: 'View Resource',
    noResourcesFound: 'No resources found for your search criteria.',
    
    // Parent Dashboard
    parentDashboard: 'Parent Dashboard',
    welcomeParent: 'Welcome, {}!',
    parentDashboardDesc: 'Monitor {}\'s learning progress and stay involved in their educational journey.',
    contactTeacher: 'Contact Teacher',
    overview: 'Overview',
    childProgress: 'Child\'s Progress',
    schedule: 'Schedule',
    upcomingEvents: 'Upcoming Events',
    learningSummary: 'Learning Summary',
    timeSpentLearning: 'Time Spent Learning',
    hoursThisWeek: 'hours this week',
    totalPoints: 'total points',
    completedActivities: 'Completed Activities',
    activities: 'activities',
    viewDetailedReport: 'View Detailed Report',
    teacherNotes: 'Teacher Notes',
    teacherComment1: 'is showing great progress with vocabulary. He actively participates in class discussions and is very enthusiastic.',
    englishTeacher: 'English Teacher',
    teacherComment2: 'I recommend additional speaking practice to help build confidence in conversation. Overall, doing well!',
    conversationTeacher: 'Conversation Teacher',
    learningRecommendations: 'Learning Recommendations',
    practiceVocabulary: 'Practice Vocabulary',
    focusOnVocabulary: 'Focus on animal and food vocabulary with our interactive flashcards.',
    viewResources: 'View Resources',
    joinExtraClass: 'Join Extra Class',
    additionalPractice: 'Additional conversation practice sessions available this weekend.',
    exploreTimes: 'Explore Times',
    useAudiobooks: 'Use Audiobooks',
    improveListening: 'Improve listening skills with our collection of beginner-level audiobooks.',
    browseAudiobooks: 'Browse Audiobooks',
    upcomingClassSchedule: 'Upcoming Class Schedule',
    recurring: 'Recurring',
    homeworkHistory: 'Homework History',
    submitted: 'Submitted',
    scoreReceived: 'Score',
    points: 'pts',
  },
  arabic: {
    // Navigation & Common elements
    forParents: 'للآباء',
    forTeachers: 'للمعلمين',
    logIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    aboutUs: 'من نحن',
    contact: 'اتصل بنا',
    welcomeBack: 'مرحباً بعودتك',
    readyToLearn: 'هل أنت مستعد ليوم آخر من التعلم الممتع؟',
    joinNextClass: 'انضم إلى الصف التالي',
    backToDashboard: 'العودة إلى لوحة المعلومات',
    upcomingClasses: 'الصفوف القادمة',
    funActivities: 'أنشطة ممتعة',
    viewAll: 'عرض الكل',
    start: 'ابدأ',
    submit: 'إرسال',
    leaveClass: 'مغادرة الصف',
    yourProgress: 'تقدمك',
    yourRewards: 'مكافآتك',
    recentActivity: 'النشاط الأخير',
    notifications: 'الإشعارات',
    profile: 'الملف الشخصي',
    language: 'اللغة',
    getStarted: 'البدء',
    joinNow: 'انضم الآن!',
    
    // Hero section
    learnEnglish: 'تعلم الإنجليزية',
    funWay: 'بطريقة ممتعة وإبداعية!',
    heroDescription: 'انجليوفوريا هي منصة تعليمية نابضة بالحياة وجذابة مصممة للأطفال من سن 5-12 لتعلم اللغة الإنجليزية من خلال اللعب والأنشطة الإبداعية.',
    interactiveClasses: 'صفوف تفاعلية',
    liveVideoLessons: 'دروس فيديو مباشرة مع المعلمين',
    gamesAndQuizzes: 'ألعاب واختبارات وقصص',
    community: 'المجتمع',
    learnWithFriends: 'تعلم مع الأصدقاء',
    
    // Auth
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    rememberMe: 'تذكرني',
    forgotPassword: 'نسيت كلمة المرور؟',
    dontHaveAccount: 'ليس لديك حساب؟',
    createAccount: 'إنشاء حسابك',
    fullName: 'الاسم الكامل',
    iAmA: 'أنا:',
    parent: 'ولي أمر',
    teacher: 'معلم',
    student: 'طالب (13+ سنة)',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    
    // NotFound
    pageNotFound: 'الصفحة غير موجودة',
    pageNotFoundMessage: 'عفواً! يبدو أنك تجولت إلى جزء من عالمنا غير موجود.',
    returnHome: 'العودة للرئيسية',
    
    // Whiteboard
    interactiveWhiteboard: 'السبورة التفاعلية',
    activityDrawAndLearn: 'النشاط: ارسم وتعلم',
    useWhiteboardComplete: 'استخدم السبورة لإكمال هذه الأنشطة:',
    drawAnimal: 'ارسم حيوانك المفضل',
    writeAnimalName: 'اكتب اسم الحيوان باللغة الإنجليزية',
    drawWhatEats: 'ارسم ما يأكله الحيوان',
    submitActivity: 'إرسال النشاط (+15 نقطة)',
    
    // Dashboard
    welcomeUser: 'مرحباً بعودتك، {}! 👋',
    thisWeekActivities: 'أنشطة هذا الأسبوع',
    classesAttended: 'إجمالي الصفوف التي حضرتها',
    pointsEarned: 'النقاط المكتسبة',
    attendedClass: 'حضر الصف',
    completedActivity: 'أكمل النشاط',
    earnedBadge: 'حصل على شارة',
    
    // Classroom
    participants: 'المشاركون',
    host: 'المضيف',
    you: 'أنت',
    speakingNow: 'يتحدث...', // Changed from 'speaking' to 'speakingNow'
    sharedContentWillAppear: 'سيظهر المحتوى المشترك هنا',
    openWhiteboard: 'فتح السبورة',
    todaysLesson: 'درس اليوم: أصوات الحيوانات',
    
    // For Teachers
    teachingToolsTitle: 'أدوات قوية لجعل تعليم اللغة الإنجليزية ممتعاً',
    teachingToolsSubtitle: 'تمكّن Engleuphoria المعلمين بأدوات بديهية للدروس التفاعلية الجذابة. اقض وقتًا أقل في التخطيط للدروس ووقتًا أكثر في إلهام طلابك.',
    interactiveVideos: 'فصول فيديو تفاعلية',
    interactiveVideosTitle: 'فصول فيديو تفاعلية',
    interactiveVideosDesc: 'توفر منصة الفيديو المخصصة لدينا تكاملًا مع السبورة، وغرف النقاش، وردود فعل ممتعة، وعناصر تحكم مناسبة للأطفال.',
    readyMadeMaterials: 'مواد جاهزة للاستخدام',
    readyMadeMaterialsTitle: 'مواد جاهزة للاستخدام',
    readyMadeMaterialsDesc: 'تصفح مئات الأنشطة وأوراق العمل والألعاب وخطط الدروس التي صممها مدرسو اللغة الإنجليزية ذوي الخبرة.',
    studentProgress: 'تحليلات تقدم الطالب',
    studentProgressTitle: 'تحليلات تقدم الطالب',
    studentProgressDesc: 'توفر لوحة المعلومات الشاملة لدينا رؤى حول تقدم كل طالب، مما يساعدك على تكييف نهج التدريس وفقًا للاحتياجات الفردية.',
    joinAsTeacher: 'انضم كمعلم',
    
    // New components - Learning progress
    learningProgress: 'تقدم التعلم',
    vocabulary: 'المفردات',
    grammar: 'القواعد',
    listening: 'الاستماع',
    speakingSkill: 'التحدث', // Changed from 'speaking' to 'speakingSkill'
    reading: 'القراءة',
    
    // Homework
    homework: 'الواجب المنزلي',
    homeworkSubmitted: 'تم تقديم الواجب المنزلي',
    earnedPoints: 'لقد ربحت {} نقطة!',
    dueDate: 'تاريخ الاستحقاق',
    typeAnswer: 'اكتب إجابتك هنا...',
    attachFile: 'إرفاق ملف',
    submitting: 'جاري التقديم...',
    submitHomework: 'تقديم الواجب المنزلي',
    completed: 'مكتمل',
    fileAttached: 'تم إرفاق الملف',
    fileAttachedDesc: 'تم إرفاق ملفك بنجاح.',
    submissionRequired: 'التقديم مطلوب',
    provideAnswer: 'يرجى تقديم إجابة أو إرفاق ملف قبل التقديم.',
    
    // Vocabulary Practice
    vocabularyPractice: 'تمرين المفردات',
    question: 'سؤال',
    of: 'من',
    selectTranslation: 'اختر الترجمة الصحيحة',
    nextWord: 'الكلمة التالية',
    finish: 'إنهاء',
    practiceCompleted: 'اكتمل التمرين',
    yourScore: 'نتيجتك',
    youScored: 'لقد حصلت على',
    practiceAgain: 'تمرين مرة أخرى',
    
    // Calendar & Events
    studyCalendar: 'تقويم الدراسة',
    selectDate: 'اختر تاريخًا لعرض الأحداث',
    noEventsForDay: 'لا توجد أحداث لهذا اليوم',
    class: 'صف',
    test: 'اختبار',
    practice: 'تمرين',
    
    // Resource Library
    resourceLibrary: 'مكتبة الموارد',
    searchResources: 'البحث في الموارد...',
    type: 'النوع',
    level: 'المستوى',
    all: 'الكل',
    video: 'فيديو',
    audio: 'صوتي',
    interactive: 'تفاعلي',
    beginner: 'مبتدئ',
    intermediate: 'متوسط',
    advanced: 'متقدم',
    download: 'تحميل',
    viewResource: 'عرض المورد',
    noResourcesFound: 'لم يتم العثور على موارد تطابق معايير البحث الخاصة بك.',
    
    // Parent Dashboard
    parentDashboard: 'لوحة تحكم الوالدين',
    welcomeParent: 'مرحبًا، {}!',
    parentDashboardDesc: 'راقب تقدم {} التعليمي وكن جزءًا من رحلتهم التعليمية.',
    contactTeacher: 'التواصل مع المعلم',
    overview: 'نظرة عامة',
    childProgress: 'تقدم الطفل',
    schedule: 'الجدول',
    upcomingEvents: 'الأحداث القادمة',
    learningSummary: 'ملخص التعلم',
    timeSpentLearning: 'الوقت المستغرق في التعلم',
    hoursThisWeek: 'ساعة هذا الأسبوع',
    totalPoints: 'إجمالي النقاط',
    completedActivities: 'الأنشطة المكتملة',
    activities: 'أنشطة',
    viewDetailedReport: 'عرض تقرير مفصل',
    teacherNotes: 'ملاحظات المعلم',
    teacherComment1: 'يُظهر تقدمًا رائعًا في المفردات. يشارك بنشاط في مناقشات الفصل ومتحمس جدًا.',
    englishTeacher: 'مدرس اللغة الإنجليزية',
    teacherComment2: 'أوصي بممارسة إضافية للتحدث للمساعدة في بناء الثقة في المحادثة. بشكل عام، يعمل بشكل جيد!',
    conversationTeacher: 'مدرس المحادثة',
    learningRecommendations: 'توصيات التعلم',
    practiceVocabulary: 'تمرين المفردات',
    focusOnVocabulary: 'التركيز على مفردات الحيوانات والطعام من خلال بطاقات الذاكرة التفاعلية.',
    viewResources: 'عرض الموارد',
    joinExtraClass: 'الانضمام إلى صف إضافي',
    additionalPractice: 'جلسات تمرين محادثة إضافية متاحة في نهاية هذا الأسبوع.',
    exploreTimes: 'استكشاف المواعيد',
    useAudiobooks: 'استخدام الكتب الصوتية',
    improveListening: 'تحسين مهارات الاستماع بمجموعة الكتب الصوتية للمستوى المبتدئ.',
    browseAudiobooks: 'تصفح الكتب الصوتية',
    upcomingClassSchedule: 'جدول الصفوف القادمة',
    recurring: 'متكرر',
    homeworkHistory: 'سجل الواجبات المنزلية',
    submitted: 'تم التقديم',
    scoreReceived: 'النتيجة',
    points: 'نقطة',
  },
  french: {
    // Navigation & Common elements
    forParents: 'Pour les Parents',
    forTeachers: 'Pour les Enseignants',
    logIn: 'Connexion',
    signUp: 'Inscription',
    aboutUs: 'À Propos',
    contact: 'Contact',
    welcomeBack: 'Bon retour',
    readyToLearn: 'Prêt pour une nouvelle journée d\'apprentissage amusant ?',
    joinNextClass: 'Rejoindre le Prochain Cours',
    backToDashboard: 'Retour au Tableau de Bord',
    upcomingClasses: 'Cours à Venir',
    funActivities: 'Activités Amusantes',
    viewAll: 'Voir Tout',
    start: 'Commencer',
    submit: 'Soumettre',
    leaveClass: 'Quitter le Cours',
    yourProgress: 'Votre Progression',
    yourRewards: 'Vos Récompenses',
    recentActivity: 'Activité Récente',
    notifications: 'Notifications',
    profile: 'Profil',
    language: 'Langue',
    getStarted: 'Commencer',
    joinNow: 'Rejoignez-nous !',
    
    // Hero section
    learnEnglish: 'Apprenez l\'anglais',
    funWay: 'd\'une manière amusante et créative !',
    heroDescription: 'Engleuphoria est une plateforme d\'apprentissage en ligne vivante et engageante conçue pour les enfants de 5 à 12 ans pour apprendre l\'anglais par le jeu et les activités créatives.',
    interactiveClasses: 'Cours Interactifs',
    liveVideoLessons: 'Cours vidéo en direct avec des enseignants',
    gamesAndQuizzes: 'Jeux, quiz et histoires',
    community: 'Communauté',
    learnWithFriends: 'Apprenez avec des amis',
    
    // Auth
    email: 'Email',
    password: 'Mot de passe',
    rememberMe: 'Se souvenir de moi',
    forgotPassword: 'Mot de passe oublié ?',
    dontHaveAccount: 'Vous n\'avez pas de compte ?',
    createAccount: 'Créez Votre Compte',
    fullName: 'Nom Complet',
    iAmA: 'Je suis un(e) :',
    parent: 'Parent',
    teacher: 'Enseignant',
    student: 'Élève (13+ ans)',
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    
    // NotFound
    pageNotFound: 'Page Non Trouvée',
    pageNotFoundMessage: 'Oups ! Il semble que vous vous soyez aventuré dans une partie de notre univers qui n\'existe pas.',
    returnHome: 'Retourner à l\'Accueil',
    
    // Whiteboard
    interactiveWhiteboard: 'Tableau Blanc Interactif',
    activityDrawAndLearn: 'Activité : Dessiner et Apprendre',
    useWhiteboardComplete: 'Utilisez le tableau blanc pour compléter ces activités :',
    drawAnimal: 'Dessinez votre animal préféré',
    writeAnimalName: 'Écrivez le nom de l\'animal en anglais',
    drawWhatEats: 'Dessinez ce que mange l\'animal',
    submitActivity: 'Soumettre l\'Activité (+15 points)',
    
    // Dashboard
    welcomeUser: 'Bon retour, {} ! 👋',
    thisWeekActivities: 'Activités de la Semaine',
    classesAttended: 'Total des Cours Suivis',
    pointsEarned: 'Points Gagnés',
    attendedClass: 'Cours Suivi',
    completedActivity: 'Activité Complétée',
    earnedBadge: 'Badge Obtenu',
    
    // Classroom
    participants: 'Participants',
    host: 'Hôte',
    you: 'Vous',
    speakingNow: 'En train de parler...', // Changed from 'speaking' to 'speakingNow'
    sharedContentWillAppear: 'Le contenu partagé apparaîtra ici',
    openWhiteboard: 'Ouvrir le Tableau Blanc',
    todaysLesson: 'Leçon du Jour : Les Sons des Animaux',
    
    // For Teachers
    teachingToolsTitle: 'Des Outils Puissants pour Rendre l\'Enseignement de l\'Anglais Délicieux',
    teachingToolsSubtitle: 'Engleuphoria donne aux enseignants des outils intuitifs pour des leçons engageantes et interactives. Passez moins de temps à planifier les leçons et plus de temps à inspirer vos élèves.',
    interactiveVideos: 'Cours Vidéo Interactifs',
    interactiveVideosTitle: 'Cours Vidéo Interactifs',
    interactiveVideosDesc: 'Notre plateforme vidéo personnalisée offre une intégration tableau blanc, des salles de discussion, des réactions amusantes et des contrôles adaptés aux enfants.',
    readyMadeMaterials: 'Matériaux Prêts à l\'Emploi',
    readyMadeMaterialsTitle: 'Matériaux Prêts à l\'Emploi',
    readyMadeMaterialsDesc: 'Parcourez des centaines d\'activités, de fiches de travail, de jeux et de plans de cours conçus par des enseignants d\'anglais expérimentés.',
    studentProgress: 'Analyses de Progression des Élèves',
    studentProgressTitle: 'Analyses de Progression des Élèves',
    studentProgressDesc: 'Notre tableau de bord complet vous donne un aperçu des progrès de chaque élève, vous aidant à adapter votre approche pédagogique aux besoins individuels.',
    joinAsTeacher: 'Rejoindre en tant qu\'Enseignant',
    
    // New components - Learning progress
    learningProgress: 'Progression d\'Apprentissage',
    vocabulary: 'Vocabulaire',
    grammar: 'Grammaire',
    listening: 'Écoute',
    speakingSkill: 'Expression Orale', // Changed from 'speaking' to 'speakingSkill'
    reading: 'Lecture',
    
    // Homework
    homework: 'Devoirs',
    homeworkSubmitted: 'Devoirs Soumis',
    earnedPoints: 'Vous avez gagné {} points !',
    dueDate: 'Date d\'échéance',
    typeAnswer: 'Tapez votre réponse ici...',
    attachFile: 'Joindre un Fichier',
    submitting: 'Soumission en cours...',
    submitHomework: 'Soumettre les Devoirs',
    completed: 'Terminé',
    fileAttached: 'Fichier Joint',
    fileAttachedDesc: 'Votre fichier a été joint avec succès.',
    submissionRequired: 'Soumission Requise',
    provideAnswer: 'Veuillez fournir une réponse ou joindre un fichier avant de soumettre.',
    
    // Vocabulary Practice
    vocabularyPractice: 'Exercice de Vocabulaire',
    question: 'Question',
    of: 'sur',
    selectTranslation: 'Sélectionnez la traduction correcte',
    nextWord: 'Mot Suivant',
    finish: 'Terminer',
    practiceCompleted: 'Exercice Terminé',
    yourScore: 'Votre Score',
    youScored: 'Vous avez obtenu',
    practiceAgain: 'S\'exercer à Nouveau',
    
    // Calendar & Events
    studyCalendar: 'Calendrier d\'Études',
    selectDate: 'Sélectionnez une date pour voir les événements',
    noEventsForDay: 'Pas d\'événements pour ce jour',
    class: 'Cours',
    test: 'Test',
    practice: 'Exercice',
    
    // Resource Library
    resourceLibrary: 'Bibliothèque de Ressources',
    searchResources: 'Rechercher des ressources...',
    type: 'Type',
    level: 'Niveau',
    all: 'Tous',
    video: 'Vidéo',
    audio: 'Audio',
    interactive: 'Interactif',
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé',
    download: 'Télécharger',
    viewResource: 'Voir la Ressource',
    noResourcesFound: 'Aucune ressource trouvée pour vos critères de recherche.',
    
    // Parent Dashboard
    parentDashboard: 'Tableau de Bord Parent',
    welcomeParent: 'Bienvenue, {} !',
    parentDashboardDesc: 'Suivez la progression d\'apprentissage de {} et restez impliqué dans son parcours éducatif.',
    contactTeacher: 'Contacter l\'Enseignant',
    overview: 'Aperçu',
    childProgress: 'Progression de l\'Enfant',
    schedule: 'Emploi du Temps',
    upcomingEvents: 'Événements à Venir',
    learningSummary: 'Résumé d\'Apprentissage',
    timeSpentLearning: 'Temps Consacré à l\'Apprentissage',
    hoursThisWeek: 'heures cette semaine',
    totalPoints: 'points totaux',
    completedActivities: 'Activités Complétées',
    activities: 'activités',
    viewDetailedReport: 'Voir Rapport Détaillé',
    teacherNotes: 'Notes des Enseignants',
    teacherComment1: 'montre de grands progrès en vocabulaire. Il participe activement aux discussions en classe et est très enthousiaste.',
    englishTeacher: 'Professeur d\'Anglais',
    teacherComment2: 'Je recommande des exercices supplémentaires de conversation pour aider à renforcer la confiance dans la conversation. Dans l\'ensemble, c\'est bien !',
    conversationTeacher: 'Professeur de Conversation',
    learningRecommendations: 'Recommandations d\'Apprentissage',
    practiceVocabulary: 'Pratiquer le Vocabulaire',
    focusOnVocabulary: 'Concentrez-vous sur le vocabulaire des animaux et de la nourriture avec nos cartes-mémoire interactives.',
    viewResources: 'Voir les Ressources',
    joinExtraClass: 'Rejoindre un Cours Supplémentaire',
    additionalPractice: 'Sessions de pratique de conversation supplémentaires disponibles ce week-end.',
    exploreTimes: 'Explorer les Horaires',
    useAudiobooks: 'Utiliser des Livres Audio',
    improveListening: 'Améliorez les compétences d\'écoute avec notre collection de livres audio de niveau débutant.',
    browseAudiobooks: 'Parcourir les Livres Audio',
    upcomingClassSchedule: 'Emploi du Temps des Cours à Venir',
    recurring: 'Récurrent',
    homeworkHistory: 'Historique des Devoirs',
    submitted: 'Soumis le',
    scoreReceived: 'Score',
    points: 'pts',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('english');
  
  const languageText = translations[language];
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, languageText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
