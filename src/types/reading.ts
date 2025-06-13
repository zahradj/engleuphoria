
export interface EpicBook {
  id: string;
  title: string;
  author: string;
  description: string;
  thumbnail: string;
  epicUrl: string;
  readingLevel: string;
  lexileLevel?: number;
  genre: string[];
  ageRange: string;
  estimatedMinutes: number;
  tags: string[];
  assignedBy?: string;
  assignedAt?: Date;
  isRequired: boolean;
}

export interface ReadingAssignment {
  id: string;
  bookId: string;
  studentId: string;
  assignedBy: string;
  assignedAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  readingTime?: number;
  xpReward: number;
  status: 'assigned' | 'reading' | 'completed';
}

export interface ReadingProgress {
  studentId: string;
  bookId: string;
  lastReadAt: Date;
  totalReadingTime: number;
  currentPage?: number;
  totalPages?: number;
  completionPercentage: number;
}
