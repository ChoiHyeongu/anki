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
- **Database**: SQLite (expo-sqlite)
- **Animation**: react-native-reanimated
- **Navigation**: @react-navigation/native with bottom tabs
- **Language**: TypeScript (strict mode)
- **Font**: Lexend (via @expo-google-fonts/lexend)

### Project Structure
```
app/                          # File-based routing (expo-router)
├── _layout.tsx               # Root layout with providers
├── index.tsx                 # Home screen (deck list)
├── modal.tsx                 # Modal screen
└── study/                    # Study session screens
    ├── _layout.tsx           # Study stack layout
    ├── [deckId].tsx          # Study session screen
    └── summary.tsx           # Session summary screen

components/
├── deck/                     # Deck-related components
│   ├── DeckCard/             # Individual deck card
│   ├── DeckList/             # Deck list container
│   └── DeckStatsBadge/       # Stats badge component
├── flashcard/                # Flashcard components
│   ├── Flashcard/            # Flippable card container
│   ├── FlashcardFront/       # Card front (word)
│   ├── FlashcardBack/        # Card back (definition)
│   └── CardStats/            # Card statistics display
├── study/                    # Study session components
│   ├── RatingButtons/        # Again/Hard/Good/Easy buttons
│   ├── RevealButton/         # Show answer button
│   ├── StudyHeader/          # Session progress header
│   └── SessionSummaryCard/   # End of session summary
├── ui/                       # UI primitives
│   ├── ProgressBar/          # Progress bar component
│   ├── StatCard/             # Statistics card
│   ├── IconButton/           # Icon button
│   └── IconSymbol/           # Platform-specific icons
├── themed-text.tsx           # Theme-aware text
└── themed-view.tsx           # Theme-aware container

lib/
├── srs/                      # SRS algorithm implementation
│   ├── calculator.ts         # Core SRS calculations
│   ├── config.ts             # Default SRS configuration
│   ├── types.ts              # CardState, Rating types
│   └── utils.ts              # Time formatting utilities
├── db/                       # Database layer
│   ├── schema.ts             # SQLite table definitions
│   ├── types.ts              # Database entity types
│   ├── provider.tsx          # Database context provider
│   ├── repositories/         # Data access layer
│   │   ├── deck.ts           # Deck CRUD operations
│   │   ├── card.ts           # Card CRUD operations
│   │   ├── progress.ts       # Card progress & stats
│   │   └── settings.ts       # App settings
│   └── services/             # Business logic layer
│       ├── deck.ts           # Deck with stats
│       └── study.ts          # Study session logic
├── adapters/                 # Data transformation
│   ├── deck-adapter.ts       # DB → UI deck mapping
│   └── card-adapter.ts       # DB → UI card mapping
└── sync/                     # External data sync
    ├── sheets-fetcher.ts     # Google Sheets integration
    └── csv-parser.ts         # CSV parsing utilities

hooks/
├── use-decks.ts              # Deck list with auto-refresh
├── use-study-session.ts      # Study session state management
├── use-color-scheme.ts       # Platform theme detection
└── use-theme-color.ts        # Theme color resolution

constants/
├── theme.ts                  # Design tokens (Colors, Spacing, Typography)
└── navigation-theme.ts       # React Navigation themes
```

## Database Schema

SQLite database with the following tables:

```sql
-- Decks (card collections)
CREATE TABLE decks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at INTEGER NOT NULL
);

-- Cards (vocabulary items)
CREATE TABLE cards (
  id TEXT PRIMARY KEY,
  deck_id TEXT NOT NULL REFERENCES decks(id),
  front_word TEXT NOT NULL,
  front_phonetic TEXT,
  back_definition TEXT NOT NULL,
  back_example TEXT,
  back_synonyms TEXT,  -- JSON array
  created_at INTEGER NOT NULL
);

-- Card progress (SRS state)
CREATE TABLE card_progress (
  card_id TEXT PRIMARY KEY REFERENCES cards(id),
  status TEXT NOT NULL,      -- 'new' | 'learning' | 'relearning' | 'review'
  interval INTEGER NOT NULL, -- in milliseconds
  ease REAL NOT NULL,        -- ease factor (default 2.5)
  due_date INTEGER NOT NULL, -- next review timestamp
  learning_step INTEGER NOT NULL,
  lapse_count INTEGER NOT NULL,
  review_count INTEGER NOT NULL,
  last_reviewed_at INTEGER
);

-- Review logs (for undo & statistics)
CREATE TABLE review_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id TEXT NOT NULL REFERENCES cards(id),
  rating INTEGER NOT NULL,   -- 1-4
  reviewed_at INTEGER NOT NULL,
  time_taken_ms INTEGER,
  prev_state TEXT           -- JSON for undo
);
```

## SRS Algorithm

Based on SM-2 algorithm with the following card states:

```
New → Learning → Review (Young/Mature)
         ↑          ↓
         └── Relearning ←┘ (on lapse)
```

### Card States

| Status | Description | Interval Unit |
|--------|-------------|---------------|
| `new` | Never studied | - |
| `learning` | Initial learning steps | Minutes |
| `relearning` | Failed review, relearning | Minutes |
| `review` | Graduated, spaced review | Days |

### Review vs Young vs Mature

- **Young**: `status = 'review'` AND `interval < 21 days`
- **Mature**: `status = 'review'` AND `interval >= 21 days`

### Rating Effects

| Rating | Action |
|--------|--------|
| **Again (1)** | Reset to step 0, ease -0.2 |
| **Hard (2)** | Current step × 1.5, ease -0.15 |
| **Good (3)** | Next step or graduate |
| **Easy (4)** | Graduate immediately with bonus |

### Default Configuration (`lib/srs/config.ts`)

```typescript
{
  learningSteps: [1, 10],      // minutes
  relearningSteps: [10],      // minutes
  graduatingInterval: 1,       // days
  easyInterval: 4,             // days
  minimumEase: 1.3,
  easyBonus: 1.3,
  hardMultiplier: 1.2,
  lapseMinInterval: 1,         // days
  maximumInterval: 36500,      // days (~100 years)
  leechThreshold: 8,
}
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
text, textSecondary, textMuted, textDimmed

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
SRSColors.young     // #0891b2 - Cyan (graduated, interval < 21 days)
SRSColors.mature    // #166534 - Dark green (well-known, interval >= 21 days)
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
  SRSColorKey,     // 'new' | 'learning' | 'review' | 'young' | 'mature'
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

### useFocusEffect for Auto-Refresh

Use `@react-navigation/native`'s `useFocusEffect` (not expo-router) for screen focus refresh:
```typescript
import { useFocusEffect } from '@react-navigation/native';

useFocusEffect(
  useCallback(() => {
    let mounted = true;
    fetchData().then(data => mounted && setData(data));
    return () => { mounted = false; };
  }, [])
);
```

## Expo Configuration

- New Architecture enabled (`newArchEnabled: true`)
- React Compiler experiment enabled
- Typed Routes experiment enabled
- URL scheme: `anki://`

## Implemented Features

- [x] Card deck management with statistics
- [x] SM-2 based SRS scheduling algorithm
- [x] Review sessions with card flipping animation
- [x] Progress tracking (new/learning/young/mature)
- [x] Local SQLite data persistence
- [x] Undo last review
- [x] Daily new card limit
- [x] Next due time display
- [x] Google Sheets sync for deck import
