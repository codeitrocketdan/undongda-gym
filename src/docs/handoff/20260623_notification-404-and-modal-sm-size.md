# 핸드오프: 알림 클릭 시 404 처리 + 알림 삭제 버튼 버블링 + 관리자 공유하기 + Modal sm 사이즈 + 헤더 메뉴 하이라이트

## 한 줄 요약

알림 클릭 시 삭제된 다짐/게시글로 이동하면 404가 뜨던 문제를 고치면서, 같은 패턴의 잘못된 링크 버그(`/meetings/{id}` → `/dagym-detail/{id}`)를 알림과 관리자 "공유하기" 두 군데에서 발견해 같이 고쳤다. 그 김에 알림 삭제(X) 버튼의 키보드 버블링 버그, 관리자 다짐 목록 공유 버튼이 무반응처럼 보이던 문제도 고쳤다. 별개로 공통 `Modal`에 짧은 메시지/확인용 모달을 위한 `size="sm"` variant를 추가했고, 헤더 네비게이션 메뉴 하이라이트가 정확히 같은 경로일 때만 켜지던 것도 하위/연관 경로까지 켜지도록 고쳤다.

## 1. 알림 클릭 → 삭제된 리소스로 이동 시 404

- **증상**: 다짐/게시글 알림을 클릭하면 해당 상세 페이지로 이동하는데, 이미 삭제된 리소스면 그냥 404(또는 빈 화면)가 떴음.
- **원인 ①(라우팅 버그)**: `features/notification/ui/NotificationItem.tsx`의 `getHref`가 모임 알림을 `/meetings/{meetingId}`로 보내고 있었는데 이 경로 자체가 존재하지 않음. 실제 다짐 상세 경로는 `/dagym-detail/{id}`.
- **원인 ②(분기 처리 없음)**: 백엔드 404를 `ApiError(status, message)`로 끝까지 전달하고는 있었지만(`clientFetcher` → BFF route → `serverFetcher`), 상세 페이지 두 곳 다 `status`로 분기하지 않았음.
  - `page/post/[id]/page.tsx`: `isError`면 무조건 "일시적인 오류" 문구 + `ErrorModal` 노출
  - `page/dagym-detail/page.tsx`: `if (!dagym) return null` — 에러여도 그냥 빈 화면
- **변경**:
  - `features/notification/ui/NotificationItem.tsx`: `getHref`의 모임 알림 경로를 `/dagym-detail/${meetingId}`로 수정
  - `features/post/model/usePostDetail.ts`: `onError` 콜백이 에러 객체를 받도록 변경 (`onError?: (error: unknown) => void`)
  - `page/post/[id]/page.tsx`: `error instanceof ApiError && error.status === 404`일 때 "삭제되었거나 존재하지 않는 게시글입니다." 표시, 이 경우엔 `ErrorModal`을 띄우지 않음 (그 외 에러는 기존 동작 유지)
  - `page/dagym-detail/page.tsx`: `isError` 분기 추가, 404면 "삭제되었거나 존재하지 않는 다짐입니다." + 뒤로가기 버튼, 그 외 에러는 "페이지를 불러오는데 문제가 발생하였습니다."

## 2. 알림 삭제(X) 버튼 — 키보드 조작 시 같이 이동되는 버그

- **증상**: X 버튼을 마우스로 클릭하면 정상 동작(`onClick`에 이미 `e.stopPropagation()` 있었음). 하지만 Tab으로 X 버튼에 포커스한 뒤 Enter/Space로 삭제하면, 그 keydown 이벤트가 바깥 `div`의 `onKeyDown`(Enter/Space 시 `markReadAndNavigate` 호출)까지 버블링되어 삭제 대신/같이 페이지 이동이 발생.
- **변경**: `features/notification/ui/NotificationItem.tsx`의 X 버튼에 `onKeyDown={(e) => e.stopPropagation()}` 추가.

## 3. 관리자(`/admin/dagyms`) 다짐 목록 "공유하기" 무반응

- **증상**: 더보기(⋮) 메뉴 → 공유하기 클릭해도 아무 일도 안 일어나는 것처럼 보임.
- **원인**: `handleShare`는 실제로 클립보드 복사를 하고 있었고, 성공 시 드롭다운 아이템 텍스트를 "공유하기" → "링크 복사됨"으로 2초간 바꿔주는 로직(`sharedMeetingId`)도 있었음. 하지만 `Dropdown.Item`(`shared/ui/dropdown/DropdownItem.tsx`)이 클릭 시 `onClick` 실행 후 즉시 메뉴를 닫아버려서, 그 텍스트 변화를 볼 수 있는 타이밍이 전혀 없었음. 즉 복사는 됐는데 사용자에게 보이는 피드백이 없었던 것.
- **추가로 발견한 버그**: 복사되는 URL이 `${origin}/meetings/${meeting.id}`로, 1번 항목과 동일한 존재하지 않는 경로였음.
- **변경**: `page/admin/dagym-list/model/useAdminMeetingsViewModel.ts`의 `handleShare`
  - URL을 `/dagym-detail/${meeting.id}`로 수정
  - 다짐 상세 페이지(`features/dagym-detail/components/dagymHero/DagymHeroActions.tsx`)와 동일하게 성공 시 `alert("링크가 클립보드에 복사되었습니다.")`, 실패 시 `alert("링크 복사에 실패했습니다. 주소창의 링크를 복사해주세요.")` 추가
  - 기존 `sharedMeetingId` 기반 "링크 복사됨" 텍스트 로직은 그대로 남겨둠 (드롭다운이 닫혀서 실질적으로 안 보이긴 하지만, alert로 즉시 피드백이 가니 우선 손대지 않음 — 드롭다운 자체를 안 닫게 할지는 별도 논의 필요)

## 4. 공통 `Modal` — `size="sm"` variant 추가

- **배경**: `ErrorModal`/`ConfirmModal`/`LoginModal`/`SignupSuccessModal`/`DeleteConfirmModal`처럼 텍스트 한두 줄짜리 메시지 모달도, 폼이 들어가는 모달과 동일하게 `max-w-136`(544px) 고정 박스를 써서 내용에 비해 모달이 커 보였음.
- **변경**: `shared/ui/modal/Modal.tsx`에 `size?: "default" | "sm"` prop 추가 (기본값 `"default"`, 기존 동작과 동일).
  - `default`: `max-w-136 xs:p-12 px-6 py-8` (기존 그대로)
  - `sm`: `max-w-86`(344px, 디자인 343px과 거의 동일) + `p-6`(24px)
  - `size`를 기존 `ModalContext`(`CloseButton`이 쓰던 것과 같은 패턴)에 실어서 `Header`/`Footer`도 사이즈를 읽을 수 있게 함
  - `Header.tsx`: `size === "sm"`이면 `mb-5`(20px), 기본은 기존 `mb-12` 유지
  - `Footer.tsx`: `size === "sm"`이면 `mt-8`(32px), 기본은 기존 `mt-14` 유지
  - `Body.tsx`: `break-keep`(`word-break: keep-all`) 클래스 추가 — 모달 본문 텍스트가 어절 단위로 줄바꿈되도록
- **적용한 곳**: `ErrorModal`, `LoginModal`, `SignupSuccessModal`, `ConfirmModal`, `DeleteConfirmModal`에 `size="sm"` 적용. 폼/콘텐츠형 모달(`ProfileModal`, `ReviewModal`, `AddTypeModal`, `EditMeetingModal`, `MeetingDetailModal`, `DagymUpdateModal`, `CreateDagymForm`, 대시보드 캘린더 모달)은 `size` 미지정으로 기존 크기 유지.

## 5. 헤더 네비게이션 메뉴 하이라이트 — 하위 경로에서 꺼짐

- **증상(PC/모바일 둘 다 동일)**: "다짐 토크" 메뉴는 `/post`일 때만 하이라이트되고, 게시글 상세(`/post/623`)로 들어가면 하이라이트가 사라짐. "다짐 보기"(`/dagym`)도 다짐 상세(`/dagym-detail/{id}`)에서는 하이라이트 안 됨.
- **원인**: `NavLinks.tsx`(PC), `MobileMenuContent.tsx`(모바일) 둘 다 `isActive = pathname === item.href`로 **정확히 같은 경로**만 비교하고 있었음.
- **변경**: 두 컴포넌트가 공유하는 헬퍼 `shared/ui/header/isNavItemActive.ts` 신규 작성.
  - 기본적으로 `pathname === href` 이거나 `pathname.startsWith(href + "/")`이면 활성으로 처리 (`/post` → `/post/623` 등 하위 경로 전부 커버)
  - `/dagym`만 따로 `ACTIVE_PREFIXES`에 `["/dagym", "/dagym-detail"]`로 매핑해서, 경로 패턴이 다른 "다짐 상세(`/dagym-detail`)"도 "다짐 보기" 메뉴에 같이 하이라이트되도록 함
  - `NavLinks.tsx`, `MobileMenuContent.tsx` 둘 다 이 헬퍼로 교체

## 변경 파일 목록

- `src/features/notification/ui/NotificationItem.tsx`
- `src/features/post/model/usePostDetail.ts`
- `src/page/post/[id]/page.tsx`
- `src/page/dagym-detail/page.tsx`
- `src/page/admin/dagym-list/model/useAdminMeetingsViewModel.ts`
- `src/shared/ui/modal/Modal.tsx`
- `src/shared/ui/modal/Header.tsx`
- `src/shared/ui/modal/Footer.tsx`
- `src/shared/ui/modal/Body.tsx`
- `src/shared/ui/modal/ErrorModal.tsx`
- `src/shared/ui/modal/LoginModal.tsx`
- `src/shared/ui/modal/SignupSuccessModal.tsx`
- `src/shared/ui/modal/ConfirmModal.tsx`
- `src/shared/ui/modal/DeleteConfirmModal.tsx`
- `src/shared/ui/header/isNavItemActive.ts` (신규)
- `src/shared/ui/header/NavLinks.tsx`
- `src/shared/ui/header/MobileMenuContent.tsx`

## 알려진 이슈 / 다음에 볼 것

- 관리자 공유하기의 "링크 복사됨" 텍스트 피드백은 드롭다운이 즉시 닫혀서 여전히 실질적으로 보이지 않음. alert로 우선 해결했지만, 드롭다운을 닫지 않거나 별도 토스트 컴포넌트로 통일하는 게 더 깔끔한 방향일 수 있음.
- `/meetings/{id}` 오타 패턴이 두 군데(알림, 관리자 공유)에서 같은 형태로 발견됐음 — 혹시 다른 곳에도 같은 오타가 남아있는지 한 번 전체 검색해볼 만함.
- 본인이 작성한 댓글에는 알림이 안 가는 것으로 보임(백엔드 동작, 프론트 코드에는 분기 없음) — 알림 관련 추가 작업 시 참고.
- 메뉴 항목이 늘어나서 또 같은 패턴(메뉴 경로와 실제 상세 경로가 다른 경우)이 생기면 `isNavItemActive.ts`의 `ACTIVE_PREFIXES`에 추가하면 됨.
