---
name: create-component
description: React Native 컴포넌트를 생성합니다. 새로운 UI 컴포넌트가 필요하거나, 컴포넌트를 만들어달라고 요청할 때 사용합니다.
argument-hint: "[ComponentName] [category?]"
---

# React Native 컴포넌트 생성

컴포넌트 생성 시 **반드시** 다음 구조를 따릅니다.

## 디렉토리 구조

```
components/
├── [category]/              # ui, layout, camera, analysis, report, chat, payment 등
│   └── [ComponentName]/
│       ├── index.ts         # Re-export
│       ├── [ComponentName].tsx      # 컴포넌트 구현
│       └── [ComponentName].type.ts  # 타입 정의
└── index.ts                 # Barrel export (모든 컴포넌트)
```

## 생성 순서

1. **타입 파일 먼저** 생성: `[ComponentName].type.ts`
2. **컴포넌트 파일** 생성: `[ComponentName].tsx`
3. **index.ts** 생성 (폴더 내부 re-export)
4. **components/index.ts** 업데이트 (barrel export에 추가)

## 파일 템플릿

### 1. `[ComponentName].type.ts`

```typescript
export interface [ComponentName]Props {
  // props 정의
}
```

### 2. `[ComponentName].tsx`

```typescript
import { View, StyleSheet } from 'react-native';
import type { [ComponentName]Props } from './[ComponentName].type';

export function [ComponentName]({ ...props }: [ComponentName]Props) {
  return (
    <View style={styles.container}>
      {/* 구현 */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
```

### 3. `index.ts` (폴더 내부)

```typescript
export { [ComponentName] } from './[ComponentName]';
export type { [ComponentName]Props } from './[ComponentName].type';
```

### 4. `components/index.ts` (Barrel Export)

```typescript
// 기존 export 유지하고 새 컴포넌트 추가
export { [ComponentName] } from './[category]/[ComponentName]';
export type { [ComponentName]Props } from './[category]/[ComponentName]';
```

## 사용 예시

```typescript
// ✅ 올바른 import
import { Button, Card } from '@/components';

// ❌ 직접 경로 접근 금지
import { Button } from '@/components/ui/Button/Button';
```

## 카테고리 가이드

| 카테고리 | 용도 |
|---------|------|
| `ui` | 공통 기본 UI (Button, Input, Card, Badge, Modal) |
| `layout` | 레이아웃 (Container, Header, SafeArea) |
| `camera` | 카메라 관련 |
| `analysis` | AI 분석 관련 |
| `report` | 신고 관련 |
| `chat` | 채팅 관련 |
| `payment` | 결제 관련 |

## 실행

$ARGUMENTS 를 분석하여:
1. ComponentName과 category를 파악
2. category가 없으면 용도에 맞는 카테고리 선택
3. 위 템플릿에 따라 파일 생성
4. components/index.ts barrel export 업데이트
