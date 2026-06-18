# 📋 운동다 짐 (Undongda Gym) 관리자 페이지 개발 기획서

## 1. 전역 레이아웃 및 네비게이션 구조

- 구조: 좌측 고정 사이드바(Sidebar) + 우측 메인 콘텐츠 뷰
- 사이드바 메뉴: [대시보드], [다짐 타입 관리], [다짐 만들기], [다짐 리스트]
- 디자인 특징: 현재 활성화된 메뉴는 다크 네이비(블루700) 배경 처리 및 흰색 텍스트로 시각적 하이라이트 제공.

## 2. 페이지별 화면 설계 및 요구사항

### 2.1. 대시보드 (Dashboard)

- 환영 메시지 헤더 배치.
- '빠른 시작' 가이드 보드 카드 구현: 각 단계별 안내 문구와 함께 해당 영역으로 이동하는 단축 버튼 컴포넌트 탑재.
  1. 다짐 타입을 먼저 설정하세요 -> [다짐 타입 관리로 이동]
  2. 새로운 다짐을 생성하세요 -> [다짐 만들기로 이동]
  3. 다짐을 관리하세요 -> [다짐 리스트로 이동]

### 2.2. 다짐 타입 관리 (Type Management)

- 기본 데이터 풀: 웨이트, 필라테스, 스피닝, 부스터, 리커버리, 스페셜클래스
- 화면 상태: 우측 상단 [+ 새 타입 추가] 버튼 존재. 아직 등록된 데이터가 없는 Empty State일 때 중앙에 비어있는 일러스트와 안내 문구 노출.
- 인풋 폼 확장성: 새 타입 추가 시 '타입 명칭'과 '기본 매칭 대표 이미지 URL'을 세트로 세팅하여 저장 가능한 모달/인풋 구조 설계.
- 현재 모입 타입 필드는
  ```
  {
    "id": 1,
    "teamId": "team-1",
    "name": "달램핏",
    "description": "달램핏 모임입니다",
    "createdAt": "2026-01-28T12:00:00.000Z"
  }
  ```
  이렇게 되어 있고 수정할 수 없어서 대표 이미지를 넣을 수 없지만, description 을 활용해서 img url을 저장하고 싶습니다.

### 2.3. 다짐 만들기 (Create Meeting)

- 기존 서비스의 "모임 만들기" 4단계 등록 모달 로직을 단일 폼 뷰로 통합 구현.
- 입력 컴포넌트 명세 (\*는 필수):
  1. 타입 선택 (\*): Dropdown UI (웨이트, 필라테스 등) -> [고도화 2] 자동 연동 트리거
  2. 다짐 이름 (\*): Input (Text) (각 운동 타입에 맞는 적절한 수업 타이틀을 지정해주세요. 그룹으로 진행하는 수업입니다.)
  3. 지점 선택 (\*): Dropdown UI (지점 종류는 C:\work\undongda\src\shared\constants\centers.ts 참고)
  4. 이미지 (\*): 타입 선택 시 고유 대표 주소가 자동으로 프리셋되는 인풋 (사용자 수동 변경 가능)
  5. 다짐 설명 (\*): Textarea
  6. 다짐 일정 (\*): Date & Time Picker
  7. 모집 정원 (\*): 최소 3명 ~ 최대 20명 숫자 제어 인풋 (Validation 적용) 기본은 20명으로 셋팅

### 2.4. 다짐 리스트 (Meeting List)

- 2중 필터 구조 레이아웃:
  - 상단 탭 필터: [관리자 모임] / [유저 모임] 스위칭 버튼
  - 하단 지점 필터: [전체], [강남점], [판교점], [마곡점] 등 상수파일에 있는 지점 리스트 수평 뱃지 버튼
- Empty State UX: 생성 완료된 방이 없을 시 달력 아이콘과 함께 안내 텍스트 노출 및 [다짐 만들기] 바로가기 버튼 제공.

## 3. 고도화 요구사항 & 고급 UX 로직 구현

### 🔥 고도화 1. 유저 프로필 선호 지점 기반의 리스트 자동 필터링

- 유저 데이터 구조 확장: 유저 프로필에 `preferredGym` (자주 이용하는 지점) 필드가 있다고 가정.
- 지금 user 데이터 필드는
  ```
  {
    "id": 1,
    "teamId": "dallaem",
    "email": "test@example.com",
    "name": "홍길동",
    "companyName": "코드잇",
    "image": null
  }
  ```
  이렇게 있는데, 수정할 수 없음. "companyName"이 현재 사용하고 있지 않아서 이 값을 preferredGym을 대체하여 활용하면 좋을 것 같음.
- 다짐 리스트 페이지 마운트 시, 유저의 `preferredGym` 값이 존재하면 지점 필터의 초기 활성화(Default Active) 값을 '전체'가 아닌 해당 지점으로 자동 세팅하여 맞춤 피드를 먼저 렌더링하도록 처리해 주세요.

### 🔥 고도화 2. 다짐 타입별 대표 이미지 매칭 자동화 시스템

- 컴포넌트 내부에 타입별 고유 매칭 이미지 맵 상수를 바인딩합니다.
  현재 저 url은 임시입니다.
  추후에 supabase에 업로드 되면 그 주소를 수동으로 입력해서 교체해 넣겠습니다.
  ```javascript
  const TYPE_DEFAULT_IMAGES = {
    웨이트:
      "[https://images.undongda.com/default/weight.jpg](https://images.undongda.com/default/weight.jpg)",
    필라테스:
      "[https://images.undongda.com/default/pilates.jpg](https://images.undongda.com/default/pilates.jpg)",
    스피닝:
      "[https://images.undongda.com/default/spinning.jpg](https://images.undongda.com/default/spinning.jpg)",
    부스터:
      "[https://images.undongda.com/default/booster.jpg](https://images.undongda.com/default/booster.jpg)",
    리커버리:
      "[https://images.undongda.com/default/recovery.jpg](https://images.undongda.com/default/recovery.jpg)",
    스페셜클래스:
      "[https://images.undongda.com/default/special.jpg](https://images.undongda.com/default/special.jpg)",
  };
  ```
