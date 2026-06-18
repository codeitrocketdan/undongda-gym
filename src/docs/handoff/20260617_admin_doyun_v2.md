# 관리자 페이지 작업 핸드오프 v2

- 브랜치: `feat/#93/admin`
- 작업일: 2026-06-18
- 담당: 도윤
- 이전 문서: [`20260617_admin_doyun.md`](./20260617_admin_doyun.md)

---

## 구현된 페이지 목록

| 라우트 | 상태 |
|--------|------|
| `/admin` | ✅ `/admin/dashboard` 리다이렉트 |
| `/admin/dashboard` | ✅ 완료 (v1) |
| `/admin/types` | ✅ 완료 (v1) |
| `/admin/create` | ✅ 완료 (v2 신규) |
| `/admin/meetings` | ✅ 완료 (v2 신규) |

기획서(`src/docs/specs/2026_06_17_admin_doyun.md`)의 요구사항은 변경 없음 — v1에서 정의된 요구사항을 그대로 구현했습니다. 별도 spec v2는 작성하지 않았습니다.

---

## 폴더 구조 (v2에서 추가된 부분)

```
src/
├── page/admin/
│   ├── create/
│   │   ├── page.tsx
│   │   ├── model/
│   │   │   ├── useMeetingFormFields.ts    ← create/edit 공용 폼 상태 + 검증 + payload 빌더
│   │   │   └── useAdminCreateViewModel.ts ← useMeetingFormFields + POST
│   │   └── components/
│   │       ├── MeetingFormFields.tsx      ← create/edit 공용 폼 마크업
│   │       └── CreateMeetingForm.tsx
│   └── meetings/
│       ├── page.tsx
│       ├── model/
│       │   ├── useAdminMeetingsViewModel.ts
│       │   └── useEditMeetingViewModel.ts ← useMeetingFormFields + PATCH
│       └── components/
│           ├── MeetingsSection.tsx
│           ├── MeetingRow.tsx             ← 행 클릭 + ⋮ 드롭다운(공유/수정/삭제)
│           ├── MeetingDetailModal.tsx
│           └── EditMeetingModal.tsx
│
├── app/api/meetings/[meetingId]/route.ts  ← 신규 (PATCH, DELETE)
├── app/api/meeting-types/[id]/route.ts    ← DELETE 추가
│
├── shared/constants/meetingTypes.ts   ← TYPE_DEFAULT_IMAGES 추가
├── shared/ui/modal/ConfirmModal.tsx   ← 신규 (types/meetings 삭제 확인 공용)
│
└── app/providers/AppShell.tsx          ← 신규 (Header 조건부 렌더링)
```

---

## 핵심 설계 결정

### 1. `/admin/create` — 다짐 만들기 단일 폼

- 기존 4단계 모달(`features/create-dagym/ui/CreateDagymForm.tsx`)을 재사용하지 않고, 어드민 전용 단일 폼으로 새로 작성. 어드민 화면은 모달 기반 모바일 플로우보다 한 화면에서 빠르게 입력하는 게 맞다고 판단.
- 폼 스타일은 기존 multi-step 모달이 아니라 `/admin/types` 페이지(`AddTypeModal.tsx`)의 plain `<select>` + `InputField` 컨벤션을 그대로 따름.
- **타입 드롭다운**: `/api/meeting-types`에서 실제 등록된 `MeetingTypeDTO[]`를 불러와 `name`을 옵션으로 사용 (mock 카테고리가 아니라 실제 등록 데이터 기준).
- **지점 드롭다운**: `CENTER_KEYS` 사용, 선택 시 `CENTER_INFO`에서 address/lat/lng 자동 매핑 (`SetInfo.tsx`의 지점 매핑 로직과 동일 패턴).
- **고도화 2 (타입별 대표 이미지 자동 프리셋)**: 타입 선택 시 이미지 인풋 자동 채움, 사용자가 직접 입력란을 수정하면 그 이후로는 타입을 바꿔도 수동 입력값을 덮어쓰지 않음 (`isImageEdited` 플래그로 제어). 이미지 우선순위는 **① `/admin/types`에서 실제 등록한 이미지**(해당 타입의 `description` JSON에 저장된 `imageUrl`, `parseMeetingTypeDescription`으로 파싱) → **② `shared/constants/meetingTypes.ts`의 `TYPE_DEFAULT_IMAGES`**(기획서에 적힌 임시 placeholder, 등록된 이미지가 없을 때만 fallback)
  - ⚠️ 버그 수정: 처음엔 무조건 `TYPE_DEFAULT_IMAGES`(가짜 도메인 `images.undongda.com`, 실제 존재하지 않음 → `ERR_NAME_NOT_RESOLVED`)만 채우고 있어서, 타입 페이지에서 실제 이미지를 등록해놔도 무시되는 버그가 있었음. `useMeetingFormFields`의 `handleTypeChange`에서 `types`(등록된 `MeetingTypeDTO[]`) 중 매칭되는 타입의 등록 이미지를 먼저 찾도록 수정함.
- **일정/정원**: 기존 `SetDate.tsx`와 동일하게 `DatePicker` + `TimePicker`로 `dateTime`을 만들고, `registrationEnd`는 `dateTime - 1일 23:59`로 자동 계산. 정원은 3~20명, 기본 20명, blur 시 범위 밖이면 clamp + 안내 메시지.
- 제출은 `POST /api/meetings` (기존 라우트 재사용), 성공 시 `meetingQueries`/`userMeetingQueries` invalidate 후 `/admin/meetings`로 이동.
  - ⚠️ 버그 수정: 처음엔 invalidate 없이 바로 이동만 시켜서, 이미 캐시된 탭/지점(예: "전체")에서는 새로 만든 다짐이 새로고침 전까지 안 보이는 문제가 있었음 (캐시 없는 탭/지점은 매번 새로 fetch하니까 바로 보였음). 수정/삭제 때처럼 생성 성공 시에도 invalidate 추가함.

### 2. `/admin/meetings` — 다짐 리스트

- **상단 탭 ([관리자 모임] / [유저 모임])**: 백엔드에 모임을 "관리자가 만든 것"으로 구분하는 필드가 없어서, 아래처럼 매핑함.
  - 관리자 모임 = `GET /api/users/me/meetings?type=created` (현재 로그인한 계정이 만든 모임 — 기존 마이페이지 "내가 만든 다짐" 로직과 동일 엔드포인트 재사용)
  - 유저 모임 = `GET /api/meetings` (전체 다짐 목록)
  - ⚠️ 추후 백엔드에 모임 생성 주체를 구분하는 필드(예: `createdByRole`)가 추가되면 이 매핑을 교체해야 함.
- **하단 지점 뱃지 필터**: `CENTER_KEYS` 기반 수평 뱃지 버튼. `useInfiniteQuery` + `useInfiniteScroll`로 탭/지점 변경 시 목록 재요청.
- **고도화 1 (preferredGym 기반 초기 지점 필터)**: `useUser()`로 가져온 `user.companyName`이 `CENTER_KEYS`에 포함되는 값이면 초기 지점 필터로 사용. `useEffect`로 처리하면 React 19 `set-state-in-effect` 린트 경고가 발생해서, `manualRegion`(사용자가 직접 클릭했는지)과 `preferredGymRegion`(파생값)을 분리해 순수 계산으로 처리함 — `region = manualRegion ?? preferredGymRegion`.
- Empty State: `CalendarX2` 아이콘 + 안내 문구 + `/admin/create` 바로가기 버튼 (`/admin/types`의 Empty State와 동일한 톤).

### 3. `/admin/create`·`/admin/meetings` 폼 로직 공유 (`useMeetingFormFields`)

- 다짐 만들기(생성)와 다짐 수정 폼이 필드 구성·검증 로직이 100% 동일해서, `useMeetingFormFields(initial?)`라는 공용 훅으로 추출함 (타입/이름/지점/이미지/설명/일정/정원 state + `isValid` + `buildPayload()`).
- `useAdminCreateViewModel`은 `useMeetingFormFields()` 결과에 `POST` mutation만 얹고, `useEditMeetingViewModel`은 meeting 데이터로 초기값을 채운 `useMeetingFormFields(initial)`에 `PATCH` mutation을 얹는 구조.
- 마크업도 `MeetingFormFields.tsx`로 추출해서 `CreateMeetingForm`(전체 페이지)과 `EditMeetingModal`(모달) 양쪽에서 그대로 재사용함.

### 4. `/admin/meetings` 행 클릭 상세 + ⋮ 액션 메뉴

- **행 클릭 → 읽기 전용 상세 모달** (`MeetingDetailModal`), **⋮ 클릭 → 공유/수정/삭제 드롭다운** (`MeetingRow` 내부, 공용 `Dropdown` 컴포넌트 사용)로 분리. 어드민은 리스트에서 여러 항목을 빠르게 관리하는 화면이라 클릭마다 페이지 이동시키는 것보다 모달 기반이 컨텍스트 유지에 낫다고 판단 (별도 `/admin/meetings/[id]` 라우트는 만들지 않음).
- ⋮ 트리거를 감싸는 wrapper에 `onClick={(e) => e.stopPropagation()}`를 줘서 드롭다운 클릭이 행의 `onClick`(상세 모달 오픈)으로 전파되지 않게 처리함.
- **공유하기**: 별도 공유 API가 없어서 `navigator.clipboard.writeText(`${origin}/meetings/${id}`)`로 사용자용 상세 페이지 링크를 복사. 클립보드 권한이 없는 환경은 조용히 무시.
- **수정하기**: `EditMeetingModal`이 `useEditMeetingViewModel(meeting, onClose)`로 폼을 prefill, `PATCH /api/meetings/{id}` (신규 라우트, `serverFetcher` 경유) 호출 후 `meetingQueries`/`userMeetingQueries` 전체 invalidate.
- **삭제하기**: 공용 `ConfirmModal`로 한 번 더 확인 후 `DELETE /api/meetings/{id}` (신규 라우트).
- **`canManage` 가드 (백엔드 권한 블로커 대응)**: 백엔드(코드잇 스프린트 공유 백엔드, 우리 팀이 코드를 수정할 수 없음)가 "본인 소유 모임"만 PATCH/DELETE를 허용해서, 본인이 만들지 않은 모임을 수정/삭제하면 항상 401이 남. "관리자 모임" 탭(`/users/me/meetings?type=created`)은 정의상 전부 본인 소유라 항상 되지만, "유저 모임" 탭은 대부분 남이 만든 모임이라 항상 막힘. 그래서 `MeetingRow`에 `canManage={tab === "admin"}`을 넘겨서, `canManage`가 false일 때는 ⋮ 메뉴에서 수정하기/삭제하기를 숨기고 공유하기만 노출함. 어차피 항상 401만 나는 액션을 보여주는 것보다 숨기는 게 나음. 활성화 코드는 주석으로 남겨뒀고(`MeetingRow.tsx`의 `TODO` 참고), 백엔드에 admin 권한 체크가 추가되면 `canManage` 조건을 지우면 됨.

### 4.5. `AdminSidebar` 접고 펼치기 (`AdminShell` 신규)

- 작은 화면에서 사이드바가 본문 공간을 너무 많이 차지하는 문제 대응. 상태 관리는 `AdminSidebar`가 아니라 새로 만든 `features/admin/ui/AdminShell.tsx`(client)가 가지고 있고, `app/admin/layout.tsx`는 이제 `<AdminShell>{children}</AdminShell>`만 렌더링함.
- `AdminSidebar`는 `fixed inset-y-0 left-0 h-screen` + `translate-x-0`/`-translate-x-full` 슬라이드 트랜지션으로 구현 — 본문 스크롤과 무관하게 항상 화면에 고정됨.
- 초기 열림/닫힘 상태는 `window.matchMedia("(max-width: 767px)")`로 판단 (모바일이면 기본 닫힘, 데스크탑이면 기본 열림). 렌더 중 순수 계산이 불가능한 브라우저 API라 `useEffect`가 필요한데, `setState`를 effect 본문에 직접 두면 `react-hooks/set-state-in-effect` 린트 에러가 나서, `addEventListener("change", ...)`로 등록하는 콜백 함수를 분리해서 그 함수를 effect 안에서 호출하는 방식으로 우회함 (그러면 린트가 "구독 콜백"으로 인식해서 에러가 안 남).
- 모바일에서 열렸을 때는 본문 위에 반투명 backdrop(`md:hidden`)이 깔리고 클릭하면 닫힘. 데스크탑에서는 backdrop 없이 `<main>`에 `md:ml-60` 마진을 줘서 사이드바 너비만큼 자동으로 밀어냄.
- 닫혀있을 때는 좌상단에 떠 있는 열기 버튼(`PanelLeftOpen`), 사이드바 내부 하단에는 닫기 버튼(`PanelLeftClose`).

### 5. `/admin/types` 카드 삭제 + 확인 모달

- `TypeCard`의 호버 액션 영역(우상단)에 기존 '수정' 버튼 옆에 '삭제' 버튼 추가. 기존 hover 처리(`opacity-100 md:opacity-0 md:group-hover:opacity-100`)를 그대로 재사용해서 **모바일에서는 항상 노출, 데스크탑은 호버 시에만 노출**되도록 함 (모바일은 호버 자체가 없는 입력 방식이라 `md:` 브레이크포인트부터만 hover-to-reveal 적용).
- 삭제 클릭 → 공용 `ConfirmModal` 오픈 → 확인 시 `DELETE /api/meeting-types/{id}` (신규 라우트, `meeting-types/[id]/route.ts`에 `DELETE` 추가).
- types/meetings 양쪽에서 동일한 `ConfirmModal`을 재사용하도록 `shared/ui/modal/ConfirmModal.tsx`로 새로 만듦.

### 6. `AdminSidebar` 유저 정보 + 로그아웃 추가, `useUser` 버그 발견

- 사이드바 하단에 로그인된 유저(프로필 이미지/이름/이메일) + 로그아웃 버튼 추가. 로그아웃은 기존 `shared/ui/header/useLogout.ts`(Header에서 쓰던 것)를 그대로 재사용.
- 처음엔 `shared/hooks/useUser.ts`를 썼는데 이름이 항상 "게스트"로만 나옴 → 원인 확인해보니 `useUser`가 **존재하지 않는 `/api/me` 라우트**를 호출하고 있었음 (실제로는 `/api/users/me`만 존재, 응답도 `{ user: ... }`로 감싸져 있지 않고 객체 그대로 옴). grep해보니 이 훅은 지금까지 아무도 쓰지 않던 죽은 코드였고, 어드민 작업에서 처음 가져다 쓰면서 버그가 드러남.
- `useAdminMeetingsViewModel`의 고도화1(`preferredGym`) 로직도 같은 훅을 쓰고 있어서 같이 영향받고 있었음.
- 두 군데 모두 이미 정상 동작 중인 `features/my-page/model/useUserProfile.ts`(`/api/users/me` 호출, `ProfileIcon`이 쓰던 훅)로 교체해서 해결. `shared/hooks/useUser.ts` 자체는 고치지 않고 그대로 둠 — 범위 밖이라 별도 이슈로 다음 작업에 남김.

### 7. 공통 컴포넌트 재사용 점검 결과

- **교체함**: `/admin/types`, `/admin/meetings`의 로딩 placeholder(`animate-pulse` div 직접 작성) → 공용 `Skeleton` 컴포넌트(`shared/ui/skeleton/Skeleton.tsx`)로 교체. 완전히 같은 용도인데 안 쓰고 있던 게 명확한 케이스였음.
- **그대로 둠 (의도적 판단)**:
  - 폼의 타입/지점 `<select>` → `Dropdown`으로 안 바꿈. `Dropdown`은 "버튼 트리거 + 떠 있는 메뉴" 형태라 폼 인풋이 아니라 필터/액션 메뉴용 컴포넌트임. 기존 `features/create-dagym/ui/SetInfo.tsx`도 지점 선택에 plain `<select>`를 쓰고 있어서, 폼에서는 native select가 이 코드베이스의 기존 컨벤션.
  - 어드민의 탭/지점 뱃지(파란색 테마) → `PillTabs`/`CenterFilter`로 안 바꿈. `PillTabs`는 `useTabs` 내부 상태로 active를 관리해서 외부에서 controlled로 동기화하기 까다롭고(현재 탭은 viewmodel의 외부 `tab` state로 관리됨), 색상도 slate 계열로 고정돼 있어 어드민의 블루(`blue-700`) 톤과 다름. 디자인 토큰 불일치를 감수하고 억지로 맞추는 것보다 커스텀 버튼 유지가 낫다고 판단. (`PillTabs`를 controlled로 바꾸는 리팩토링은 범위 밖이라 보류)
  - `Dropdown`은 `/admin/meetings`의 ⋮ 메뉴에서는 그대로 사용함 — 이건 정확히 "버튼 트리거 + 메뉴" 용도라 딱 맞는 케이스.
- ⚠️ 참고용 의견이라, 디자인 통일성 관점에서 다른 판단이면 언제든 교체 가능.

### 8. 공용 `Modal` 컴포넌트 — 긴 콘텐츠 스크롤 처리

- `EditMeetingModal`처럼 필드가 많은 모달은 기존 `Modal.tsx`에 높이 제한이 없어서 화면 위아래로 잘려 보이는 문제가 있었음.
- `shared/ui/modal/Modal.tsx`의 콘텐츠 wrapper를 바깥(`rounded-xl overflow-hidden max-h-[90vh] flex flex-col`) / 안쪽(`flex-1 min-h-0 overflow-y-auto`, padding 포함) 두 겹으로 분리함.
  - 처음엔 한 div에 `rounded-xl` + `overflow-y-auto`를 같이 줬다가 스크롤바가 모서리를 덮어서 둥근 모서리가 사라지는 문제가 생김 → rounded는 바깥, 스크롤은 안쪽으로 분리해서 해결.
  - 그 다음엔 안쪽에 `h-full`을 줬는데 부모가 `auto` 높이일 때 퍼센트 높이가 의도대로 안 잡혀서 스크롤이 전혀 안 되는 문제가 생김 → `flex flex-col` + `min-h-0 flex-1` 패턴으로 교체해서 해결 (퍼센트 높이 대신 flex 기반으로 안쪽 높이를 강제).
- 이건 앱 전체 모달(로그인/회원가입/찜/확인모달 등)에 공통 적용됨 — 짧은 모달은 영향 없고, 콘텐츠가 `90vh`를 넘는 모달만 내부 스크롤이 생기는 식으로 동작.

### 9. 루트 레이아웃 Header 처리

- 처음엔 기존 v1 문서에 적힌 대로 라우트 그룹 `(main)`으로 기존 페이지들을 옮기는 방식을 시도했으나, **팀원이 작업한 파일 경로를 대량으로 옮기는 침습적인 변경**이라 중단하고 원상복구함.
- 대신 `src/app/providers/AppShell.tsx`(클라이언트 컴포넌트)를 추가해서 `usePathname()`으로 `/admin`인지 판별, `/admin`이면 `Header`와 `max-w-7xl` 래퍼를 건너뛰도록 처리.
- **주의**: `Header.tsx`는 `next/headers`의 `cookies()`를 쓰는 **서버 컴포넌트**라서 클라이언트 컴포넌트(`AppShell`) 안에서 직접 import하면 안 됨 (`next/headers` 빌드 에러). 그래서 `layout.tsx`(서버 컴포넌트)에서 `<Header />`를 렌더링한 결과를 `AppShell`에 `header` prop으로 전달하는 구조로 처리함 — Server Component를 Client Component의 prop/children으로 넘기는 Next.js 공식 패턴. `Header.tsx` 자체는 수정하지 않았고 여전히 서버에서만 렌더링됨(SEO 영향 없음).

```tsx
// layout.tsx (Server Component)
<AppShell header={<Header />}>{children}</AppShell>
```

---

## ⚠️ 블로커: 백엔드 권한 모델에 admin 개념이 없음

QA 중 발견: `/admin/meetings`에서 **본인이 만들지 않은 모임**을 수정/삭제하려고 하면 백엔드에서 401이 떨어짐.

- 원인: 현재 유저 스키마(`{ id, email, name, companyName, image }`)에 `role`/`isAdmin` 같은 권한 필드가 전혀 없음. 백엔드의 `PATCH/DELETE /meetings/{id}` (그리고 아마 `meeting-types`도 동일)는 "요청자 == 그 리소스의 `hostId`/`createdBy`"인지만 검사하는 것으로 보임. 그래서 어드민 계정이라도 남이 만든 모임은 거부당함.
- 이건 프론트(Next.js BFF)에서 고칠 수 없음 — `app/api/meetings/[meetingId]/route.ts`는 토큰을 정상적으로 백엔드에 전달하고 있고, 거부는 백엔드 인가 로직에서 일어남.
- **백엔드에 필요한 것**:
  1. 유저 모델에 `role` 또는 `isAdmin` 같은 권한 필드 추가
  2. `PATCH/DELETE /meetings/{id}`(및 `meeting-types`)의 인가 로직을 "본인 소유 OR admin"으로 변경
  3. 어떤 계정/팀을 admin으로 취급할지 기준 합의 (특정 teamId 고정? 별도 role 값?)
- ⚠️ **이 백엔드는 코드잇 스프린트에서 공통 제공하는 공유 백엔드라 우리 팀이 코드를 수정할 수 없음.** 별도 백엔드를 새로 만들어서 붙이는 것도 답이 안 됨 — 새 백엔드가 기존 백엔드의 인증 토큰을 발급/검증할 수 없어서, 기존 `PATCH/DELETE /meetings/{id}`를 호출하는 한 똑같이 막힘. "임퍼소네이션"(admin이 다른 유저로 위장해서 요청)도 결국 기존 백엔드에 그 기능 자체가 추가돼야 가능한 거라 동일한 블로커임. 비밀번호를 알아내서 로그인하는 것도 불가능(비밀번호는 해시로 저장되어 복원 불가) + 시도해서도 안 됨.
- 그래서 백엔드 수정이 불가능한 상황을 받아들이고, **UI 차원에서 막힐 액션을 숨기는 방향으로 대응함** → "4. `/admin/meetings` 행 클릭 상세 + ⋮ 액션 메뉴"의 `canManage` 가드 참고. "관리자 모임" 탭(본인이 만든 모임)에서는 수정/삭제 정상 동작, "유저 모임" 탭에서는 수정하기/삭제하기 메뉴 자체를 숨김(공유하기만 노출).

---

## 다음 작업 목록

- [ ] **(블로커, 우리 팀 권한 밖)** 위 "⚠️ 블로커" 항목 — 공유 백엔드라 우리 팀이 직접 고칠 수 없음. 지금은 `canManage` 가드로 UI에서 막힌 액션을 숨기는 것까지만 대응함
- [ ] 백엔드에 모임 생성 주체 구분 필드가 생기면 `/admin/meetings`의 탭 필터링 로직 교체
- [x] `/admin/create` 제출 실패 시 에러 UI 보강 — `useMutation`의 `onError`에서 `ApiError.message`를 `submitError` state로 저장하고 폼 하단에 노출 (zod 폼 검증과는 별개로, 제출 후 서버 거부/네트워크 실패를 다루는 용도)
- [x] `/admin/meetings` 행 클릭 시 상세 모달 + ⋮ 메뉴(공유/수정/삭제) — 위 "핵심 설계 결정 4" 참고
- [x] `/admin/types` 타입 카드 호버 시 삭제 버튼 추가 (모바일 항상 노출) + 확인 모달 — 위 "핵심 설계 결정 5" 참고
- [x] 어드민 공통 컴포넌트 재사용 점검 — Skeleton 교체, select/PillTabs는 의도적으로 유지 (위 "핵심 설계 결정 6" 참고)
- [ ] `PillTabs`를 controlled(`value` prop으로 외부 상태와 동기화)로 리팩토링하면 `/admin/meetings` 탭에도 재사용 가능 — 지금은 범위 밖으로 보류
- [ ] `shared/hooks/useUser.ts` 정리 필요 — 존재하지 않는 `/api/me`를 호출하는 죽은/버그 코드. 다른 곳에서 import하기 전에 삭제하거나 `/api/users/me` 기준으로 고쳐야 함 (지금은 이 훅을 쓰던 두 곳을 `useUserProfile`로 교체해서 우회함)
- [ ] `/admin/meetings` 공유하기가 가리키는 `/meetings/{id}` 페이지가 실제로 비로그인/타 사용자도 접근 가능한지 확인 필요 (현재는 링크만 복사, 접근 권한 체크 안 함)
- [ ] 어드민 전용 컴포넌트 테스트 추가 (`useAdminCreateViewModel`, `useEditMeetingViewModel`, `useAdminMeetingsViewModel`, `useAdminTypesViewModel`)

---

## 참고

- 기획서: `src/docs/specs/2026_06_17_admin_doyun.md` (변경 없음)
- 이전 핸드오프: `src/docs/handoff/20260617_admin_doyun.md`
- API base: `NEXT_PUBLIC_API_URL/meetings`, `NEXT_PUBLIC_API_URL/users/me/meetings`
