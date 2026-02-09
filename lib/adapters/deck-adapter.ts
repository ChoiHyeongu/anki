/**
 * Deck Adapter
 * Transforms database deck types to UI-compatible types
 */
import type { DeckWithStats } from '@/lib/db/services/deck';
import type { Deck } from '@/components/deck/DeckList/DeckList.type';
import type { DeckStats, DeckDetailedStats } from '@/components/deck/DeckCard/DeckCard.type';

/**
 * Transform a single DeckWithStats from DB to UI Deck format
 */
export function adaptDeckToUI(dbDeck: DeckWithStats): Deck {
  // Today's due counts for the right side badges
  const stats: DeckStats = {
    review: dbDeck.reviewCount,
    learning: dbDeck.learningCount,
    new: dbDeck.newCount,
  };

  // Detailed stats for the bottom row
  const detailedStats: DeckDetailedStats = {
    total: dbDeck.totalCards,
    young: dbDeck.youngCards,
    mature: dbDeck.matureCards,
    learning: dbDeck.learningCount,
  };

  // Calculate young progress (percentage of young cards - review with interval < 21 days)
  const youngProgress =
    dbDeck.totalCards > 0
      ? Math.round((dbDeck.youngCards / dbDeck.totalCards) * 100)
      : 0;

  // Calculate learning progress (percentage of cards in learning/relearning status)
  const learningProgress =
    dbDeck.totalCards > 0
      ? Math.round((dbDeck.learningCount / dbDeck.totalCards) * 100)
      : 0;

  return {
    id: dbDeck.id,
    title: dbDeck.title,
    stats,
    detailedStats,
    progress: dbDeck.progress, // mature card percentage (0-100)
    youngProgress: Math.max(0, youngProgress), // ensure non-negative
    learningProgress: Math.max(0, learningProgress), // ensure non-negative
    nextDueDate: dbDeck.nextDueDate,
    isCompleted: dbDeck.isCompleted,
  };
}

/**
 * Transform multiple DeckWithStats to UI Deck format
 */
export function adaptDecksToUI(dbDecks: DeckWithStats[]): Deck[] {
  return dbDecks.map(adaptDeckToUI);
}

/**
 * Calculate total due cards for a deck
 */
export function getTotalDueCount(stats: DeckStats): number {
  return stats.review + stats.learning + stats.new;
}

/**
 * Check if a deck has any cards to study today
 */
export function hasDueCards(stats: DeckStats): boolean {
  return getTotalDueCount(stats) > 0;
}
