import type { ReactNode } from 'react';

export interface StatCardProps {
  /** Label text displayed above the value */
  label: string;
  /** Main value to display */
  value: string | number;
  /** Optional icon to display */
  icon?: ReactNode;
  /** Color for the value text */
  valueColor?: string;
}
