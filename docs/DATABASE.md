# Database Layer Documentation

> expo-sqlite 기반 데이터베이스 레이어 기술 문서

## 개요

Anki SRS 앱의 데이터 영속성을 위한 SQLite 데이터베이스 레이어입니다.

- **라이브러리**: expo-sqlite (~16.0.10)
- **패턴**: Repository + Service
- **파일 위치**: `lib/db/`

---

## 아키텍처

```
lib/db/
├── index.ts              # DB 인스턴스 관리, 초기화
├── schema.ts             # 테이블 DDL
├── types.ts              # 엔티티 타입, 매퍼 함수
├── seed.ts               # 초기 데이터
├── repositories/
│   ├── index.ts          # 배럴 export
│   ├── deck.ts           # 덱 CRUD
│   ├── card.ts           # 카드 CRUD
│   ├── progress.ts       # SRS 상태 관리
│   └── settings.ts       # 앱 설정
└── services/
    ├── index.ts          # 배럴 export
    ├── study.ts          # 학습 세션 로직
    └── deck.ts           # 덱 통계 집계
```

### 레이어 책임

| 레이어         | 책임                            | 예시                                |
| -------------- | ------------------------------- | ----------------------------------- |
| **Repository** | 단일 테이블 CRUD                | `getCardById()`, `createDeck()`     |
| **Service**    | 비즈니스 로직, 다중 테이블 조합 | `getStudyQueue()`, `submitRating()` |

---

## 스키마

### ERD

```
┌─────────────┐     ┌─────────────┐     ┌───────────────┐
│   decks     │     │   cards     │     │ card_progress │
├─────────────┤     ├─────────────┤     ├───────────────┤
│ id (PK)     │◄────│ deck_id (FK)│     │ card_id (PK)  │
│ title       │     │ id (PK)     │◄────│ status        │
│ description │     │ front_word  │     │ interval      │
│ created_at  │     │ front_phone │     │ ease          │
└─────────────┘     │ back_def    │     │ due_date      │
                    │ back_ex     │     │ learning_step │
                    │ back_syn    │     │ lapse_count   │
                    │ created_at  │     │ review_count  │
                    └─────────────┘     │ last_reviewed │
                          │             └───────────────┘
                          │
                          ▼
                    ┌─────────────┐     ┌─────────────┐
                    │ review_logs │     │  settings   │
                    ├─────────────┤     ├─────────────┤
                    │ id (PK)     │     │ key (PK)    │
                    │ card_id(FK) │     │ value       │
                    │ rating      │     └─────────────┘
                    │ reviewed_at │
                    │ time_taken  │
                    │ prev_state  │
                    └─────────────┘
```

### 테이블 상세

#### decks

| 컬럼        | 타입          | 설명                |
| ----------- | ------------- | ------------------- |
| id          | TEXT PK       | 덱 고유 ID          |
| title       | TEXT NOT NULL | 덱 제목             |
| description | TEXT          | 덱 설명             |
| created_at  | INTEGER       | 생성 시간 (Unix ms) |

#### cards

| 컬럼            | 타입          | 설명               |
| --------------- | ------------- | ------------------ |
| id              | TEXT PK       | 카드 고유 ID       |
| deck_id         | TEXT FK       | 소속 덱 ID         |
| front_word      | TEXT NOT NULL | 앞면 단어          |
| front_phonetic  | TEXT          | 발음 기호          |
| back_definition | TEXT NOT NULL | 뒷면 정의          |
| back_example    | TEXT          | 예문               |
| back_synonyms   | TEXT          | 동의어 (JSON 배열) |
| created_at      | INTEGER       | 생성 시간          |

#### card_progress

| 컬럼             | 타입       | 설명                           |
| ---------------- | ---------- | ------------------------------ |
| card_id          | TEXT PK FK | 카드 ID                        |
| status           | TEXT       | new/learning/review/relearning |
| interval         | REAL       | 복습 간격 (일)                 |
| ease             | REAL       | 난이도 계수                    |
| due_date         | INTEGER    | 다음 복습 시간                 |
| learning_step    | INTEGER    | 학습 단계 인덱스               |
| lapse_count      | INTEGER    | 실패 횟수                      |
| review_count     | INTEGER    | 총 복습 횟수                   |
| last_reviewed_at | INTEGER    | 마지막 복습 시간               |

#### review_logs

| 컬럼          | 타입       | 설명                     |
| ------------- | ---------- | ------------------------ |
| id            | INTEGER PK | 자동 증가 ID             |
| card_id       | TEXT FK    | 카드 ID                  |
| rating        | INTEGER    | 1-4 평가 점수            |
| reviewed_at   | INTEGER    | 복습 시간                |
| time_taken_ms | INTEGER    | 응답 소요 시간           |
| prev_state    | TEXT       | 이전 상태 (JSON, Undo용) |

#### settings

| 컬럼  | 타입    | 설명    |
| ----- | ------- | ------- |
| key   | TEXT PK | 설정 키 |
| value | TEXT    | 설정 값 |

### 인덱스

```sql
CREATE INDEX idx_cards_deck_id ON cards(deck_id);
CREATE INDEX idx_progress_status ON card_progress(status);
CREATE INDEX idx_progress_due_date ON card_progress(due_date);
CREATE INDEX idx_review_logs_card_id ON review_logs(card_id);
```

---

## API Reference

### 초기화

```typescript
import { initializeDatabase, closeDatabase, resetDatabase } from '@/lib/db';

// 앱 시작 시 (app/_layout.tsx)
await initializeDatabase();

// 앱 종료 시
await closeDatabase();

// 개발용: DB 초기화
await resetDatabase();
```

### 덱 서비스

```typescript
import { getAllDecksWithStats, getDeckWithStats, getTotalDeckStats, hasAnyDueCards } from '@/lib/db';

// 대시보드: 모든 덱 + 통계
const decks = await getAllDecksWithStats();
// 반환: DeckWithStats[]
// {
//   id, title, description,
//   newCount, learningCount, reviewCount,  // 오늘 학습할 카드
//   totalCards, matureCards,               // 전체 통계
//   progress,                              // 성숙도 % (0-100)
//   isCompleted                            // 오늘 학습 완료 여부
// }

// 단일 덱 조회
const deck = await getDeckWithStats('deck-id');

// 전체 요약 통계
const summary = await getTotalDeckStats();
// { totalDecks, totalCards, totalDue, completedDecks }

// 학습할 카드 존재 여부
const hasDue = await hasAnyDueCards();
```

### 학습 서비스

```typescript
import { getStudyQueue, submitRating, undoRating, getTodaySessionSummary } from '@/lib/db';

// 학습 대기열 가져오기
const queue = await getStudyQueue('deck-id');
// 반환: StudyQueue
// {
//   cards: StudyCard[],  // 학습할 카드 배열
//   totalCards: number   // 총 카드 수
// }
//
// StudyCard: {
//   id, frontWord, frontPhonetic,
//   backDefinition, backExample, backSynonyms,
//   status, interval, ease, dueDate,
//   learningStep, lapseCount, reviewCount
// }

// 평가 제출 (1=Again, 2=Hard, 3=Good, 4=Easy)
const result = await submitRating('card-id', 3);
// 반환: RatingResult
// {
//   newState: CardState,     // 새로운 SRS 상태
//   isLeech: boolean,        // Leech 카드 여부 (lapseCount >= 8)
//   nextReviewDate: number   // 다음 복습 시간
// }

// 마지막 평가 되돌리기
await undoRating('card-id');

// 오늘 세션 요약
const summary = await getTodaySessionSummary('deck-id');
// { cardsStudied, correctCount, incorrectCount, accuracy }
```

### 리포지토리 직접 사용

```typescript
import {
  // Deck
  getAllDecks,
  getDeckById,
  createDeck,
  createDecks,
  deckExists,

  // Card
  getCardsByDeckId,
  getCardById,
  createCard,
  createCards,
  updateCard,
  deleteCard,
  getCardCountByStatus,

  // Progress
  getCardProgress,
  updateCardProgress,
  getDueCards,
  getDeckStats,

  // Settings
  getSetting,
  setSetting,
  getDailyNewCardLimit,
  setDailyNewCardLimit,
} from '@/lib/db';
```

---

## 타입 정의

### 엔티티 타입

```typescript
// 테이블 행 매핑
interface DbDeck {
  id: string;
  title: string;
  description: string | null;
  created_at: number;
}

interface DbCard {
  id: string;
  deck_id: string;
  front_word: string;
  front_phonetic: string | null;
  back_definition: string;
  back_example: string | null;
  back_synonyms: string | null; // JSON 배열 문자열
  created_at: number;
}

interface DbCardProgress {
  card_id: string;
  status: CardStatus; // 'new' | 'learning' | 'review' | 'relearning'
  interval: number;
  ease: number;
  due_date: number;
  learning_step: number;
  lapse_count: number;
  review_count: number;
  last_reviewed_at: number | null;
}
```

### 입력 타입

```typescript
interface CreateDeckInput {
  id?: string; // 선택, 미지정시 자동 생성
  title: string;
  description?: string;
}

interface CreateCardInput {
  id?: string;
  deckId: string;
  frontWord: string;
  frontPhonetic?: string;
  backDefinition: string;
  backExample?: string;
  backSynonyms?: string[];
}
```

### 매퍼 함수

```typescript
import {
  dbProgressToCardState, // DbCardProgress → CardState (lib/srs)
  cardStateToDbProgress, // CardState → DbCardProgress
  parseSynonyms, // JSON string → string[]
  stringifySynonyms, // string[] → JSON string
} from '@/lib/db';
```

---

## 학습 알고리즘 연동

### SRS 모듈 통합

```typescript
// lib/db/services/study.ts 내부 동작

import { calculateSRS, DEFAULT_SRS_CONFIG } from '@/lib/srs';

// submitRating 호출 시:
// 1. 현재 카드 상태 조회
// 2. SRS 계산 수행
const srsResult = calculateSRS(rating, currentState, DEFAULT_SRS_CONFIG);

// 3. 새 상태 DB 저장
// 4. 리뷰 로그 기록 (Undo용 이전 상태 포함)
```

### 학습 우선순위

`getDueCards()` 반환 순서:

1. **learning** - 현재 학습 중 (짧은 간격)
2. **relearning** - 재학습 중 (실패 후)
3. **review** - 복습 예정
4. **new** - 신규 카드 (일일 한도 적용)

---

## 초기 데이터

### 기본 덱 (5개)

| ID                      | 제목                 |
| ----------------------- | -------------------- |
| deck-toeic-essential    | TOEIC Essential 2000 |
| deck-toeic-advanced     | TOEIC Advanced       |
| deck-travel-english     | Travel English       |
| deck-daily-conversation | Daily Conversational |
| deck-gre-vocab          | Advanced GRE Vocab   |

### 기본 설정

| 키                | 기본값 | 설명                |
| ----------------- | ------ | ------------------- |
| dailyNewCardLimit | 20     | 일일 신규 카드 한도 |
| showAnswerTimer   | true   | 응답 시간 표시      |
| hapticFeedback    | true   | 햅틱 피드백         |

---

## 사용 예시

### 앱 초기화

```typescript
// app/_layout.tsx
import { initializeDatabase } from '@/lib/db';

export default function RootLayout() {
  useEffect(() => {
    initializeDatabase();
  }, []);

  // ...
}
```

### 대시보드 화면

```typescript
// app/(tabs)/index.tsx
import { getAllDecksWithStats } from '@/lib/db';

export default function HomeScreen() {
  const [decks, setDecks] = useState<DeckWithStats[]>([]);

  useEffect(() => {
    getAllDecksWithStats().then(setDecks);
  }, []);

  return (
    <FlatList
      data={decks}
      renderItem={({ item }) => (
        <DeckCard
          title={item.title}
          newCount={item.newCount}
          learningCount={item.learningCount}
          reviewCount={item.reviewCount}
          progress={item.progress}
        />
      )}
    />
  );
}
```

### 학습 화면

```typescript
// app/study/[deckId].tsx
import { getStudyQueue, submitRating } from '@/lib/db';

export default function StudyScreen() {
  const { deckId } = useLocalSearchParams();
  const [queue, setQueue] = useState<StudyQueue | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getStudyQueue(deckId as string).then(setQueue);
  }, [deckId]);

  const handleRating = async (rating: 1 | 2 | 3 | 4) => {
    const card = queue?.cards[currentIndex];
    if (!card) return;

    const result = await submitRating(card.id, rating);

    if (result.isLeech) {
      // Leech 카드 알림 표시
    }

    setCurrentIndex((prev) => prev + 1);
  };

  // ...
}
```

---

## 테스트

```bash
# 전체 테스트 실행
npm test

# DB 타입 테스트만
npm test -- --testPathPatterns=db-types
```

### 테스트 커버리지

| 카테고리     | 테스트 수 |
| ------------ | --------- |
| 타입 매퍼    | 14        |
| SRS 알고리즘 | 25        |
| **총합**     | **39**    |
