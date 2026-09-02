# FEATURES-002: Lighthouse 성능/접근성 개선

- **상태:** Done (로컬 검증 완료, 배포 후 재측정 필요)
- **작성자:** Claude (대화 기반 정리)
- **날짜:** 2026-09-02

## 변경 이력

- 2026-09-02: 최초 작성 — 첫 파티 JS 청크 축소, 스크립트 지연 로딩, `/dagym` 배포 리포트 기반 LCP/접근성 수정
- 2026-09-02: 배포 후 재측정에서 배너 이미지 `fetchpriority=high` 경고 발견 및 원인/수정 추가 (Next 16 `priority` prop deprecated 이슈)

## 0. 계기

Lighthouse에서 "Reduce unused JavaScript" 경고(퍼스트 파티 청크 약 71.2 KiB + Google `gsi/client` 82 KiB)가 잡혔고,
이후 배포 사이트(`undongda-gym.vercel.app/dagym`, 로그인 시 대시보드) 리포트를 직접 확인해 LCP 15.1초와 접근성 이슈까지 추가로 손봤다.

## 1. Google / 카카오맵 스크립트를 필요한 페이지로 이동

기존엔 `src/app/layout.tsx`(루트 레이아웃)에 `<Script>`로 Google `gsi/client`와 카카오맵 SDK를 넣어서 **모든 페이지**에서 로드되고 있었다.
실제로 필요한 곳에서만 로드하도록 위치를 옮겼다.

| 파일 | 변경 |
| --- | --- |
| `src/app/layout.tsx` | `gsi/client`, 카카오맵 SDK `<Script>` 2개 제거 |
| `src/features/auth/components/SocialLoginButtons.tsx` | `gsi/client`를 여기로 이동 (`/login`, `/signup`에서만 로드) |
| `src/features/dagym-detail/components/dagymLocation/DagymLocation.tsx` | 카카오맵 SDK를 로컬로 추가. `onReady` 콜백 + `isMapSdkReady` state로 스크립트 로드 완료 후에만 지도를 그리도록 함 (전역 스크립트가 미리 로드돼 있어 드러나지 않았던 레이스 컨디션도 같이 해결) |
| `src/features/dagym-detail/components/dagymHero/DagymBasicInfo.tsx` | 카카오맵 SDK를 로컬로 추가 (기존에 `window.kakao` 없을 때 graceful fallback이 있어 별도 state 불필요) |
| `src/features/create-dagym/ui/SetInfo.tsx` | 원래부터 자체적으로 스크립트를 로드하고 있어 변경 없음 (오히려 전역 스크립트와 URL이 달라 중복 로드되던 게 사라짐) |

## 2. 조건부 렌더링 UI를 `next/dynamic`으로 분리

모달/드롭다운처럼 "열었을 때만 필요한" UI를 정적 import에서 `dynamic(..., { ssr: false })`로 전환.

- `src/shared/ui/header/NotificationBell.tsx` — `NotificationContent`, `NotificationPanel` (알림 데이터 훅 포함). 헤더가 전 페이지 공통이라 효과가 가장 큼.
- `src/features/dashboard/ui/CreateDagym.tsx` — `CreateDagymForm`(다짐 생성 폼, 6개 하위 스텝), `LoginModal`.
- `LoginModal` 정적 import 5곳 추가 전환: `src/page/home/components/DagymList.tsx`, `src/features/dagym-detail/components/dagymHero/DagymHeroActions.tsx`, `src/page/post/[id]/page.tsx`, `src/features/dagym-detail/components/dagymSuggest/SuggestItem.tsx`, `src/page/post/components/PostHeader.tsx`.
  - 단, `LoginModal` 자체가 워낙 작은 컴포넌트라 Turbopack이 같은 라우트의 다른 필수 코드와 한 청크로 병합해버려서, 이 5곳 전환의 **실측 바이트 절감은 미미함**. 구조적으로는 더 낫지만 Lighthouse 점수에 큰 영향은 없었다.

### Before/After 첫 로드 JS 크기 (비압축, `next build`의 `route-bundle-stats.json` 기준)

| 라우트 | Before | After | 차이 |
| --- | --- | --- | --- |
| `/dagym` | 1075.9 KB | 1026.6 KB | **-49.4 KB** |
| `/login` | 1098.8 KB | 1068.0 KB | -30.8 KB |
| `/signup` | 1111.4 KB | 1080.9 KB | -30.5 KB |
| `/` (랜딩) | 807.6 KB | 801.5 KB | -6.1 KB |
| 헤더 있는 페이지 전반 (`/admin`, `/post/write` 등) | | | -5.8 ~ -35.9 KB |
| `/dagym-detail/[id]` | 1008.8 KB | 1008.4 KB | -0.4 KB (원래도 줄일 첫파티 JS가 거의 없던 페이지) |

가장 큰 효과는 `/dagym`(`CreateDagymForm` 분리)과 `/login`, `/signup`(자체 페이지 코드가 가벼워서 비율상 체감 큼). `gsi/client`·카카오맵 스크립트 제거분(82 KiB 등)은 외부 스크립트라 이 표엔 안 잡히고, 대신 `/`·`/dagym` 등에서 해당 네트워크 요청 자체가 사라진다.

## 3. 이미지 `priority` — HotPostSection

`HotPostCard`가 `PostCard`와 컴포넌트를 공유해서 서버 DTO(`PostDTO`)에 `priority`를 넣을 수 없는 문제 → `priority`는 렌더링 시점 값이므로 props로 얕게 흘려보내는 방식으로 해결.

- `src/shared/ui/feed-card/FeedCardImage.tsx` — `priority?: boolean` (기본 `false`) 추가, `next/image`에 그대로 전달.
- `src/features/post/types.ts` — `HotPostCardProps`에 `priority?: boolean` 추가 (`PostDTO`는 건드리지 않음).
- `src/features/post/components/HotPostCard.tsx` — `priority` prop 전달.
- `src/page/post/components/HotPostSection.tsx` — `post.priority`(존재하지 않는 필드) 대신 `index < 2`로 계산. "이번달 HOT 게시글!" 가로 스크롤 카드 중 앞 2장만 우선 로드 — 모바일에서 실제로 한 번에 보이는 카드 수(~1.8장)에 맞춘 값.

## 4. 배포 사이트 `/dagym` 리포트 기반 추가 수정

`undongda-gym.vercel.app/dagym` 배포 리포트(Moto G Power 에뮬레이션, 느린 4G) 분석 결과:

- 성능 71 / 접근성 90 / 권장사항 77 / SEO 100
- LCP 15.1초, FCP 1.6초, TBT 40ms, CLS 0, Speed Index 5.0초

### 4-1. LCP 15.1초 원인 및 수정

**원인:** `src/features/dashboard/ui/ReservationCard.tsx`가 클라이언트에서 `useJoinedMeetings`(react-query)로 데이터를 받아온 뒤에야 배경 이미지(`bg_character.png`)가 있는 실제 카드를 렌더링. 로딩 중엔 스켈레톤만 표시되므로 **LCP 리소스가 서버 초기 HTML에 아예 없었음** (Lighthouse의 "fetchpriority=high 필요", "초기 문서에서 요청 검색 가능해야 함" 체크 실패). 로그인 시 모바일 화면에서 `ReservationCard`가 최상단에 오기 때문에 이게 곧 LCP 요소.

**수정:** `src/page/dagym/page.tsx`에서 서버 컴포넌트 단계에 `queryClient.prefetchQuery`로 `joinedDagyms` 쿼리를 미리 가져와 `HydrationBoundary`로 감싸서 전달. 클라이언트의 `ReservationCard`는 이미 채워진 캐시를 즉시 읽으므로 fetch 대기 없이 첫 렌더부터 실제 카드(배경 이미지 포함)가 나온다. 이 SSR prefetch + hydrate 패턴은 `src/app/providers/AuthHydration.tsx`가 `user` 쿼리에 이미 쓰던 것과 동일한 방식을 그대로 따름.

> ⚠️ 로컬에서는 빌드/타입체크/lint만 검증했고, 백엔드가 없어 런타임 데이터 흐름(prefetch가 실제로 채워지는지)은 확인 못 함. **배포 후 로그인 상태로 Lighthouse 재측정 필요.**

### 4-2. 접근성 — 아이콘 버튼에 접근 가능한 이름 없음

- `src/shared/ui/heart-button/HeartButton.tsx` — `IconButton`에 `ariaLabel`을 전달하지 않고 있었음. `ariaLabel` prop 추가, 기본값은 `isFavorited`에 따라 `"찜하기"` / `"찜 해제"`. 다짐 카드, 상세 페이지 등 찜하기 버튼 전체에 적용됨.
- `src/shared/ui/header/NotificationBell.tsx` — 벨 아이콘 버튼에 `aria-label="알림"` 추가. 헤더는 전 페이지 공통이라 영향 범위 넓음.

### 4-3. 보류한 항목

- **DagymCard 이미지 과다 전송 (~127 KiB)**: `FeedCard.Image`가 `sizes` 없이 `fill`만 써서 Next가 자동으로 `sizes="100vw"`를 적용, 실제 표시 크기(364×273)보다 큰 파일(640×338)을 받아옴. `sizes`를 미디어쿼리 기반으로 조정하면(예: `(min-width: 1280px) 600px, 100vw`) 레이아웃 안 깨고 해결 가능하지만, 이번엔 범위에서 제외.
- **bfcache 차단 (`Cache-Control: no-store`)**: `/dagym`이 `cookies()`를 읽는 서버 컴포넌트라 Next가 자동으로 no-store를 붙이는 것으로 추정. 인증 체크 방식 자체를 바꿔야 해서 손대지 않음.
- 서드파티 쿠키 32개, 색상 대비 부족 등 — 권장사항/접근성 카테고리의 자잘한 항목, 점수 영향 작아서 미착수.

## 5. 배포 후 재측정에서 발견 — `next/image`의 `priority` prop deprecated (Next 16)

머지·배포 후 `/dagym`을 모바일 Lighthouse로 다시 돌리자, 4-1에서 고친 배너 이미지에서
`fetchpriority=high should be applied to the image preload request` 경고가 계속 떴다.

**원인:** `node_modules/next/dist/shared/lib/get-img-props.js` 확인 결과, Next 16부터 `next/image`의
`priority` prop이 deprecated됨. 예전엔 `priority={true}` 하나로 `<link rel="preload">` 삽입과
`fetchPriority="high"` 자동 설정이 같이 됐지만, 지금은 `fetchPriority`가 완전히 분리된 별도 prop이라
`priority`만 줘서는 더 이상 자동으로 붙지 않는다 (`preload: preload || priority`로 preload 플래그만 켜짐).
`AGENTS.md`가 경고한 "이 버전은 알고 있는 Next.js와 다르다"의 실제 사례.

**수정:** deprecated `priority` 대신 새 `preload` prop + 명시적 `fetchPriority="high"`를 함께 사용하도록 변경.

| 파일 | 변경 |
| --- | --- |
| `src/page/dagym/page.tsx` | 배너 `<Image>`: `priority={true}` → `preload` + `fetchPriority="high"` |
| `src/shared/ui/feed-card/FeedCardImage.tsx` | 3장 HotPostSection 작업 때 추가한 `priority` prop이 동일한 문제를 갖고 있어 같이 수정. 외부 API(`priority` prop 이름)는 유지하고 내부에서 `preload`/`fetchPriority`로 매핑 |
| `src/shared/ui/header/Header.tsx` | 로고 이미지 2곳도 동일하게 정리 (LCP 후보일 가능성은 낮지만 일관성 차원) |

> 이 프로젝트에서 `priority`/`fetchPriority`로 LCP 이미지를 다룰 일이 또 생기면, `preload` + `fetchPriority="high"` 조합을 기본으로 쓸 것.

## 6. 참고

- 청크 크기 확인은 `npm run build` 후 `.next/diagnostics/route-bundle-stats.json`의 `firstLoadChunkPaths` / `firstLoadUncompressedJsBytes`로 검증했다 (Turbopack 빌드라 webpack의 "First Load JS" 표 대신 이 파일을 봐야 함).
