# 운동다짐 (Undongda Gym)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

그룹 운동 클래스("다짐")를 만들고, 찾고, 예약·참여하고, 후기를 남기는 운동 커뮤니티 플랫폼입니다.

"다짐"은 정해진 시간·장소에 모여서 진행하는 그룹 운동을 가리키는 서비스 용어입니다.
관리자(헬스장)는 웨이트, 필라테스, 스피닝, 부스터, 리커버리, 스페셜클래스 등 정규 수업을 생성할 수 있습니다.
사용자(회원)는 추가적인 운동 모집을 위해 다짐을 만들고(호스트), 둘러보고, 찜하고, 참여 신청하고, 종료된 다짐에는 리뷰를 남길 수 있습니다.

## 운영 주소

[https://undongda-gym.vercel.app/](https://undongda-gym.vercel.app/)

## 테스트 계정

- 관리자
  admin@admin.com / admin123!
- 회원
  rocket@example.com / password123

## 시작하기

```bash
pnpm install
pnpm dev
```

[http://localhost:3000](http://localhost:3000)에서 결과를 확인할 수 있습니다.

### 주요 스크립트

```bash
pnpm dev      # 개발 서버 실행
pnpm build    # 프로덕션 빌드
pnpm start    # 프로덕션 서버 실행
pnpm lint     # ESLint 검사
pnpm test     # Jest 테스트 실행
```

### 요구 사항

- Node.js >= 22
- pnpm

## 주요 기능

- 그룹 운동 클래스("다짐") 생성·탐색·찜·참여 신청
- 이메일/구글/카카오 로그인 및 마이페이지(내 다짐, 내 리뷰) 관리
- 종료된 다짐에 대한 리뷰 작성 및 별점 통계 확인
- 게시판을 통한 커뮤니티 소통 (댓글, 좋아요, HOT 게시글)
- 모임 확정/취소/댓글 알림
- 관리자용 다짐 타입 관리 및 다짐 리스트 대시보드

| 영역            | 경로                             | 설명                                                                        |
| --------------- | -------------------------------- | --------------------------------------------------------------------------- |
| 랜딩            | `page/landing`                   | 서비스 소개, 카테고리, 후기, 커뮤니티 미리보기, CTA                         |
| 다짐 홈         | `page/dagym`                     | 배너 + 다짐 목록, 로그인 시 예약 카드/대시보드 노출                         |
| 다짐 상세       | `page/dagym-detail`              | 상세 정보, 참여 신청, 찜, 위치(카카오맵), 리뷰, 추천 다짐, 호스트 수정/삭제 |
| 다짐 생성       | `features/create-dagym`          | 타입·이름·지점·이미지·설명·일정·정원 입력                                   |
| 게시판          | `page/post`                      | 게시글 목록/작성/수정/상세, 댓글, 좋아요, HOT 게시글                        |
| 리뷰            | `page/review`, `features/review` | 다짐별 리뷰/평점, 통계(별점 분포)                                           |
| 찜 목록         | `page/favorite`                  | 내가 찜한 다짐 모아보기                                                     |
| 마이페이지      | `page/mypage`                    | 내가 만든 다짐, 참여한 다짐, 작성 가능/작성한 리뷰                          |
| 알림            | `features/notification`          | 모임 확정/취소/삭제, 댓글 알림 (읽음 처리)                                  |
| 로그인/회원가입 | `page/login`, `page/signup`      | 이메일 로그인 + 구글/카카오 소셜 로그인                                     |
| 관리자          | `page/admin`                     | 대시보드, 다짐 타입 관리, 다짐 생성, 다짐 리스트 (지점/관리자·유저 필터)    |

## 기술 스택

- **프레임워크**: Next.js 16 (App Router), React 19, TypeScript
- **데이터 페칭**: TanStack React Query, nuqs (URL 쿼리 상태)
- **폼/검증**: React Hook Form, Zod
- **스타일링**: Tailwind CSS 4
- **UI/인터랙션**: Framer Motion, Swiper, Tiptap, Lucide
- **날짜**: date-fns / date-fns-tz
- **지도/주소**: 카카오맵 SDK, 카카오 우편번호(Daum Postcode)
- **인증**: Google OAuth, Kakao OAuth
- **테스트**: Jest, React Testing Library
- **코드 품질**: ESLint, Prettier, Husky + lint-staged
- **패키지 매니저**: pnpm

## 아키텍처

Feature-Sliced 유사 구조로 구성되어 있습니다.

```
src/
├── app/         # Next.js App Router 엔트리, 라우팅
├── page/        # 페이지 단위 컴포넌트 (실제 화면 조립)
├── features/    # 기능 단위 모듈 (UI + 모델 + API) — dagym, post, review, favorite, notification, auth, admin 등
├── entities/    # 도메인 모델 (user, meeting)
├── shared/      # 공통 UI/유틸/상수/API 클라이언트
├── docs/        # 설계 문서 (adr, api, features, guide, handoff, specs)
└── middleware.ts
```
