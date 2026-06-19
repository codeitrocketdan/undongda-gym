### ✨ 설명

> 제공된 알림 REST API(GET, PUT, DELETE)를 활용하여 사용자의 알림 내역을 조회, 읽음 처리, 삭제할 수 있는 알림 센터 기능을 구현합니다.
> 페이지 진입 시 및 유저 액션 시점에 맞춰 최신 알림 상태를 동기화하며, 사용자가 알림 내역을 직관적으로 관리할 수 있도록 UI/UX를 구축합니다.

### 📝 작업할 내용

> 기능 구현을 위해 필요한 작업 목록을 체크리스트로 작성해주세요.

> [초기 데이터 조회 및 뱃지 반영]
>
> - [ ] 메인 레이아웃 및 헤더 진입 시 GET /:teamId/notifications/unread-count 호출하여 안 읽은 알림 개수 조회
> - [ ] 읽지 않은 알림이 0보다 클 경우, 종 모양 아이콘 위에 빨간색 알림 뱃지(count) 노출 처리
> - [ ] 주요 페이지 이동이나 새로고침 시 주기적으로 안 읽은 알림 개수를 갱신하는 로직 검토 (폴링 방식 적용 여부 결정)

> [알림 센터 리스트 UI 및 조회]
>
> - [ ] 종 모양 아이콘 클릭 시 노출되는 알림 내역 드롭다운(또는 팝오버) UI 구현
> - [ ] 알림 센터가 열릴 때 GET /:teamId/notifications를 호출하여 최신 알림 목록 리스트 렌더링
> - [ ] 데이터가 비어있을 경우 "새로운 알림이 없습니다" 빈 화면(Empty) UI 처리

> [알림 읽음 및 상호작용 연동]
>
> - [ ] 특정 알림 클릭 시 PUT /:teamId/notifications/:notificationId/read를 호출하여 개별 읽음 처리 (화면에서 읽음 스타일 반영 및 뱃지 카운트 -1)
> - [ ] "모두 읽음" 버튼 클릭 시 PUT /:teamId/notifications/read-all 호출 및 화면 내 전체 알림 읽음 상태로 즉시 변경

> [알림 삭제 기능 연동]
>
> - [ ] 개별 알림 우측의 삭제(X) 버튼 클릭 시 DELETE /.../:notificationId 호출 및 목록에서 제거
> - [ ] "전체 삭제" 버튼 클릭 시 DELETE /:teamId/notifications 호출 및 목록 비우기 처리

### 🔗 참고 자료

> 도움이 될 만한 링크나 자료가 있다면 첨부해주세요.
> 스웨거
> GET /:teamId/notifications (알림 목록 조회)

- 알림 종류: 개설 확정(MEETING_CONFIRMED), 모임 참여 취소(MEETING_CANCELED), 모임 삭제(MEETING_DELETED), 댓글(COMMENT)
- isRead 파라미터로 읽음/미읽음 필터링 가능
  > DELETE /:teamId/notifications (전체 알림 삭제)
  > GET /:teamId/notifications/unread-count (읽지 않은 알림 수 조회)
  > PUT /:teamId/notifications/read-all (모든 알림 읽음 처리)
  > PUT /:teamId/notifications/:notificationId/read (특정 알림 읽음 처리)
  > DELETE /:teamId/notifications/:notificationId (특정 알림 삭제)
