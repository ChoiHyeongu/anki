import type { Deck } from '@/components/deck';
import type { FlashcardBackProps } from '@/components/flashcard/FlashcardBack';
import type { FlashcardFrontProps } from '@/components/flashcard/FlashcardFront';

export interface MockCard {
  id: string;
  front: FlashcardFrontProps;
  back: FlashcardBackProps;
}

export const mockDecks: Deck[] = [
  {
    id: '1',
    title: 'TOEIC Advanced',
    stats: { review: 0, learning: 0, new: 0 },
    detailedStats: { total: 1200, mature: 1200, learning: 0 },
    progress: 100,
    learningProgress: 0,
    isCompleted: true,
  },
  {
    id: '2',
    title: 'TOEIC Essential 2000',
    stats: { review: 12, learning: 5, new: 0 },
    detailedStats: { total: 2000, mature: 1440, learning: 240 },
    progress: 72,
    learningProgress: 12,
  },
  {
    id: '3',
    title: 'Travel English',
    stats: { review: 0, learning: 0, new: 50 },
    detailedStats: { total: 500, mature: 0, learning: 0 },
    progress: 0,
    learningProgress: 0,
  },
  {
    id: '4',
    title: 'Daily Conversational',
    stats: { review: 34, learning: 18, new: 20 },
    detailedStats: { total: 850, mature: 272, learning: 153 },
    progress: 32,
    learningProgress: 18,
  },
  {
    id: '5',
    title: 'Advanced GRE Vocab',
    stats: { review: 0, learning: 0, new: 50 },
    detailedStats: { total: 1500, mature: 1425, learning: 30 },
    progress: 95,
    learningProgress: 2,
  },
];

export const mockCards: MockCard[] = [
  {
    id: '1',
    front: {
      word: 'Resilient',
      phonetic: '/rɪˈzɪliənt/',
    },
    back: {
      definition: '회복력 있는, 탄력 있는',
      example: 'She is remarkably resilient in the face of adversity.',
      synonyms: ['tough', 'strong', 'hardy'],
    },
  },
  {
    id: '2',
    front: {
      word: 'Ubiquitous',
      phonetic: '/juːˈbɪkwɪtəs/',
    },
    back: {
      definition: '어디에나 있는, 편재하는',
      example: 'Smartphones have become ubiquitous in modern society.',
      synonyms: ['omnipresent', 'everywhere', 'universal'],
    },
  },
  {
    id: '3',
    front: {
      word: 'Ephemeral',
      phonetic: '/ɪˈfemərəl/',
    },
    back: {
      definition: '일시적인, 순간적인',
      example: 'The ephemeral beauty of cherry blossoms.',
      synonyms: ['fleeting', 'transient', 'momentary'],
    },
  },
  {
    id: '4',
    front: {
      word: 'Pragmatic',
      phonetic: '/præɡˈmætɪk/',
    },
    back: {
      definition: '실용적인, 현실적인',
      example: 'We need a pragmatic approach to solve this problem.',
      synonyms: ['practical', 'realistic', 'sensible'],
    },
  },
  {
    id: '5',
    front: {
      word: 'Eloquent',
      phonetic: '/ˈeləkwənt/',
    },
    back: {
      definition: '웅변의, 유창한',
      example: 'She gave an eloquent speech that moved the audience.',
      synonyms: ['articulate', 'fluent', 'expressive'],
    },
  },
];

export const mockSessionStats = {
  studied: 25,
  correct: 20,
  timeSpent: 480,
  newLearned: 8,
};
