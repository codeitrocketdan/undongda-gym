# 이메일 로그인 구현

## 1. 요약

**BFF(Backend For Frontend) 패턴**을 기반으로 인증 시스템을 구현합니다.

## 2. 목표

- **SSR 환경에서 로그인 상태 유지**
- **`httpOnly` 쿠키 기반 보안 강화**
- **Access Token 자동 재발급 (Refresh Token Rotation)**
- **Middleware 기반 인증 및 라우트 보호 처리**
- **클라이언트 환경에서 토큰 직접 접근 방지**

## 3. 아키텍처

전체적인 시스템 구조는 브라우저와 백엔드 API 서버 사이에 Next.js가 BFF 레이어로 위치하는 형태입니다.

```js
Browser  ──>  Next.js (BFF)  ──>  Backend API Server
```

## 4. 인증 흐름

### 4.1 로그인 (Login Flow)

1. 사용자가 브라우저를 통해 로그인을 요청합니다.
2. Next.js BFF(Route Handler)가 이를 받아 백엔드 인증 서버로 전달합니다.
3. 백엔드 인증 서버에서 검증 후 `Access Token` 및 `Refresh Token`을 발급합니다.
4. Next.js Route Handler가 발급받은 토큰을 브라우저의 `httpOnly` 쿠키에 저장합니다.

## 5. 토큰 저장 및 쿠키 정책

### 5.1 토큰 저장 전략

| Token 종류        | 저장 위치         | 만료 시간 |
| :---------------- | :---------------- | :-------- |
| **Access Token**  | `httpOnly` Cookie | 15분      |
| **Refresh Token** | `httpOnly` Cookie | 7일       |

### 5.2 Cookie 설정 정책

```json
{
  "httpOnly": true, //XSS 공격 방지
  "secure": process.env.NODE_ENV === "production", // Production 환경만 true (Development 환경은 false)
  "sameSite": "lax", // CSRF 공격 방지
  "path": "/" // "/" 하위 모든 경로 쿠키 허용
}
```

## 6. 기술 세부사항

### 6.1 API 명세

#### Endpoint

```text
POST /auth/login
```

#### Request Body

```JSON
{
    "email":"test@example.com",
    "password":"password123"
}
```

#### Responses

```JSON
{
  "user": {
    "id": 1,
    "teamId": "dallaem",
    "email": "test@example.com",
    "name": "홍길동",
    "companyName": "코드잇",
    "image": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 6.2 httpOnly Cookie 사용 이유

#### 토큰을 localStorage나 sessionStorage에 저장하지 않고 httpOnly 쿠키를 사용하는 이유는 다음과 같습니다.

- XSS(Cross-Site Scripting) 공격 방어: JavaScript에서 쿠키에 접근할 수 없으므로 토큰 탈취 위험이 낮습니다.

- 브라우저 자동 전송: 브라우저가 동일 도메인 요청 시 쿠키를 자동으로 포함하므로 관리가 편리합니다. (브라우저 <-> NextJs 서버)

- 클라이언트 사이드 로직 간소화: 클라이언트 애플리케이션 상태 내에 토큰 저장 및 관리 로직이 필요 없습니다.

### 6.2 BFF(Backend For Frontend) 패턴 사용 이유

#### 기존 SPA 방식

```js
Browser ──> Backend API (Authorization: Bearer xxx)
```

#### 문제점:

브라우저가 직접 Authorization 헤더를 생성해야 합니다.
토큰을 JavaScript에서 접근 가능한 저장소(localStorage 등)에 유지해야 하므로 보안에 취약합니다. 쿠키를 직접적으로 교환 시 SameSite, Secure, CORS(Cross-Origin Resource Sharing) 설정 등을 추가로 고려해야 합니다.

#### BFF 방식 (본 아키텍처)

```js
Browser ──(Cookie 자동 전송)──> Next.js (BFF) ──(Authorization Header)──> Backend API
```

#### 동작:

Next.js 서버가 브라우저가 보낸 쿠키를 읽은 후, 백엔드 API를 호출할 때 Authorization: Bearer ${accessToken} 헤더를 동적으로 생성하여 전달합니다.

#### 장점:

클라이언트(브라우저)에서 토큰을 관리 할 필요가 없습니다.

SSR(Server-Side Rendering) 실행 시점에도 안전하게 인증을 처리할 수 있습니다.

브라우저가 백엔드가 아닌 Next.js 서빙 도메인과 통신하므로 CORS(Cross-Origin Resource Sharing) 문제가 감소합니다.

## 6. Middleware 기반 인증 처리

### 6.1 목적 및 라우트 보호

#### Next.js middleware.ts를 통해 모든 페이지 요청을 전처리하며 다음 역할을 수행합니다.

- 보호 페이지 접근 제어 (PROTECTED_ROUTES): 로그인이 필요한 페이지 진입 시 토큰을 검증하고, 유효하지 않으면 로그인 페이지로 리다이렉트합니다.

- 인증 페이지 접근 차단 (AUTH_ROUTES): 이미 로그인된 상태에서 로그인/회원가입 페이지 접근 시 메인 페이지로 리다이렉트합니다.

- Access Token 자동 재발급: 토큰 만료 시 유저 경험을 해치지 않고 백그라운드에서 토큰을 갱신합니다.

```js
const PROTECTED_ROUTES = ["/mypage"]; // 로그인이 필요한 페이지
const AUTH_ROUTES = ["/login", "/signup"]; // 로그인 상태에서는 접근 불가능한 페이지
```

### 6.2 Middleware 인증 흐름

```text
Request
   ↓
Middleware 진입
   ↓
Access Token 확인 ──(존재함)──> 페이지 진입 (Success)
   ↓ (없음/만료)
Refresh Token 확인 ──(없음)──> 로그인 페이지 리다이렉트
   ↓ (존재함)
백엔드 Refresh API 호출
   ↓
새 토큰 발급 및 Cookie 저장
   ↓
페이지 진입 (Success)
```

### 6.3 Access Token 재발급 전략

#### 재발급 조건:

Access Token이 없거나 만료되었지만, Refresh Token이 유효하게 존재하는 경우

#### Endpoint:

```JSON
POST /auth/refresh
```

#### Request Body:

```JSON
{
  "refreshToken": "..."
}
```

#### Responses

```JSON
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 재발급 성공 시:

새롭게 발급된 Access Token을 쿠키에 저장하고 RTR(Refresh Token Rotation) 정책에 따라 새로 갱신된 Refresh Token도 함께 업데이트합니다.

#### 재발급 실패 시:

세션이 만료된 것으로 판단하여 기존 인증 쿠키를 모두 삭제(Clear)하고 메인 페이지나 로그인 페이지로 리다이렉트합니다.

## 7. Server Component 인증 처리

### 7.1 데이터 패칭 방식

Server Component 내부에서는 Next.js Route Handler를 거치지 않고 백엔드 API를 직접 호출(serverFetch)합니다.

```text
Server Component ──(serverFetch)──> Backend API Server
```

### 7.2 선택 이유

next/headers의 cookies()를 통해 서버 내에서 보안 쿠키를 직접 읽을 수 있습니다.

서버 컴포넌트 내에서 바로 백엔드로 통신하므로 브라우저 -> Route Handler -> 백엔드로 이어지는 추가적인 API Hop이 제거되어 성능이 최적화됩니다.

### 7.3 serverFetch의 역할 및 구현 예시

Next.js cookies() 저장소에서 accessToken을 읽어옵니다.

백엔드 API 요청 시 Authorization 헤더에 담아 전송합니다.

```TypeScript
import { cookies } from 'next/headers';

async function serverFetch(url: string, options: RequestInit = {}) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${accessToken}`,
  };

  return fetch(`${process.env.BACKEND_API_URL}${url}`, { ...options, headers });
}
```

## 8. End-to-End 인증 흐름

```text
[Browser Request]
       │
       ▼
 [Middleware] ──(토큰 만료시)──> [Token Refresh] ──> [Cookie Update (Set-Cookie)]
       │
       ▼
[Server Component]
       │
       ▼
 [serverFetch] ──(Authorization: Bearer 토큰)──> [Backend API Server]
                                                         │
 [Browser] <──(렌더링된 HTML / Updated Cookie) <──────────┘
```

# 구글 소셜 로그인 구현

## 1 구글 로그인

### 1.1 인증 흐름 아키텍처

클라이언트는 구글 인증에만 관여하며, 실제 토큰 세션 관리는 Next.js BFF와 백엔드가 전담합니다.
<img width="1579" height="934" alt="Image" src="https://github.com/user-attachments/assets/68047fd4-af8d-4f72-ac42-aaac90dba0fa" />

<!-- ```text
[Browser (Client)]          [Google OAuth]         [Next.js (BFF)]       [Backend API]
        │                         │                       │                     │
        │── 1. 로그인 요청 ──────>│                       │                     │
        │<── 2. Access Token 발급 ─│                       │                     │
        │                         │                       │                     │
        │── 3. POST /api/auth/google (Token 전달) ───────>│                     │
        │                                                 │── 4. Token 전달 ───>│
        │                                                 │                     │ 검증 및 자체
        │                                                 │                     │ 토큰 생성
        │                                                 │<── 5. 자체 토큰 ────│ (AT / RT)
        │                                                 │       (AT / RT)     │
        │<── 6. httpOnly 쿠키 설정 & 200 OK ──────────────│                     │
        │
(window.location.href = "/")
``` -->

### 1.2 API 명세서

#### Description

Google 또는 Kakao OAuth access token으로 로그인합니다. 최초 로그인 시 자동 가입되며, 기존 OAuth 계정은 앱 내 프로필(name/image)을 유지합니다.

#### Endpoint

```text
POST /oauth/google
```

#### Request Body

```JSON
{
    "token": "ya29.a0AFH6SM..."
}
```

#### Responses

```JSON
{
  "user": {
    "id": 1,
    "teamId": "dallaem",
    "email": "test@example.com",
    "name": "홍길동",
    "companyName": "코드잇",
    "image": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 1.3 핵심 로직 및 인터페이스

#### 1. window.google.accounts.oauth2.initTokenClient:

구글 클라이언트 ID와 권한 범위(scope: "email profile")를 정의하여 크레덴셜 요청 클라이언트를 생성합니다.

#### 2. Callback 처리:

구글 팝업 로그인이 완료되면 브라우저는 즉시 access_token을 수신하며, 이 토큰을 은닉하기 위해 외부 백엔드로 직접 쏘지 않고 BFF 경로인 /api/auth/google로 POST 요청을 보냅니다.

#### 3. 세션 리다이렉트:

BFF로부터 200 OK 응답(쿠키 적재 완료)을 받으면 메인 페이지(/)로 페이지를 새로고침/이동시킵니다.

## 2. 카카오 로그인

### 2.1 인증 흐름 아키텍처

클라이언트는 카카오 인증 서버로부터 일회성 인가 코드(Authorization Code)를 받는 역할만 수행하며, 실제 카카오 토큰 발급 및 서비스 세션 관리는 Next.js BFF와 백엔드가 전담합니다.
<img width="2678" height="1362" alt="Image" src="https://github.com/user-attachments/assets/a80d7bf0-0e42-4544-8f94-0a20f7d3d45a" />

<!-- ```text
[Browser (Client)]            [Kakao Auth]           [Next.js (BFF)]         [Backend API]
        │                           │                       │                      │
        │── 1. 로그인 요청 ────────>│                       │                      │
        │<── 2. 인가 코드 발급 ─────│                       │                      │
        │      (?code=...)          │                       │                      │
        │                           │                       │                      │
        │── 3. POST /api/auth/kakao ───────────────────────>│                      │
        │      (인가 코드 전달)     │                       │                      │
        │                           │── 4. 토큰 요청 ──────>│                      │
        │                           │<── 5. 토큰 발급 ──────│                      │
        │                           │    (kakao_token)      │                      │
        │                           │                       │── 6. 토큰 검증 요청 ─>│
        │                           │                       │      (kakao_token)   │
        │                           │                       │                      │ 자체 서비스
        │                           │                       │                      │ 토큰 생성
        │                           │                       │<── 7. 서비스 토큰 ───│ (AT / RT)
        │                           │                       │       (AT / RT)      │
        │<── 8. httpOnly 쿠키 설정 & 200 OK ────────────────│                      │
        │
(router.push("/"))
``` -->

### 2.2 API 명세서

#### Description

Google 또는 Kakao OAuth access token으로 로그인합니다. 최초 로그인 시 자동 가입되며, 기존 OAuth 계정은 앱 내 프로필(name/image)을 유지합니다.

#### Endpoint

```text
POST /oauth/kakao
```

#### Request Body

```JSON
{
    "token": "ya29.a0AFH6SM..."
}
```

#### Responses

```JSON
{
  "user": {
    "id": 1,
    "teamId": "dallaem",
    "email": "test@example.com",
    "name": "홍길동",
    "companyName": "코드잇",
    "image": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 2.3 핵심 로직 및 인터페이스

#### 1. 카카오 토큰 교환:

클라이언트가 전달한 code를 카카오 토큰 엔드포인트로 전송합니다.

#### 2. BFF Proxying & 가입 처리:

카카오에서 발급한 access_token을 적재하여 서비스 백엔드 API 서버(POST {BACKEND_URL}/oauth/kakao)를 호출합니다. 백엔드는 이 토큰으로 회원가입 또는 로그인 세션을 확정합니다.

#### 3. 세션 리다이렉트:

BFF로부터 200 OK 응답(쿠키 적재 완료)을 받으면 메인 페이지(/)로 페이지를 새로고침/이동시킵니다.
