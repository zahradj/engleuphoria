// Early Learners Library Types - Foundation Level (Ages 5-7)

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type LessonStatus = 'draft' | 'published' | 'archived';

export type SlideType = 
  | 'warmup' 
  | 'phonics_intro' 
  | 'letter_sound_practice' 
  | 'word_blending' 
  | 'drag_drop_game' 
  | 'matching_game' 
  | 'listening_exercise' 
  | 'speaking_practice' 
  | 'assessment' 
  | 'reward';

export type InteractiveElementType = 
  | 'drag_drop' 
  | 'matching' 
  | 'click_select' 
  | 'trace' 
  | 'speak'
  | 'sort'
  | 'tap';

// Main Lesson Structure
export interface EarlyLearnersLesson {
  id: string;
  title: string;
  topic: string;
  phonicsFocus: string;
  lessonNumber: number;
  difficultyLevel: DifficultyLevel;
  learningObjectives: string[];
  durationMinutes: number;
  status: LessonStatus;
  slides?: EarlyLearnersSlide[];
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Slide Structure
export interface EarlyLearnersSlide {
  id: string;
  lessonId: string;
  slideNumber: number;
  slideType: SlideType;
  title?: string;
  content: SlideContent;
  imagePrompt?: string;
  imageUrl?: string;
  audioText?: string;
  audioUrl?: string;
  phonicsSounds?: PhonicsSound[];
  interactiveElements?: InteractiveElement[];
  gamification?: GamificationConfig;
  createdAt?: Date;
}

// Slide Content
export interface SlideContent {
  instructions: string;
  teacherNotes?: string;
  mainContent: string;
  questions?: Question[];
  words?: string[];
  images?: string[];
  examples?: string[];
  activities?: Activity[];
}

// Activity Definition
export interface Activity {
  type: string;
  title: string;
  description: string;
  duration?: number;
  materials?: string[];
}

// Phonics Sound
export interface PhonicsSound {
  letter: string;
  sound: string;
  audioUrl: string;
  examples: string[];
  imageUrl?: string;
}

// Interactive Element
export interface InteractiveElement {
  type: InteractiveElementType;
  items: InteractiveItem[];
  correctAnswers: string[] | number[];
  hints?: string[];
  feedback?: {
    correct: string;
    incorrect: string;
  };
}

export interface InteractiveItem {
  id: string;
  content: string;
  imageUrl?: string;
  audioUrl?: string;
  position?: number;
  targetId?: string; // For drag-drop and matching
}

// Gamification
export interface GamificationConfig {
  pointsPerCorrect: number;
  starsToEarn: number;
  badge?: string;
  badgeIcon?: string;
  motivationalText: string[];
  adaptiveHints: boolean;
  showProgress: boolean;
  celebrationAnimation?: string;
}

// Question Types
export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'audio_recognition' | 'image_select';
  options?: string[];
  correctAnswer: string;
  audioPrompt?: string;
  imageUrl?: string;
  explanation?: string;
}

// Multimedia Assets
export interface MultimediaAsset {
  id: string;
  assetType: 'image' | 'audio' | 'phonics';
  prompt: string;
  assetUrl: string;
  metadata?: AssetMetadata;
  cacheKey?: string;
  createdAt: Date;
}

export interface AssetMetadata {
  width?: number;
  height?: number;
  duration?: number;
  format?: string;
  size?: number;
  generatedBy?: string;
  style?: string;
}

// Student Progress
export interface StudentProgress {
  id: string;
  studentId: string;
  lessonId: string;
  slideId?: string;
  score?: number;
  starsEarned?: number;
  badgesEarned?: Badge[];
  completedAt?: Date;
  attempts: number;
  timeSpentSeconds?: number;
  createdAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: Date;
}

// Lesson Generation Request
export interface LessonGenerationRequest {
  topic: string;
  phonicsFocus: string;
  lessonNumber: number;
  difficultyLevel: DifficultyLevel;
  learningObjectives?: string[];
  ageRange?: string;
}

// Lesson Generation Response
export interface LessonGenerationResponse {
  lesson: EarlyLearnersLesson;
  slides: EarlyLearnersSlide[];
  assets: MultimediaAsset[];
  status: 'success' | 'partial' | 'failed';
  errors?: string[];
}

// Asset Generation Status
export interface AssetGenerationStatus {
  total: number;
  completed: number;
  failed: number;
  pending: number;
  progress: number; // 0-100
  errors: AssetGenerationError[];
}

export interface AssetGenerationError {
  assetId: string;
  assetType: string;
  error: string;
  retryable: boolean;
}

// Validation Result
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'critical';
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// Library Statistics
export interface LibraryStatistics {
  totalLessons: number;
  publishedLessons: number;
  draftLessons: number;
  archivedLessons: number;
  totalSlides: number;
  totalAssets: number;
  lastUpdated: Date;
}

// Lesson Template
export interface LessonTemplate {
  name: string;
  description: string;
  slideStructure: SlideTemplateItem[];
  defaultDuration: number;
  recommendedAgeRange: string;
}

export interface SlideTemplateItem {
  slideNumber: number;
  slideType: SlideType;
  title: string;
  description: string;
  requiredElements: string[];
}

// Filter Options
export interface LessonFilterOptions {
  status?: LessonStatus[];
  difficultyLevel?: DifficultyLevel[];
  phonicsFocus?: string[];
  searchQuery?: string;
  sortBy?: 'lesson_number' | 'created_at' | 'updated_at' | 'title';
  sortOrder?: 'asc' | 'desc';
}