# 관리자 페이지 작업 핸드오프

- 브랜치: `feat/#93/admin`
- 작업일: 2026-06-17
- 담당: 도윤

---

## 구현된 페이지 목록

| 라우트             | 상태                             |
| ------------------ | -------------------------------- |
| `/admin`           | ✅ `/admin/dashboard` 리다이렉트 |
| `/admin/dashboard` | ✅ 완료                          |
| `/admin/types`     | ✅ 완료                          |
| `/admin/create`    | 🔲 미작업                        |
| `/admin/meetings`  | 🔲 미작업                        |

---

## 폴더 구조

```text
src/
├── app/admin/
│   ├── layout.tsx               ← AdminSidebar + main 레이아웃
│   ├── page.tsx                 ← /admin/dashboard redirect
│   ├── dashboard/page.tsx
│   ├── types/page.tsx
│   ├── create/page.tsx
│   └── meetings/page.tsx
│
├── page/admin/
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── model/useAdminDashboardViewModel.ts
│   │   └── components/QuickStartBoard.tsx
│   └── types/
│       ├── page.tsx
│       ├── model/useAdminTypesViewModel.ts
│       └── components/
│           ├── TypesSection.tsx
│           ├── TypeCard.tsx
│           ├── AddTypeModal.tsx
│           └── TypeImageUpload.tsx
│
├── features/admin/
│   ├── index.ts
│   └── ui/AdminSidebar.tsx
│
└── app/api/meeting-types/
    ├── route.ts                 ← GET, POST
    └── [id]/route.ts            ← PATCH
```

---

## 핵심 설계 결정

### 1. MVVM 패턴

- **ViewModel**: `page/admin/[page]/model/useXxxViewModel.ts` — API 호출, 상태, 핸들러
- **View**: `page/admin/[page]/components/` — 순수 렌더링만
- 기존 `page/favorite/model/useFavoriteSectionViewModel.ts` 와 동일한 패턴

### 2. description 필드에 JSON 저장

API의 `MeetingTypeDTO.description` 필드(string)에 아래 형식으로 저장:

```json
{ "category": "regular", "imageUrl": "https://..." }
```

- 파싱 유틸: `src/shared/lib/meetingTypeDescription.ts`
  - `parseMeetingTypeDescription(description)` → `{ category, imageUrl }`
  - `serializeMeetingTypeDescription(category, imageUrl)` → JSON string
- JSON 파싱 실패 시(기존 plain text 데이터) → `category: "unknown"` fallback

### 3. 타입 분류 상수

`src/shared/constants/meetingTypes.ts` — 팀 공용 상수 (다른 팀원도 여기서 import)

```ts
REGULAR_CLASS_TYPES = [
  "웨이트",
  "필라테스",
  "스피닝",
  "부스터",
  "리커버리",
  "스페셜클래스",
];
COMMUNITY_TYPES = [
  "맨몸운동",
  "기구운동",
  "런닝",
  "클라이밍",
  "파워리프팅",
  "기타",
];
```

- 어드민 타입 페이지는 현재 이 상수를 직접 쓰지 않고 `parseMeetingTypeDescription`으로 분류
- `features/create-dagym/constants/index.ts`의 `mockOptions`는 `COMMUNITY_TYPES` import 중

### 4. 이미지 업로드

기존 `features/create-dagym/lib/uploadImage.ts`의 `uploadImageToStorage` 재사용:

1. POST `/api/images` → presigned URL + publicUrl 발급
2. PUT presigned URL → Supabase 업로드
3. publicUrl을 description JSON의 `imageUrl`에 저장

---

## 다음 작업 목록

- [ ] `/admin/create` — 다짐 만들기 (단일 폼, MVVM)
- [ ] `/admin/meetings` — 다짐 리스트 (관리자/유저 탭 + 지점 필터)
- [ ] 루트 `layout.tsx`의 `<Header />` 처리 — 어드민에서 숨기려면 route group `(main)` 으로 기존 라우트 묶어야 함

---

## 참고

- 기획서: `src/docs/specs/2026_06_17_admin_doyun.md`
- API base: `NEXT_PUBLIC_API_URL/meeting-types`
- 이미지 folder 파라미터: `"meetings"` (추후 `"types"` 로 변경 고려)
