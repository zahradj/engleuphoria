// Standalone phonics progression — Playground-first, systematic synthetic phonics.
// Order is canonical and must not be shuffled.

import type { PhonicsUnit } from '../types';

export const PHONICS_PROGRESSION: PhonicsUnit[] = [
  {
    id: 'ph_u1', order: 1,
    graphemes: ['s', 'a', 't', 'p'],
    phonemes: ['/s/', '/æ/', '/t/', '/p/'],
    skill: 'phonemic_awareness',
    sight_words: ['a', 'at'],
    reading_stage: 'pre_reader',
  },
  {
    id: 'ph_u2', order: 2,
    graphemes: ['i', 'n', 'm', 'd'],
    phonemes: ['/ɪ/', '/n/', '/m/', '/d/'],
    skill: 'phonemic_awareness',
    sight_words: ['in', 'and', 'is'],
    reading_stage: 'pre_reader',
  },
  {
    id: 'ph_u3', order: 3,
    graphemes: ['g', 'o', 'c', 'k'],
    phonemes: ['/g/', '/ɒ/', '/k/', '/k/'],
    skill: 'blending',
    blend_targets: ['sat', 'pat', 'tap', 'tin', 'man', 'dog', 'cat'],
    sight_words: ['it', 'on', 'can'],
    reading_stage: 'early_decoder',
  },
  {
    id: 'ph_u4', order: 4,
    graphemes: ['e', 'u', 'r', 'h', 'b'],
    phonemes: ['/e/', '/ʌ/', '/r/', '/h/', '/b/'],
    skill: 'blending',
    blend_targets: ['red', 'run', 'hen', 'bag', 'bus'],
    sight_words: ['he', 'be', 'no'],
    reading_stage: 'early_decoder',
  },
  {
    id: 'ph_u5', order: 5,
    graphemes: ['f', 'l', 'j', 'v', 'w'],
    phonemes: ['/f/', '/l/', '/dʒ/', '/v/', '/w/'],
    skill: 'segmenting',
    blend_targets: ['fan', 'log', 'jam', 'van', 'win'],
    sight_words: ['I', 'go', 'we', 'me'],
    reading_stage: 'early_decoder',
  },
  {
    id: 'ph_u6', order: 6,
    graphemes: ['y', 'x', 'z', 'qu'],
    phonemes: ['/j/', '/ks/', '/z/', '/kw/'],
    skill: 'decoding',
    blend_targets: ['yes', 'box', 'zip', 'quiz'],
    sight_words: ['yes', 'see', 'you'],
    reading_stage: 'developing_decoder',
  },
  {
    id: 'ph_u7', order: 7,
    graphemes: ['ch', 'sh', 'th', 'ng'],
    phonemes: ['/tʃ/', '/ʃ/', '/θ/', '/ŋ/'],
    skill: 'decoding',
    blend_targets: ['chip', 'ship', 'thin', 'sing'],
    sight_words: ['the', 'this', 'they'],
    reading_stage: 'developing_decoder',
  },
  {
    id: 'ph_u8', order: 8,
    graphemes: ['ai', 'ee', 'oa', 'oo'],
    phonemes: ['/eɪ/', '/iː/', '/əʊ/', '/uː/'],
    skill: 'decoding',
    blend_targets: ['rain', 'see', 'boat', 'moon'],
    sight_words: ['my', 'are', 'said'],
    reading_stage: 'fluent_decoder',
  },
];

export function unitsForReadingStage(stage: PhonicsUnit['reading_stage']): PhonicsUnit[] {
  return PHONICS_PROGRESSION.filter((u) => u.reading_stage === stage);
}

export function nextPhonicsUnit(completedIds: string[]): PhonicsUnit | null {
  for (const u of PHONICS_PROGRESSION) {
    if (!completedIds.includes(u.id)) return u;
  }
  return null;
}
