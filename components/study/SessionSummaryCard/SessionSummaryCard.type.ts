export interface SessionStats {
  /** Number of cards studied */
  studied: number;
  /** Number of correct answers */
  correct: number;
  /** Total time in seconds */
  timeSpent: number;
  /** Number of new cards learned */
  newLearned: number;
}

export interface SessionSummaryCardProps {
  /** Session statistics */
  stats: SessionStats;
  /** Callback when "Continue" is pressed */
  onContinue?: () => void;
  /** Callback when "Go Home" is pressed */
  onGoHome: () => void;
}
