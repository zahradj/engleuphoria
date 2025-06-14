
import { LessonPlan, Resource } from '@/types/curriculum';

export interface LessonContent {
  id: string;
  title: string;
  phase: number;
  week: number;
  day: number;
  objective: string;
  duration: number; // minutes
  materials: LessonMaterial[];
  activities: LessonActivity[];
  assessment: AssessmentItem[];
  homework: HomeworkTask;
  nlpAnchor: string;
  teacherNotes: string[];
  adaptations: DifficultyAdaptation[];
}

export interface LessonMaterial {
  id: string;
  type: 'video' | 'audio' | 'interactive' | 'worksheet' | 'game' | 'flashcards';
  title: string;
  description: string;
  url?: string;
  content: any;
  duration?: number;
  instructions: string;
}

export interface LessonActivity {
  id: string;
  name: string;
  type: 'warm-up' | 'presentation' | 'practice' | 'production' | 'review';
  duration: number;
  description: string;
  instructions: string[];
  materials: string[];
  interaction: 'individual' | 'pair' | 'group' | 'whole-class';
  technology: boolean;
  vakElements: {
    visual: string;
    auditory: string;
    kinesthetic: string;
  };
}

export interface AssessmentItem {
  id: string;
  type: 'formative' | 'summative' | 'self-assessment' | 'peer-assessment';
  title: string;
  description: string;
  rubric: AssessmentRubric;
  points: number;
  timeLimit?: number;
}

export interface AssessmentRubric {
  criteria: {
    name: string;
    levels: {
      score: number;
      description: string;
    }[];
  }[];
}

export interface HomeworkTask {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  materials: string[];
  submissionType: 'written' | 'audio' | 'video' | 'digital';
  dueDate: string;
  rubric: AssessmentRubric;
}

export interface DifficultyAdaptation {
  level: 'support' | 'standard' | 'extension';
  description: string;
  modifications: string[];
}

class LessonContentService {
  private lessons: Map<string, LessonContent> = new Map();

  constructor() {
    this.generatePhase1Content();
    this.generatePhase2Content();
    this.generatePhase3Content();
    this.generatePhase4Content();
  }

  private generatePhase1Content() {
    // Week 1: Micro-Sentence Building
    this.addLesson({
      id: 'phase1_week1_day1',
      title: 'Building Your First English Sentences',
      phase: 1,
      week: 1,
      day: 1,
      objective: 'Students will construct basic Subject + Verb sentences with confidence',
      duration: 45,
      materials: [
        {
          id: 'sentence_blocks',
          type: 'interactive',
          title: 'Digital Sentence Building Blocks',
          description: 'Drag-and-drop interface for building sentences',
          content: {
            subjects: ['I', 'You', 'We', 'They', 'He', 'She', 'It'],
            verbs: ['study', 'play', 'eat', 'sleep', 'run', 'read', 'write', 'speak'],
            examples: ['I study', 'You play', 'We eat', 'They sleep']
          },
          instructions: 'Drag subjects and verbs to create meaningful sentences'
        },
        {
          id: 'pronunciation_guide',
          type: 'audio',
          title: 'Sentence Pronunciation Guide',
          description: 'Native speaker recordings of sentence patterns',
          content: {
            audioFiles: ['i_study.mp3', 'you_play.mp3', 'we_eat.mp3'],
            transcripts: ['I study', 'You play', 'We eat']
          },
          instructions: 'Listen and repeat each sentence 3 times'
        }
      ],
      activities: [
        {
          id: 'warm_up_greetings',
          name: 'Greeting Circle',
          type: 'warm-up',
          duration: 5,
          description: 'Students practice greeting with simple sentences',
          instructions: [
            'Stand in a circle',
            'Each student says "I am [name]"',
            'Response: "You are [name]"'
          ],
          materials: ['name tags'],
          interaction: 'whole-class',
          technology: false,
          vakElements: {
            visual: 'Name tags with colorful borders',
            auditory: 'Rhythmic chanting of sentences',
            kinesthetic: 'Standing and moving in circle'
          }
        },
        {
          id: 'sentence_building_demo',
          name: 'Sentence Building Demonstration',
          type: 'presentation',
          duration: 15,
          description: 'Teacher demonstrates sentence construction with visual blocks',
          instructions: [
            'Show physical sentence blocks',
            'Build sentences step by step',
            'Explain subject-verb relationship',
            'Get students to identify subjects and verbs'
          ],
          materials: ['physical sentence blocks', 'whiteboard'],
          interaction: 'whole-class',
          technology: false,
          vakElements: {
            visual: 'Colorful sentence blocks and diagrams',
            auditory: 'Clear pronunciation and rhythm',
            kinesthetic: 'Physical manipulation of blocks'
          }
        },
        {
          id: 'guided_practice',
          name: 'Guided Sentence Creation',
          type: 'practice',
          duration: 15,
          description: 'Students practice building sentences with support',
          instructions: [
            'Use digital sentence building tool',
            'Start with given subjects',
            'Choose appropriate verbs',
            'Read sentences aloud'
          ],
          materials: ['tablets/computers', 'digital sentence tool'],
          interaction: 'pair',
          technology: true,
          vakElements: {
            visual: 'Interactive digital interface',
            auditory: 'Peer pronunciation practice',
            kinesthetic: 'Touch screen interaction'
          }
        }
      ],
      assessment: [
        {
          id: 'sentence_completion',
          type: 'formative',
          title: 'Complete the Sentence',
          description: 'Students complete sentences with appropriate verbs',
          rubric: {
            criteria: [
              {
                name: 'Accuracy',
                levels: [
                  { score: 3, description: 'All sentences correct' },
                  { score: 2, description: 'Most sentences correct' },
                  { score: 1, description: 'Some sentences correct' }
                ]
              }
            ]
          },
          points: 10,
          timeLimit: 10
        }
      ],
      homework: {
        id: 'daily_sentence_journal',
        title: 'My Daily Sentence Journal',
        description: 'Write 5 sentences about your day using Subject + Verb pattern',
        estimatedTime: 15,
        materials: ['sentence journal', 'pencil'],
        submissionType: 'written',
        dueDate: 'next class',
        rubric: {
          criteria: [
            {
              name: 'Sentence Structure',
              levels: [
                { score: 3, description: 'Perfect Subject + Verb structure' },
                { score: 2, description: 'Minor errors in structure' },
                { score: 1, description: 'Major errors but attempt made' }
              ]
            }
          ]
        }
      },
      nlpAnchor: 'Feel the solid foundation forming as you place each word like a building block, creating your English sentence castle',
      teacherNotes: [
        'Emphasize rhythm and flow of sentences',
        'Encourage students who make mistakes',
        'Use gestures to reinforce subject-verb connection',
        'Monitor for native language interference'
      ],
      adaptations: [
        {
          level: 'support',
          description: 'Extra scaffolding for struggling learners',
          modifications: [
            'Provide sentence frames',
            'Use picture prompts',
            'Allow native language discussion first'
          ]
        },
        {
          level: 'extension',
          description: 'Challenges for advanced learners',
          modifications: [
            'Add time expressions',
            'Create compound sentences',
            'Peer teaching opportunities'
          ]
        }
      ]
    });

    // Add more Week 1 lessons...
    this.addLesson({
      id: 'phase1_week1_day2',
      title: 'Expanding Sentences with Objects',
      phase: 1,
      week: 1,
      day: 2,
      objective: 'Students will create Subject + Verb + Object sentences with confidence',
      duration: 45,
      materials: [
        {
          id: 'object_cards',
          type: 'flashcards',
          title: 'Object Vocabulary Cards',
          description: 'Visual cards showing common objects for sentence practice',
          content: {
            cards: [
              { image: 'book.jpg', word: 'book', sentence: 'I read a book' },
              { image: 'apple.jpg', word: 'apple', sentence: 'I eat an apple' },
              { image: 'game.jpg', word: 'game', sentence: 'I play a game' }
            ]
          },
          instructions: 'Match objects with appropriate verb actions'
        }
      ],
      activities: [
        {
          id: 'object_hunt',
          name: 'Classroom Object Hunt',
          type: 'warm-up',
          duration: 8,
          description: 'Students find objects and create sentences',
          instructions: [
            'Find 3 objects in the classroom',
            'Create sentences: "I see a [object]"',
            'Share with a partner'
          ],
          materials: ['classroom objects'],
          interaction: 'individual',
          technology: false,
          vakElements: {
            visual: 'Real objects and visual scanning',
            auditory: 'Sharing sentences with partner',
            kinesthetic: 'Moving around classroom'
          }
        }
      ],
      assessment: [
        {
          id: 'svo_creation',
          type: 'formative',
          title: 'Create Subject-Verb-Object Sentences',
          description: 'Students create 5 sentences using given prompts',
          rubric: {
            criteria: [
              {
                name: 'Structure',
                levels: [
                  { score: 3, description: 'Perfect S-V-O order' },
                  { score: 2, description: 'Minor word order issues' },
                  { score: 1, description: 'Significant structure problems' }
                ]
              }
            ]
          },
          points: 15
        }
      ],
      homework: {
        id: 'family_sentences',
        title: 'Family Activity Sentences',
        description: 'Write 5 sentences about what your family members do',
        estimatedTime: 20,
        materials: ['sentence worksheet'],
        submissionType: 'written',
        dueDate: 'next class',
        rubric: {
          criteria: [
            {
              name: 'Content',
              levels: [
                { score: 3, description: 'Creative and accurate sentences' },
                { score: 2, description: 'Good sentences with minor errors' },
                { score: 1, description: 'Basic sentences, some errors' }
              ]
            }
          ]
        }
      },
      nlpAnchor: 'See your sentences growing like a tree - first the trunk (subject + verb), now the branches (objects) reaching out',
      teacherNotes: [
        'Focus on article usage (a/an/the)',
        'Encourage personal examples',
        'Practice pronunciation of object words'
      ],
      adaptations: [
        {
          level: 'support',
          description: 'Additional support strategies',
          modifications: [
            'Provide object picture bank',
            'Use sentence templates',
            'Allow drawing + writing combination'
          ]
        }
      ]
    });
  }

  private generatePhase2Content() {
    // Week 5: Verb Pattern Recognition
    this.addLesson({
      id: 'phase2_week5_day1',
      title: 'Discovering Verb Patterns in Time',
      phase: 2,
      week: 5,
      day: 1,
      objective: 'Students will recognize and use present, past, and future verb patterns',
      duration: 45,
      materials: [
        {
          id: 'time_timeline',
          type: 'interactive',
          title: 'Interactive Time Timeline',
          description: 'Digital timeline showing verb tenses',
          content: {
            timeline: {
              past: { color: 'blue', verbs: ['played', 'studied', 'ate'] },
              present: { color: 'green', verbs: ['play', 'study', 'eat'] },
              future: { color: 'purple', verbs: ['will play', 'will study', 'will eat'] }
            }
          },
          instructions: 'Place verb forms on the correct time period'
        }
      ],
      activities: [
        {
          id: 'time_travel_game',
          name: 'Time Travel Verb Game',
          type: 'practice',
          duration: 20,
          description: 'Students change verb forms as they "travel" through time',
          instructions: [
            'Teacher calls out a time period',
            'Students change their verb to match',
            'Act out the verb in that time'
          ],
          materials: ['time period cards'],
          interaction: 'whole-class',
          technology: false,
          vakElements: {
            visual: 'Time period visual cards',
            auditory: 'Verb pronunciation practice',
            kinesthetic: 'Acting out verbs'
          }
        }
      ],
      assessment: [
        {
          id: 'tense_identification',
          type: 'formative',
          title: 'Identify the Time',
          description: 'Students identify verb tenses in sentences',
          rubric: {
            criteria: [
              {
                name: 'Recognition',
                levels: [
                  { score: 3, description: 'Identifies all tenses correctly' },
                  { score: 2, description: 'Most tenses identified' },
                  { score: 1, description: 'Some tenses identified' }
                ]
              }
            ]
          },
          points: 12
        }
      ],
      homework: {
        id: 'time_diary',
        title: 'My Time Diary',
        description: 'Write about yesterday, today, and tomorrow using different verb forms',
        estimatedTime: 25,
        materials: ['time diary template'],
        submissionType: 'written',
        dueDate: 'next class',
        rubric: {
          criteria: [
            {
              name: 'Tense Usage',
              levels: [
                { score: 3, description: 'Correct tense forms throughout' },
                { score: 2, description: 'Minor tense errors' },
                { score: 1, description: 'Some correct tense usage' }
              ]
            }
          ]
        }
      },
      nlpAnchor: 'Feel the rhythm of time flowing through your words - past flows to present flows to future like a river',
      teacherNotes: [
        'Use timeline gestures consistently',
        'Connect to students\' real experiences',
        'Practice irregular verbs gradually'
      ],
      adaptations: [
        {
          level: 'support',
          description: 'Support for tense learning',
          modifications: [
            'Provide verb conjugation charts',
            'Use color-coded time markers',
            'Focus on regular verbs first'
          ]
        }
      ]
    });
  }

  private generatePhase3Content() {
    // Week 9: Personal Description Context
    this.addLesson({
      id: 'phase3_week9_day1',
      title: 'Describing Myself and Others',
      phase: 3,
      week: 9,
      day: 1,
      objective: 'Students will create detailed personal descriptions using complex sentences',
      duration: 45,
      materials: [
        {
          id: 'description_builder',
          type: 'interactive',
          title: 'Personal Description Builder',
          description: 'Tool for creating detailed character descriptions',
          content: {
            categories: {
              appearance: ['tall', 'short', 'curly hair', 'brown eyes'],
              personality: ['friendly', 'creative', 'hardworking', 'funny'],
              interests: ['reading', 'sports', 'music', 'art']
            }
          },
          instructions: 'Combine adjectives and interests to create rich descriptions'
        }
      ],
      activities: [
        {
          id: 'identity_portraits',
          name: 'Living Identity Portraits',
          type: 'production',
          duration: 25,
          description: 'Students create and present personal identity portraits',
          instructions: [
            'Create a visual self-portrait',
            'Write descriptive sentences',
            'Present to class with confidence',
            'Ask follow-up questions'
          ],
          materials: ['art supplies', 'description templates'],
          interaction: 'individual',
          technology: false,
          vakElements: {
            visual: 'Self-portrait creation',
            auditory: 'Oral presentations',
            kinesthetic: 'Art creation and movement'
          }
        }
      ],
      assessment: [
        {
          id: 'description_presentation',
          type: 'summative',
          title: 'Personal Description Presentation',
          description: 'Students present detailed self-descriptions',
          rubric: {
            criteria: [
              {
                name: 'Language Complexity',
                levels: [
                  { score: 4, description: 'Uses complex sentences fluently' },
                  { score: 3, description: 'Good use of complex structures' },
                  { score: 2, description: 'Some complex language attempted' },
                  { score: 1, description: 'Basic language only' }
                ]
              },
              {
                name: 'Content Depth',
                levels: [
                  { score: 4, description: 'Rich, detailed descriptions' },
                  { score: 3, description: 'Good detail and variety' },
                  { score: 2, description: 'Adequate descriptions' },
                  { score: 1, description: 'Basic descriptions' }
                ]
              }
            ]
          },
          points: 20
        }
      ],
      homework: {
        id: 'family_portrait_writing',
        title: 'Family Portrait in Words',
        description: 'Write detailed descriptions of three family members',
        estimatedTime: 30,
        materials: ['family photos', 'description worksheet'],
        submissionType: 'written',
        dueDate: 'next class',
        rubric: {
          criteria: [
            {
              name: 'Descriptive Language',
              levels: [
                { score: 3, description: 'Vivid, varied descriptions' },
                { score: 2, description: 'Good descriptive language' },
                { score: 1, description: 'Basic descriptions' }
              ]
            }
          ]
        }
      },
      nlpAnchor: 'Feel yourself painting with words, each sentence adding another brushstroke to your unique portrait',
      teacherNotes: [
        'Encourage cultural sensitivity',
        'Model inclusive language',
        'Celebrate diversity in descriptions'
      ],
      adaptations: [
        {
          level: 'support',
          description: 'Support for descriptive language',
          modifications: [
            'Provide adjective word banks',
            'Use sentence frames',
            'Allow visual supports'
          ]
        }
      ]
    });
  }

  private generatePhase4Content() {
    // Week 17: Complex Thought Expression
    this.addLesson({
      id: 'phase4_week17_day1',
      title: 'Expressing Complex Ideas and Opinions',
      phase: 4,
      week: 17,
      day: 1,
      objective: 'Students will express complex thoughts using sophisticated language structures',
      duration: 45,
      materials: [
        {
          id: 'argument_builder',
          type: 'interactive',
          title: 'Argument Construction Tool',
          description: 'Digital tool for building logical arguments',
          content: {
            structures: {
              opinion: ['I believe that...', 'In my opinion...', 'It seems to me that...'],
              evidence: ['For example...', 'Research shows...', 'This is evident because...'],
              conclusion: ['Therefore...', 'In conclusion...', 'This leads me to believe...']
            }
          },
          instructions: 'Build persuasive arguments using logical structure'
        }
      ],
      activities: [
        {
          id: 'debate_preparation',
          name: 'Structured Debate Preparation',
          type: 'production',
          duration: 30,
          description: 'Students prepare arguments for classroom debate',
          instructions: [
            'Choose a position on given topic',
            'Research supporting evidence',
            'Prepare counterarguments',
            'Practice delivery with partner'
          ],
          materials: ['research materials', 'argument templates'],
          interaction: 'pair',
          technology: true,
          vakElements: {
            visual: 'Argument mapping diagrams',
            auditory: 'Practice presentations',
            kinesthetic: 'Active research and note-taking'
          }
        }
      ],
      assessment: [
        {
          id: 'argumentative_essay',
          type: 'summative',
          title: 'Persuasive Argument Presentation',
          description: 'Students present well-structured arguments',
          rubric: {
            criteria: [
              {
                name: 'Argument Structure',
                levels: [
                  { score: 4, description: 'Clear, logical argument flow' },
                  { score: 3, description: 'Good argument structure' },
                  { score: 2, description: 'Basic argument organization' },
                  { score: 1, description: 'Unclear argument structure' }
                ]
              },
              {
                name: 'Language Sophistication',
                levels: [
                  { score: 4, description: 'Advanced vocabulary and structures' },
                  { score: 3, description: 'Good language variety' },
                  { score: 2, description: 'Adequate language use' },
                  { score: 1, description: 'Basic language only' }
                ]
              }
            ]
          },
          points: 25
        }
      ],
      homework: {
        id: 'opinion_essay',
        title: 'My Perspective Essay',
        description: 'Write a 300-word essay expressing your opinion on a chosen topic',
        estimatedTime: 45,
        materials: ['essay template', 'research sources'],
        submissionType: 'written',
        dueDate: 'next week',
        rubric: {
          criteria: [
            {
              name: 'Argument Development',
              levels: [
                { score: 4, description: 'Sophisticated argument development' },
                { score: 3, description: 'Good argument progression' },
                { score: 2, description: 'Basic argument structure' },
                { score: 1, description: 'Unclear argument' }
              ]
            }
          ]
        }
      },
      nlpAnchor: 'Feel your thoughts taking flight on wings of words, soaring to new heights of expression and understanding',
      teacherNotes: [
        'Encourage critical thinking',
        'Model respectful disagreement',
        'Focus on evidence-based arguments'
      ],
      adaptations: [
        {
          level: 'support',
          description: 'Support for complex expression',
          modifications: [
            'Provide argument sentence frames',
            'Use graphic organizers',
            'Allow multimedia presentations'
          ]
        }
      ]
    });
  }

  private addLesson(lesson: LessonContent) {
    this.lessons.set(lesson.id, lesson);
  }

  getLessonsByPhase(phase: number): LessonContent[] {
    return Array.from(this.lessons.values()).filter(lesson => lesson.phase === phase);
  }

  getLessonsByWeek(phase: number, week: number): LessonContent[] {
    return Array.from(this.lessons.values()).filter(
      lesson => lesson.phase === phase && lesson.week === week
    );
  }

  getLesson(id: string): LessonContent | undefined {
    return this.lessons.get(id);
  }

  getAllLessons(): LessonContent[] {
    return Array.from(this.lessons.values());
  }

  searchLessons(query: string): LessonContent[] {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.lessons.values()).filter(lesson =>
      lesson.title.toLowerCase().includes(lowercaseQuery) ||
      lesson.objective.toLowerCase().includes(lowercaseQuery) ||
      lesson.activities.some(activity => 
        activity.name.toLowerCase().includes(lowercaseQuery)
      )
    );
  }
}

export const lessonContentService = new LessonContentService();
