export interface StudyHeaderProps {
  /** Current card number */
  current: number;
  /** Total number of cards */
  total: number;
  /** Callback when close button is pressed */
  onClose: () => void;
  /** Callback when undo button is pressed */
  onUndo: () => void;
  /** Whether undo is available */
  canUndo: boolean;
}
