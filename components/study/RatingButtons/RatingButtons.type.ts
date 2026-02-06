export type Rating = 'again' | 'hard' | 'good' | 'easy';

export interface RatingButtonsProps {
  /** Callback when a rating is selected */
  onRate: (rating: Rating) => void;
  /** Optional interval labels for each rating */
  intervals?: Record<Rating, string>;
  /** Whether the buttons are disabled */
  disabled?: boolean;
}
