# 핸드오프: 대시보드 운동기록 계산 + 다짐 마감시간(registrationEnd) 정책 변경

## 한 줄 요약

대시보드 3개 지표(연속다짐/다짐횟수/다짐시간)가 "개설확정(`confirmedAt`)" 여부를 전혀 거르지 않고 있던 버그를 고쳤고, 그 김에 다짐 생성 시 마감시간(`registrationEnd`) 계산 방식을 "시작일 하루 전 23:59 고정"에서 "시작 N시간 전"으로 바꿨다. 이 로직이 생성(일반/관리자)/수정 3곳에 각각 따로 구현돼 있던 걸 `shared/lib/calculateRegistrationEnd.ts` 하나로 통합했다.

## 1. 대시보드 — 개설확정 필터 누락

- **증상**: 연속다짐/다짐횟수/다짐시간 계산이 `isCompleted`만 보고 `confirmedAt`(개설확정 여부)을 전혀 체크하지 않음. 코드베이스 전체에 모임 상태(PENDING 등) 개념이 따로 없고, `Dagym` 타입(`entities/meeting/types.ts`)에 `confirmedAt` 필드 자체가 빠져 있었음 (API는 이미 내려주고 있었음).
- **변경**:
  - `entities/meeting/types.ts`: `Dagym`에 `confirmedAt: string | null`, `address: string | null` 추가
  - `features/dashboard/ui/DashboardCardSection.tsx`: select 필터 `isCompleted && !!confirmedAt`로 변경
  - `features/dashboard/model/useDashboardCard.ts`: `calculateStreak`도 횟수/시간 계산과 동일하게 "이번 달" 범위로 제한 (기존엔 전체 기간 대상이었음)
- **결과**: 연속다짐/다짐횟수/다짐시간 모두 "이번 달 + 개설확정 + 완료" 기준으로 통일.

## 2. ReservationCard — 지점 외 장소 주소 미표시

- **증상**: `features/dashboard/ui/ReservationCard.tsx`에서 `nextDagym.region`을 그대로 노출. `region === "지점 외 장소"`인 경우 홈(`/dagym`) 목록처럼 실제 주소(시/구)로 보여줘야 하는데 적용 안 돼 있었음.
- **변경**: `shared/lib/formatRegion.ts`(기존 유틸, `/dagym` 목록에서 쓰던 것) 재사용. `formatRegion(nextDagym.region, nextDagym.address)`로 변경.
- **보류 결정**: `ReservationCard`(예약된 다짐)는 확정 여부(`confirmedAt`)와 무관하게 **날짜가 가장 빠른 모임**을 그대로 보여주기로 함 (사용자 확인: "아니요, 그대로 두기"). 즉 미확정 모임이 확정된 모임보다 날짜가 빠르면 미확정 모임이 노출되는 게 의도된 동작.

## 3. 다짐 마감시간(registrationEnd) 정책 변경

- **증상**: `registrationEnd = 시작일 - 1일, 23:59` 고정 계산이라 **당일 생성한 다짐은 마감시간이 이미 지난 상태**가 되어 목록에 노출되지 않는 문제.
- **변경**: `시작 dateTime - REGISTRATION_END_HOURS_BEFORE(2시간)`으로 정책 변경.
- **신규 공용 유틸**: `shared/lib/calculateRegistrationEnd.ts`
  ```ts
  export function calculateRegistrationEnd(dateTime: string): string {
    return new Date(
      new Date(dateTime).getTime() - REGISTRATION_END_HOURS_BEFORE * 60 * 60 * 1000
    ).toISOString();
  }
  ```
- **적용된 3곳** (전부 `calculateRegistrationEnd` 호출로 통일):
  1. `features/create-dagym/ui/SetDate.tsx` — 일반 사용자 다짐 만들기
  2. `page/admin/dagym-create/model/useMeetingFormFields.ts` — 관리자 다짐 만들기/수정 공용 폼
  3. `features/dagym-detail/components/dagymHero/DagymScheduleInfo.tsx` — 다짐 상세 "수정하기" 모달
     - 부가 수정: 기존엔 `handleTimeChange`(시간만 변경 시)에서 `registrationEnd`를 전혀 갱신하지 않던 버그가 있었음. 날짜/시간 변경 핸들러를 `applyDateTime` 하나로 합쳐서 시간만 바꿔도 마감시간이 재계산되도록 수정.
- **상수**: `features/create-dagym/constants/index.ts`의 `REGISTRATION_END_HOURS_BEFORE = 2`. 마감 기준 시간이 바뀌면 이 상수만 고치면 3곳 다 반영됨.

## 4. 다짐 시간 선택 UI — 최소 리드타임 제약 추가

- **요구사항**: 오늘 날짜로 다짐을 만들 때, 현재 시각 이후 시간을 막던 기존 로직(`isPastHour`/`isPastMinute`)을 "현재 시각 + 3시간 이후부터만 선택 가능"으로 변경. (마감시간이 시작 2시간 전이라, 1번 항목과 별개로 — 만들자마자 모집이 끝나버리는 걸 막기 위함)
- **변경**: `shared/ui/datePicker/utils.ts`
  - `MIN_BOOKING_LEAD_HOURS = 3` 상수 추가
  - `isPastHour`/`isPastMinute`를 `getHours()` 단순 비교 대신, 후보 시각(`selectedDate` + `hour`/`minute`)을 완전한 `Date`로 만들어 "현재시각 + 리드타임"과 직접 비교하는 방식으로 재작성 (밤 10시처럼 +3시간이 다음날로 넘어가는 경계 케이스도 정확히 처리)
  - 두 함수 모두 `minLeadHours` 파라미터를 받도록 변경 (기본값 `MIN_BOOKING_LEAD_HOURS`)
- **TimePicker 인터페이스 확장**: `shared/ui/datePicker/types.ts`/`TimePicker.tsx`에 `minLeadHours?: number` prop 추가, 기본값은 `MIN_BOOKING_LEAD_HOURS`.
- **관리자 예외**: `page/admin/dagym-create/components/MeetingFormFields.tsx`에서 `<TimePicker minLeadHours={0} />`로 넘겨서, 관리자는 당일 생성 시 리드타임 제약 없이 자유롭게 시간 선택 가능. (`features/create-dagym/ui/SetDate.tsx`, `DagymScheduleInfo.tsx`는 prop 안 넘기고 기본값 3시간 그대로 적용)
- **안내 문구**: `SetDate.tsx`에 라벨("다짐 일정") 바로 아래 작은 문구 추가 — "당일 다짐 생성은 3시간 뒤부터 진행 가능합니다. / 참여 모집은 다짐 시작 2시간 전에 자동 마감됩니다." (관리자 폼에는 미적용 — 필요하면 추가 논의)

## 변경 파일 목록

- `src/entities/meeting/types.ts`
- `src/features/dashboard/ui/DashboardCardSection.tsx`
- `src/features/dashboard/model/useDashboardCard.ts`
- `src/features/dashboard/ui/ReservationCard.tsx`
- `src/features/create-dagym/ui/SetDate.tsx`
- `src/features/create-dagym/constants/index.ts`
- `src/shared/ui/datePicker/utils.ts`
- `src/shared/ui/datePicker/types.ts`
- `src/shared/ui/datePicker/TimePicker.tsx`
- `src/page/admin/dagym-create/components/MeetingFormFields.tsx`
- `src/page/admin/dagym-create/model/useMeetingFormFields.ts`
- `src/features/dagym-detail/components/dagymHero/DagymScheduleInfo.tsx`
- `src/shared/lib/calculateRegistrationEnd.ts` (신규)

## 알려진 이슈 / 다음에 볼 것

- 관리자 다짐 만들기 폼(`MeetingFormFields.tsx`)에는 "3시간 뒤부터" 류의 안내 문구가 없음 (관리자는 `minLeadHours={0}`이라 애초에 해당 없음. 단, 마감 2시간 전 정책 안내는 추가 검토 가능).
- `ReservationCard`는 위 2번 항목대로 확정 여부와 무관하게 동작하는 게 **의도된 결정**이니 추후 "왜 미확정 모임이 먼저 보이냐"는 문의가 다시 나오면 이 문서 참고.
- 다짐 찜/참여 상태 캐시 동기화는 별개 이슈로 `20260622_meeting-favorite-join-cache-sync-issue.md` 참고 (이번 작업과 무관, 마이페이지 "나의 다짐" 리스트 미반영 의심 시 같이 체크).
