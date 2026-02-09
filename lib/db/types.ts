/**
 * Database entity types
 * These map directly to table rows
 */

import type { CardState, CardStatus } from '@/lib/srs';

/**
 * Deck entity (from decks table)
 */
export interface DbDeck {
  id: string;
  title: string;
  description: string | null;
  created_at: number; // Unix timestamp (ms)
}

/**
 * Card entity (from cards table)
 */
export interface DbCard {
  id: string;
  deck_id: string;
  front_word: string;
  front_phonetic: string | null;
  back_definition: string;
  back_example: string | null;
  back_synonyms: string | null; // JSON array string
  created_at: number;
}

/**
 * Card progress entity (from card_progress table)
 * Maps to CardState from lib/srs
 */
export interface DbCardProgress {
  card_id: string;
  status: CardStatus;
  interval: number;
  ease: number;
  due_date: number; // Unix timestamp (ms)
  learning_step: number;
  lapse_count: number;
  review_count: number;
  last_reviewed_at: number | null;
}

/**
 * Review log entity (from review_logs table)
 */
export interface DbReviewLog {
  id: number;
  card_id: string;
  rating: 1 | 2 | 3 | 4;
  reviewed_at: number;
  time_taken_ms: number | null;
  prev_state: string | null; // JSON string of CardState
}

/**
 * Settings entity (from settings table)
 */
export interface DbSetting {
  key: string;
  value: string;
}

/**
 * Card with its progress state (JOIN result)
 */
export interface DbCardWithProgress extends DbCard {
  progress: DbCardProgress;
}

/**
 * Deck statistics for dashboard display
 */
export interface DeckStats {
  deckId: string;
  newCount: number;      // Cards with status 'new' (limited by daily limit)
  learningCount: number; // Cards with status 'learning' or 'relearning' due now
  reviewCount: number;   // Cards with status 'review' due now
  totalCards: number;    // Total cards in deck
  youngCards: number;    // Cards with status 'review' and interval < 21 days
  matureCards: number;   // Cards with status 'review' and interval >= 21 days
  nextDueDate: number | null; // Earliest due date for any card (future)
}

/**
 * Input for creating a new deck
 */
export interface CreateDeckInput {
  id?: string;
  title: string;
  description?: string;
}

/**
 * Input for creating a new card
 */
export interface CreateCardInput {
  id?: string;
  deckId: string;
  frontWord: string;
  frontPhonetic?: string;
  backDefinition: string;
  backExample?: string;
  backSynonyms?: string[];
}

/**
 * Input for updating card progress
 */
export interface UpdateProgressInput {
  cardId: string;
  state: CardState;
}

/**
 * Convert DbCardProgress to CardState (lib/srs format)
 */
export function dbProgressToCardState(progress: DbCardProgress): CardState {
  return {
    status: progress.status,
    interval: progress.interval,
    ease: progress.ease,
    dueDate: progress.due_date,
    learningStep: progress.learning_step,
    lapseCount: progress.lapse_count,
    reviewCount: progress.review_count,
  };
}

/**
 * Convert CardState to DbCardProgress format
 */
export function cardStateToDbProgress(
  cardId: string,
  state: CardState,
  lastReviewedAt?: number
): Omit<DbCardProgress, 'last_reviewed_at'> & { last_reviewed_at: number | null } {
  return {
    card_id: cardId,
    status: state.status,
    interval: state.interval,
    ease: state.ease,
    due_date: state.dueDate,
    learning_step: state.learningStep,
    lapse_count: state.lapseCount,
    review_count: state.reviewCount,
    last_reviewed_at: lastReviewedAt ?? null,
  };
}

/**
 * Parse synonyms from JSON string
 */
export function parseSynonyms(synonymsJson: string | null): string[] {
  if (!synonymsJson) return [];
  try {
    const parsed = JSON.parse(synonymsJson);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Stringify synonyms to JSON
 */
export function stringifySynonyms(synonyms?: string[]): string | null {
  if (!synonyms || synonyms.length === 0) return null;
  return JSON.stringify(synonyms);
}
