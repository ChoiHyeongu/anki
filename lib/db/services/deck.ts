/**
 * Deck Service
 * High-level deck operations and statistics
 */
import { getAllDecks, getDeckById, getDeckCardCount } from '../repositories/deck';
import { getDeckStats } from '../repositories/progress';
import { getDailyNewCardLimit } from '../repositories/settings';
import type { DbDeck, DeckStats } from '../types';

/**
 * Deck with today's study stats (for dashboard)
 */
export interface DeckWithStats {
  id: string;
  title: string;
  description: string | null;
  // Today's due counts
  newCount: number;
  learningCount: number;
  reviewCount: number;
  // Overall stats
  totalCards: number;
  youngCards: number; // review status with interval < 21 days
  matureCards: number; // review status with interval >= 21 days
  // Timing
  nextDueDate: number | null; // earliest due date for any card
  // Computed
  progress: number; // percentage of mature cards
  isCompleted: boolean;
}

/**
 * Get all decks with their study statistics for the dashboard
 */
export async function getAllDecksWithStats(): Promise<DeckWithStats[]> {
  const decks = await getAllDecks();
  const dailyLimit = await getDailyNewCardLimit();
  const now = Date.now();

  const decksWithStats: DeckWithStats[] = [];

  for (const deck of decks) {
    const stats = await getDeckStats(deck.id, dailyLimit, now);

    const progress =
      stats.totalCards > 0
        ? Math.round((stats.matureCards / stats.totalCards) * 100)
        : 0;

    const isCompleted =
      stats.newCount === 0 && stats.learningCount === 0 && stats.reviewCount === 0;

    decksWithStats.push({
      id: deck.id,
      title: deck.title,
      description: deck.description,
      newCount: stats.newCount,
      learningCount: stats.learningCount,
      reviewCount: stats.reviewCount,
      totalCards: stats.totalCards,
      youngCards: stats.youngCards,
      matureCards: stats.matureCards,
      nextDueDate: stats.nextDueDate,
      progress,
      isCompleted,
    });
  }

  return decksWithStats;
}

/**
 * Get a single deck with its stats
 */
export async function getDeckWithStats(deckId: string): Promise<DeckWithStats | null> {
  const deck = await getDeckById(deckId);
  if (!deck) return null;

  const dailyLimit = await getDailyNewCardLimit();
  const stats = await getDeckStats(deckId, dailyLimit);

  const progress =
    stats.totalCards > 0
      ? Math.round((stats.matureCards / stats.totalCards) * 100)
      : 0;

  const isCompleted =
    stats.newCount === 0 && stats.learningCount === 0 && stats.reviewCount === 0;

  return {
    id: deck.id,
    title: deck.title,
    description: deck.description,
    newCount: stats.newCount,
    learningCount: stats.learningCount,
    reviewCount: stats.reviewCount,
    totalCards: stats.totalCards,
    youngCards: stats.youngCards,
    matureCards: stats.matureCards,
    nextDueDate: stats.nextDueDate,
    progress,
    isCompleted,
  };
}

/**
 * Get summary stats for all decks combined
 */
export async function getTotalDeckStats(): Promise<{
  totalDecks: number;
  totalCards: number;
  totalDue: number;
  completedDecks: number;
}> {
  const decksWithStats = await getAllDecksWithStats();

  let totalCards = 0;
  let totalDue = 0;
  let completedDecks = 0;

  for (const deck of decksWithStats) {
    totalCards += deck.totalCards;
    totalDue += deck.newCount + deck.learningCount + deck.reviewCount;
    if (deck.isCompleted && deck.totalCards > 0) {
      completedDecks++;
    }
  }

  return {
    totalDecks: decksWithStats.length,
    totalCards,
    totalDue,
    completedDecks,
  };
}

/**
 * Check if any deck has cards to study today
 */
export async function hasAnyDueCards(): Promise<boolean> {
  const decksWithStats = await getAllDecksWithStats();
  return decksWithStats.some(
    (deck) => deck.newCount > 0 || deck.learningCount > 0 || deck.reviewCount > 0
  );
}
