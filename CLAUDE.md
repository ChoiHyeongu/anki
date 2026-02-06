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

### Project Structure
```
app/                    # File-based routing (expo-router)
├── _layout.tsx         # Root layout with ThemeProvider
├── (tabs)/             # Tab navigation group
│   ├── _layout.tsx     # Tab bar configuration
│   ├── index.tsx       # Home tab
│   └── explore.tsx     # Explore tab
└── modal.tsx           # Modal screen

components/             # Reusable components
├── ui/                 # UI primitives (IconSymbol, Collapsible)
├── themed-*.tsx        # Theme-aware components
├── parallax-scroll-view.tsx
└── haptic-tab.tsx      # Tab with haptic feedback

hooks/                  # Custom hooks
├── use-color-scheme.ts # Platform-specific theme detection
└── use-theme-color.ts  # Theme color resolution

constants/
└── theme.ts            # Colors and Fonts definitions
```

### Key Patterns

**Path Aliases**: Use `@/` for root imports (configured in tsconfig.json)
```typescript
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
```

**Theming**: Components use `useColorScheme` and `useThemeColor` hooks for dark/light mode support. Theme colors defined in `constants/theme.ts`.

**Platform-Specific Files**: Use `.ios.tsx` / `.android.tsx` / `.web.tsx` suffixes for platform-specific implementations (see `components/ui/icon-symbol.ios.tsx`).

**File-Based Routing**: Screens in `app/` directory are routes. Parentheses `(tabs)` create layout groups without URL segments.

### Expo Configuration
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
