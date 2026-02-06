export interface FlashcardBackProps {
  /** Definition or meaning of the word */
  definition: string;
  /** Example sentences */
  examples?: string[];
  /** List of synonyms */
  synonyms?: string[];
  /** Word to highlight in examples */
  highlightWord?: string;
}

export interface CardStatsProps {
  /** Number of reviews */
  reviews: number;
  /** Current interval (e.g., "4 days") */
  interval: string;
  /** Ease factor as percentage (e.g., 250) */
  ease: number;
  /** Card type (e.g., "Review", "Learning", "New") */
  type: 'new' | 'learning' | 'review';
}
