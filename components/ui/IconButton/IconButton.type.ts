import type { ReactNode } from 'react';

export interface IconButtonProps {
  /** Icon element to render */
  icon: ReactNode;
  /** Callback when button is pressed */
  onPress: () => void;
  /** Size of the button (default: 44) */
  size?: number;
  /** Background color */
  backgroundColor?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Accessibility label for the button */
  accessibilityLabel?: string;
}
