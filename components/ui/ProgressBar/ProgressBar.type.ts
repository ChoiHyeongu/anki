export interface ProgressSegment {
  /** Progress value between 0 and 100 */
  value: number;
  /** Color of this segment */
  color: string;
  /** Z-index for layering (higher = on top) */
  zIndex?: number;
}

export interface ProgressBarProps {
  /** Progress value between 0 and 100 (for single segment) */
  progress?: number;
  /** Multiple segments for layered progress bar */
  segments?: ProgressSegment[];
  /** Height of the progress bar */
  height?: number;
  /** Background color of the track */
  trackColor?: string;
  /** Color of the filled progress (for single segment) */
  fillColor?: string;
  /** Whether to animate progress changes */
  animated?: boolean;
}
