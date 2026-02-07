/**
 * Database Seed Data
 * Initial decks and sample cards for the app
 */
import { createDecks, deckExists } from './repositories/deck';
import { createCards } from './repositories/card';
import { initializeSettings } from './repositories/settings';
import type { CreateDeckInput, CreateCardInput } from './types';

const INITIAL_DECKS: CreateDeckInput[] = [
  {
    id: 'deck-toeic-essential',
    title: 'TOEIC Essential 2000',
    description: 'Essential vocabulary for TOEIC test preparation',
  },
  {
    id: 'deck-toeic-advanced',
    title: 'TOEIC Advanced',
    description: 'Advanced vocabulary for high TOEIC scores',
  },
  {
    id: 'deck-travel-english',
    title: 'Travel English',
    description: 'Useful phrases and vocabulary for traveling',
  },
  {
    id: 'deck-daily-conversation',
    title: 'Daily Conversational',
    description: 'Common expressions for everyday conversations',
  },
  {
    id: 'deck-gre-vocab',
    title: 'Advanced GRE Vocab',
    description: 'High-level vocabulary for GRE preparation',
  },
];

const SAMPLE_CARDS: CreateCardInput[] = [
  // TOEIC Essential
  {
    deckId: 'deck-toeic-essential',
    frontWord: 'Resilient',
    frontPhonetic: '/rɪˈzɪliənt/',
    backDefinition: '회복력 있는, 탄력 있는',
    backExample: 'She is remarkably resilient in the face of adversity.',
    backSynonyms: ['tough', 'strong', 'hardy'],
  },
  {
    deckId: 'deck-toeic-essential',
    frontWord: 'Ubiquitous',
    frontPhonetic: '/juːˈbɪkwɪtəs/',
    backDefinition: '어디에나 있는, 편재하는',
    backExample: 'Smartphones have become ubiquitous in modern society.',
    backSynonyms: ['omnipresent', 'everywhere', 'universal'],
  },
  {
    deckId: 'deck-toeic-essential',
    frontWord: 'Pragmatic',
    frontPhonetic: '/præɡˈmætɪk/',
    backDefinition: '실용적인, 현실적인',
    backExample: 'We need a pragmatic approach to solve this problem.',
    backSynonyms: ['practical', 'realistic', 'sensible'],
  },
  {
    deckId: 'deck-toeic-essential',
    frontWord: 'Eloquent',
    frontPhonetic: '/ˈeləkwənt/',
    backDefinition: '웅변의, 유창한',
    backExample: 'She gave an eloquent speech that moved the audience.',
    backSynonyms: ['articulate', 'fluent', 'expressive'],
  },
  {
    deckId: 'deck-toeic-essential',
    frontWord: 'Diligent',
    frontPhonetic: '/ˈdɪlɪdʒənt/',
    backDefinition: '근면한, 성실한',
    backExample: 'She is a diligent student who always completes her work on time.',
    backSynonyms: ['industrious', 'hardworking', 'conscientious'],
  },

  // GRE Vocab
  {
    deckId: 'deck-gre-vocab',
    frontWord: 'Ephemeral',
    frontPhonetic: '/ɪˈfemərəl/',
    backDefinition: '일시적인, 순간적인',
    backExample: 'The ephemeral beauty of cherry blossoms.',
    backSynonyms: ['fleeting', 'transient', 'momentary'],
  },
  {
    deckId: 'deck-gre-vocab',
    frontWord: 'Sycophant',
    frontPhonetic: '/ˈsɪkəfænt/',
    backDefinition: '아첨꾼, 아부하는 사람',
    backExample: 'The boss was surrounded by sycophants who agreed with everything.',
    backSynonyms: ['flatterer', 'toady', 'yes-man'],
  },
  {
    deckId: 'deck-gre-vocab',
    frontWord: 'Obfuscate',
    frontPhonetic: '/ˈɒbfʌskeɪt/',
    backDefinition: '혼란시키다, 모호하게 하다',
    backExample: 'The politician tried to obfuscate the issue with complex jargon.',
    backSynonyms: ['confuse', 'obscure', 'muddle'],
  },

  // Daily Conversation
  {
    deckId: 'deck-daily-conversation',
    frontWord: 'Get the hang of',
    frontPhonetic: '/ɡet ðə hæŋ əv/',
    backDefinition: '~의 요령을 터득하다',
    backExample: "It took me a while, but I'm starting to get the hang of it.",
    backSynonyms: ['master', 'learn', 'understand'],
  },
  {
    deckId: 'deck-daily-conversation',
    frontWord: 'Break the ice',
    frontPhonetic: '/breɪk ðə aɪs/',
    backDefinition: '어색한 분위기를 깨다',
    backExample: 'He told a joke to break the ice at the meeting.',
    backSynonyms: ['start conversation', 'warm up', 'begin'],
  },

  // Travel English
  {
    deckId: 'deck-travel-english',
    frontWord: 'Where is the nearest...?',
    frontPhonetic: '/weər ɪz ðə ˈnɪərɪst/',
    backDefinition: '가장 가까운 ~가 어디인가요?',
    backExample: 'Where is the nearest subway station?',
    backSynonyms: ['closest', 'nearby'],
  },
  {
    deckId: 'deck-travel-english',
    frontWord: 'I have a reservation',
    frontPhonetic: '/aɪ hæv ə ˌrezərˈveɪʃən/',
    backDefinition: '예약이 있습니다',
    backExample: 'Hello, I have a reservation under the name Kim.',
    backSynonyms: ['booking', 'appointment'],
  },
];

/**
 * Check if database has been seeded
 */
export async function isDatabaseSeeded(): Promise<boolean> {
  return deckExists(INITIAL_DECKS[0].id!);
}

/**
 * Seed the database with initial data
 * Only runs if database hasn't been seeded yet
 */
export async function seedDatabase(): Promise<void> {
  const alreadySeeded = await isDatabaseSeeded();
  if (alreadySeeded) {
    console.log('[DB] Database already seeded, skipping');
    return;
  }

  console.log('[DB] Seeding database...');

  await initializeSettings();
  await createDecks(INITIAL_DECKS);
  console.log(`[DB] Created ${INITIAL_DECKS.length} decks`);

  await createCards(SAMPLE_CARDS);
  console.log(`[DB] Created ${SAMPLE_CARDS.length} sample cards`);

  console.log('[DB] Database seeding complete');
}

/**
 * Force reseed the database (for development)
 * Warning: This will reset all progress!
 */
export async function forceSeedDatabase(): Promise<void> {
  const { resetDatabase } = await import('./index');
  await resetDatabase();
  await seedDatabase();
}

// Export data for testing
export { INITIAL_DECKS, SAMPLE_CARDS };
