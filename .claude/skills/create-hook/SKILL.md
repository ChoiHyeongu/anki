---
name: create-hook
description: React 커스텀 훅을 생성합니다. 새로운 훅이 필요하거나, 훅을 만들어달라고 요청할 때 사용합니다.
argument-hint: "[useHookName]"
---

# React 커스텀 훅 생성

훅 생성 시 **반드시** 다음 구조를 따릅니다.

## 디렉토리 구조

```
hooks/
├── [useHookName]/
│   ├── index.ts             # Re-export
│   ├── [useHookName].ts     # 훅 구현
│   └── [useHookName].type.ts # 타입 정의
└── index.ts                 # Barrel export (모든 훅)
```

## 생성 순서

1. **타입 파일 먼저** 생성: `[useHookName].type.ts`
2. **훅 파일** 생성: `[useHookName].ts`
3. **index.ts** 생성 (폴더 내부 re-export)
4. **hooks/index.ts** 업데이트 (barrel export에 추가)

## 파일 템플릿

### 1. `[useHookName].type.ts`

```typescript
export interface [UseHookName]Options {
  // 옵션 정의 (optional)
}

export interface [UseHookName]Return {
  // 반환 타입 정의
}
```

### 2. `[useHookName].ts`

```typescript
import { useState, useCallback } from 'react';
import type { [UseHookName]Options, [UseHookName]Return } from './[useHookName].type';

export function [useHookName](options?: [UseHookName]Options): [UseHookName]Return {
  // 구현

  return {
    // 반환값
  };
}
```

### 3. `index.ts` (폴더 내부)

```typescript
export { [useHookName] } from './[useHookName]';
export type { [UseHookName]Options, [UseHookName]Return } from './[useHookName].type';
```

### 4. `hooks/index.ts` (Barrel Export)

```typescript
// 기존 export 유지하고 새 훅 추가
export { [useHookName] } from './[useHookName]';
export type { [UseHookName]Options, [UseHookName]Return } from './[useHookName]';
```

## 네이밍 규칙

| 항목 | 규칙 | 예시 |
|------|------|------|
| 훅 이름 | camelCase + `use` 접두사 | `useCamera`, `useAnalysis` |
| 폴더명 | 훅 이름과 동일 | `useCamera/` |
| 파일명 | 훅 이름과 동일 | `useCamera.ts` |
| 타입명 | PascalCase + 접미사 | `UseCameraOptions`, `UseCameraReturn` |

## 사용 예시

```typescript
// ✅ 올바른 import
import { useCamera, useAuth } from '@/hooks';
import type { UseCameraReturn } from '@/hooks';

// ❌ 직접 경로 접근 금지
import { useCamera } from '@/hooks/useCamera/useCamera';
```

## 실행

$ARGUMENTS 를 분석하여:
1. 훅 이름 파악 (use 접두사 확인)
2. use 접두사가 없으면 자동으로 추가
3. 위 템플릿에 따라 파일 생성
4. hooks/index.ts barrel export 업데이트
