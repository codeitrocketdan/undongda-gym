# 이슈: 다짐 찜/참여(+게시글 좋아요) 상태가 화면마다 따로 캐시되어 동기화가 깨짐

## 한 줄 요약

다짐(모임)의 `isFavorited`/`isJoined`/`participantCount`가 여러 React Query 캐시에 **중복 저장**되어 있는데, 이걸 하나로 묶어주는 단일 동기화 장치가 없어서 "한 화면에서 토글 → 다른 화면에서 안 보임" 버그가 계속 다른 형태로 재발했다. 이번에 시도했던 수정들은 전부 같은 근본 원인의 다른 증상이었다.

## 증상 (실제로 겪은 순서)

1. **성능**: 다짐 목록을 무한스크롤로 여러 페이지 불러온 뒤 찜/참여 토글 → `invalidateQueries`가 이미 불러온 페이지 전체를 순차 재요청 (11페이지 스크롤 후 토글 1회 = 12건 순차 요청, ~1.1초)
2. **상세→목록 미반영**: 다짐 상세 페이지에서 찜/참여해도 나의 다짐/찜 목록/홈 목록 캐시가 안 바뀜
3. **목록→나의 리뷰 미반영**: 목록에서 찜해도 "나의 리뷰 > 작성 가능한 리뷰" 탭(`userMeetingQueries`)에 반영 안 됨
4. **목록→상세 미반영**: 목록에서 찜/참여하고 상세 페이지로 들어가도 반영 안 됨 (정확히는: 상세 페이지 캐시를 아예 patch하지 않음)
5. **타입 불일치로 4번 수정이 실제로는 동작 안 함**: `dagymQueries.detail(id)`를 숫자 `id`로 호출했는데, 상세 페이지는 **문자열** `meetingId`로 같은 캐시 키를 만들고 있어서 React Query가 둘을 다른 캐시로 취급 → patch가 아무도 안 읽는 유령 캐시에 쓰여짐. 처음 한 번은 "캐시가 없어서 네트워크로 새로 불러온 진짜 데이터"가 우연히 맞게 보였을 뿐, 재진입부터는 stale 데이터를 보여줬다.

## 같은 모임 상태가 보이는 모든 캐시 위치 (전부 동기화 대상)

| 캐시 키 | 화면 | 데이터 모양 | id 타입 |
|---|---|---|---|
| `meetingQueries.list(...)` (`["meetings", filters]`) | 홈 다짐 목록 | `InfiniteData<{data: MeetingWithHostDTO[]}>` | number |
| `favoriteQueries.list(...)` (`["favorites", filters]`) | 찜 목록 | `InfiniteData<{data: FavoriteWithMeetingDTO[]}>` (`.meeting` 중첩) | number |
| `userMeetingQueries.joined()/created()/writable()` (`["users","me","meetings",...]`) | 나의 다짐 / 내가 만든 다짐 / 작성 가능한 리뷰 | `InfiniteData<{data: JoinedMeetingDTO[] \| MeetingWithHostDTO[]}>` | number |
| `dagymQueries.detail(meetingId)` (`["dagym","detail",meetingId]`) | 다짐 상세 페이지 | 단일 `Dagym` 객체 | **string** (route param) |
| `dagymQueries.suggests()` (`["dagym","suggest",region]`) | 상세 페이지 "이런 모임은 어때요?" | `{data: Meeting[]}` (non-infinite) | number (응답 바디) |
| `dagymQueries.participants(meetingId)` (`["dagym","detail",meetingId,"participants"]`) | 상세 페이지 참여자 목록 | `{data: Participant[]}` | **string** (route param) |
| `postQueries.all`/`postQueries.hot` | 게시글 목록/HOT 게시글 | `{data: PostDTO[]}` (likeCount만, isLiked 없음) | number |
| `postQueries.detail(postId)` | 게시글 상세 | 단일 `PostDetailDTO` | string |

**핵심 문제**: `dagymQueries.detail`/`participants`는 Next.js route param이라 항상 **문자열**로 키가 만들어지는데, 나머지 목록들은 전부 **숫자** `id`를 쓴다. swagger 기준으로는 `meetingId`/`meeting.id`가 전부 `"type": "number"` (path parameter도 `"type": "integer"`)이므로, **원칙적으로는 숫자가 맞고 다짐 상세 기능(`dagymQueries`, `useDagymDetailQuery`, `useJoinMutation`, `useFavoriteMutation`, `DagymHero*`, `DagymParticipants`, `DagymSuggest`, `DagymReviews`, `DagymUpdateModal` 등 14개 파일)이 문자열을 쓰는 쪽이 잘못**이다.

## 시도했던 해결 방향과 한계

- `invalidateQueries` 전체 무효화 → `queryClient.setQueriesData`로 직접 patch (성능 문제는 해결됨, 정확함)
- 패치 로직을 4개 훅(`useFavorite`, `useJoinMeeting`, `useFavoriteMutation`, `useJoinMutation`)에 각각 추가 → 매번 어딘가 빠짐 (위 증상 2~4번)
- `src/features/dagym/lib/syncMeetingCaches.ts`로 "어떤 캐시가 보이는지" 아는 로직을 한 곳에 모음 → 맞는 방향이지만, `dagymQueries.detail(id)`를 숫자로 호출해서 여전히 실제로는 동작 안 했음 (`String(id)`로 임시 봉합)

## 다음에 한 번에 처리할 때 권장 순서

1. **타입 통일을 먼저 한다.** `meetingId`를 Next.js route param에서 받는 진입점(`page.tsx`)에서 즉시 `Number(id)`로 변환하고, `dagymQueries`(`detail`/`participants`/`reviews`/`reviewPage`)와 그 14개 소비 파일의 시그니처를 전부 `number`로 통일한다 (`string | number` 유니언 제거). swagger와 일치시키는 것이므로 임시 변환(`String(id)`) 없이 끝낼 수 있다.
2. 타입을 통일한 뒤에 `syncMeetingCaches.ts`(`syncFavoriteState`/`syncJoinState`)를 다시 적용한다 — 이제 모든 캐시 키가 숫자로 일관되므로 별도 변환이 필요 없다.
3. **유닛 테스트만으로 검증하지 말 것.** mock된 `queryClient.setQueryData`는 실제 키 매칭(해시 비교)을 흉내 내지 않아서 string/number 불일치 같은 버그를 못 잡는다. 반드시 브라우저에서 다음 흐름을 수동으로 확인한다:
   - 목록에서 찜/참여 토글 → 상세 진입 → 확인 → 뒤로가기 → 다시 토글 → 다시 상세 진입 → 확인 (이번에 실제로 터졌던 시나리오)
   - 상세에서 토글 → 뒤로가기 → 목록/찜 목록/나의 다짐/나의 리뷰 각 탭에서 확인
4. 게시글 좋아요(`usePostLike`)는 같은 패턴(목록엔 `likeCount`만 있고 `isLiked` 없음)이라 위 1~2번과 같은 타입 문제는 없지만, 같은 회귀가 또 나타나지 않는지 위 체크리스트 방식으로 같이 검증한다.
5. (선택, 더 근본적인 대안) 모임 하나당 캐시를 여러 곳에 중복 저장하는 대신, `meetingQueries`/`favoriteQueries`/`userMeetingQueries` 등에서 **참조만 들고 상세 데이터는 `dagymQueries.detail(id)` 하나에서 가져오는 정규화(normalized cache) 구조**나, TanStack Query의 `select`를 활용해 "보여줄 때마다 같은 단일 소스에서 파생"하는 방식으로 바꾸면 동기화 문제 자체가 사라진다. 다만 이번 범위보다 훨씬 큰 리팩터링이라 별도 논의가 필요하다.

## 영향 범위 (이번에 손댔던 파일, 전부 되돌림)

- `src/features/favorite/model/useFavorite.ts` / `.test.ts`
- `src/features/dagym/model/useJoinMeeting.ts` / `.test.ts`
- `src/features/dagym-detail/api/useFavoriteMutation.ts`
- `src/features/dagym-detail/api/useJoinMutation.ts`
- `src/features/post/model/usePostDetail.ts` / `.test.ts`
- `src/shared/hooks/useSuspenseInfiniteList.ts` (`CursorPage` export)
- `src/shared/lib/patchListQueryCache.ts` (신규, 삭제됨)
- `src/features/dagym/lib/patchMeetingState.ts`, `syncMeetingCaches.ts` (신규, 삭제됨)
