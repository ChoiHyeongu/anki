import type { DeckStats, DeckDetailedStats } from '../DeckCard/DeckCard.type';

export interface Deck {
  id: string;
  title: string;
  /** Today's due counts */
  stats: DeckStats;
  /** Detailed stats for bottom row */
  detailedStats: DeckDetailedStats;
  /** Progress percentage (0-100) for mature cards */
  progress: number;
  /** Young progress percentage (0-100) - review cards with interval < 21 days */
  youngProgress?: number;
  /** Learning progress percentage (0-100) */
  learningProgress?: number;
  /** Whether deck is completed */
  isCompleted?: boolean;
}

export interface DeckListProps {
  /** Array of decks to display */
  decks: Deck[];
  /** Callback when a deck is pressed */
  onDeckPress?: (deckId: string) => void;
  /** Whether refresh is in progress */
  refreshing?: boolean;
  /** Callback when pull-to-refresh is triggered */
  onRefresh?: () => void;
}
