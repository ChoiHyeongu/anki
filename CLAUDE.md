# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal Anki-style flashcard app for vocabulary memorization using SRS (Spaced Repetition System) algorithm. Built with React Native + Expo.

## Development Commands

```bash
# Start development server (opens options for iOS, Android, web)
npm start

# Platform-specific dev servers
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser

# Linting
npm run lint

# Reset to blank project (moves starter code to app-example/)
npm run reset-project
```

## Architecture

### Tech Stack
- **Framework**: React Native 0.81 with Expo SDK 54
- **Routing**: expo-router (file-based routing)
- **Animation**: react-native-reanimated
- **Navigation**: @react-navigation/native with bottom tabs
- **Language**: TypeScript (strict mode)
- **Font**: Lexend (via @expo-google-fonts/lexend)

### Project Structure
```
app/                    # File-based routing (expo-router)
├── _layout.tsx         # Root layout with ThemeProvider + font loading
├── (tabs)/             # Tab navigation group
│   ├── _layout.tsx     # Tab bar configuration
│   ├── index.tsx       # Home tab
│   └── explore.tsx     # Explore tab
└── modal.tsx           # Modal screen

components/             # Reusable components
├── ui/                 # UI primitives (IconSymbol, Collapsible)
├── themed-text.tsx     # Theme-aware text with typography variants
├── themed-view.tsx     # Theme-aware container
├── parallax-scroll-view.tsx
└── haptic-tab.tsx      # Tab with haptic feedback

hooks/                  # Custom hooks
├── use-color-scheme.ts # Platform-specific theme detection
└── use-theme-color.ts  # Theme color resolution with ColorKey type

constants/
├── theme.ts            # Design tokens (Colors, Spacing, Typography)
└── navigation-theme.ts # React Navigation v7 themes (AnkiDarkTheme, AnkiLightTheme)
```

## Design System

Based on [Stitch Design](https://stitch.withgoogle.com/projects/17984646321015771690).

### Design Tokens

| Token | Value |
|-------|-------|
| Accent | `#13ec5b` (bright green) |
| Mode | Dark (primary) |
| Font | Lexend |
| Border Radius | 8px (default) |

### Color System (`constants/theme.ts`)

**Core Colors** - Access via `Colors.light.*` or `Colors.dark.*`:
```typescript
// Backgrounds
background, surface, surfaceElevated

// Text
text, textSecondary, textMuted

// Accent
tint, accent, accentMuted

// UI Elements
icon, iconMuted, tabIconDefault, tabIconSelected

// Borders
border, borderMuted

// Card backgrounds
card, cardFront, cardBack

// Status
success, warning, error, info
```

**SRS Status Colors** - For card states:
```typescript
import { SRSColors } from '@/constants/theme';

SRSColors.new       // #475569 - Slate (cards never studied)
SRSColors.learning  // #a16207 - Amber (cards being learned)
SRSColors.review    // #15803d - Green (cards due for review)
SRSColors.mature    // #166534 - Dark green (well-known cards)
```

### Typography (`FontFamily`, `FontSize`)

```typescript
import { FontFamily, FontSize } from '@/constants/theme';

FontFamily.regular   // Lexend_400Regular
FontFamily.medium    // Lexend_500Medium
FontFamily.semiBold  // Lexend_600SemiBold
FontFamily.bold      // Lexend_700Bold

FontSize.xs   // 12
FontSize.sm   // 14
FontSize.base // 16
FontSize.lg   // 18
FontSize.xl   // 20
FontSize['2xl'] // 24
FontSize['3xl'] // 30
FontSize['4xl'] // 36
```

### Spacing & Border Radius

```typescript
import { Spacing, BorderRadius } from '@/constants/theme';

Spacing.xs  // 4
Spacing.sm  // 8
Spacing.md  // 16
Spacing.lg  // 24
Spacing.xl  // 32
Spacing.xxl // 48

BorderRadius.sm   // 4
BorderRadius.md   // 8 (default)
BorderRadius.lg   // 12
BorderRadius.xl   // 16
BorderRadius.full // 9999
```

### Type Exports

```typescript
import type {
  ColorKey,        // keyof Colors.light (e.g., 'text', 'background', 'accent')
  SRSColorKey,     // 'new' | 'learning' | 'review' | 'mature'
  SpacingKey,      // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  BorderRadiusKey, // 'sm' | 'md' | 'lg' | 'xl' | 'full'
  FontSizeKey      // 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
} from '@/constants/theme';
```

## Key Patterns

### Theme Color Usage

```typescript
import { useThemeColor } from '@/hooks/use-theme-color';

// Get theme-aware color
const backgroundColor = useThemeColor({}, 'background');
const textColor = useThemeColor({}, 'text');

// Override for specific mode
const customColor = useThemeColor(
  { light: '#000', dark: '#fff' },
  'text'
);
```

### ThemedText Variants

```typescript
import { ThemedText } from '@/components/themed-text';

<ThemedText type="title">Large Title</ThemedText>
<ThemedText type="subtitle">Subtitle</ThemedText>
<ThemedText type="default">Body text</ThemedText>
<ThemedText type="defaultSemiBold">Bold body</ThemedText>
<ThemedText type="link">Link text (uses accent color)</ThemedText>
```

### Path Aliases

Use `@/` for root imports (configured in tsconfig.json):
```typescript
import { ThemedText } from '@/components/themed-text';
import { Colors, FontFamily } from '@/constants/theme';
```

### Platform-Specific Files

Use `.ios.tsx` / `.android.tsx` / `.web.tsx` suffixes for platform-specific implementations (see `components/ui/icon-symbol.ios.tsx`).

### File-Based Routing

Screens in `app/` directory are routes. Parentheses `(tabs)` create layout groups without URL segments.

## Expo Configuration

- New Architecture enabled (`newArchEnabled: true`)
- React Compiler experiment enabled
- Typed Routes experiment enabled
- URL scheme: `anki://`

## Future Development Notes

This app will implement SRS algorithm for flashcard-based vocabulary learning. Core features to build:
- Card deck management
- SRS scheduling algorithm (SM-2 or similar)
- Review sessions with card flipping
- Progress tracking and statistics
- Local data persistence
