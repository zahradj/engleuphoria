
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'english' | 'arabic' | 'french';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  languageText: {
    // Navigation
    forParents: string;
    forTeachers: string;
    logIn: string;
    signUp: string;
    aboutUs: string;
    contact: string;
    
    // Common
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
    speaking: string;
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
  };
}

const translations = {
  english: {
    // Navigation
    forParents: 'For Parents',
    forTeachers: 'For Teachers',
    logIn: 'Log In',
    signUp: 'Sign Up',
    aboutUs: 'About Us',
    contact: 'Contact',
    
    // Common
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
    speaking: 'Speaking...',
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
  },
  arabic: {
    // Navigation
    forParents: 'للآباء',
    forTeachers: 'للمعلمين',
    logIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    aboutUs: 'من نحن',
    contact: 'اتصل بنا',
    
    // Common
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
    speaking: 'يتحدث...',
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
  },
  french: {
    // Navigation
    forParents: 'Pour les Parents',
    forTeachers: 'Pour les Enseignants',
    logIn: 'Connexion',
    signUp: 'Inscription',
    aboutUs: 'À Propos',
    contact: 'Contact',
    
    // Common
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
    speaking: 'En train de parler...',
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
