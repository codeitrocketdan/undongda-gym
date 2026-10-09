# ADR-004: 다짐 상세 페이지 SEO — 서버 렌더링 전환과 메타데이터

- **상태:** Accepted (로컬 dev 서버에서 검증 완료, 배포 후 확인 필요)
- **작성자:** handy-o
- **날짜:** 2026-10-08

## 변경 이력

- 2026-10-08: 최초 작성 — 루트 메타데이터 정비, 다짐 상세 서버 조회·동적 메타데이터·서버 prefetch·에러 화면, 정적 페이지 메타데이터, robots/sitemap

## 배경

Lighthouse SEO 점수는 100점이었지만, 이 점수는 title·description 존재 여부 같은 기본 체크만 본다. 실제 상태는 이랬다.

- 메타데이터가 루트 레이아웃에 하나뿐이라 **모든 페이지의 title과 description이 "운동다짐"으로 같았다.**
- `/dagym-detail/[id]`는 클라이언트에서만 데이터를 가져왔다. 로딩 중에는 `null`을 반환하므로 **서버 HTML에 본문이 없었다.** 검색 엔진과 링크 미리보기(카카오톡 공유 등)가 읽을 내용이 없는 상태였다.
- 삭제된 다짐도 200 응답에 "존재하지 않는 다짐입니다" 문구를 보여줬다(soft 404).
- `<html lang="en">`인데 콘텐츠는 한국어였다.
- `sitemap`, `robots`, canonical이 없었다.

상세 페이지는 서비스의 핵심 콘텐츠이고 공유 링크의 도착지라서, 여기부터 고치기로 했다.

## 고려 대안

### 다짐 데이터를 서버에서 어떻게 한 번만 가져올 것인가

`generateMetadata`(head)와 페이지 본문이 같은 다짐 데이터를 쓴다. 두 함수는 Next가 따로 호출해서 서로 변수를 넘길 수 없다.

| 대안 | 판단 |
|---|---|
| 각자 `serverFetcher.get()` 호출 | 백엔드 요청이 두 번 나갈 수 있다 |
| Next의 `fetch` 자동 중복 제거에 의존 | `serverFetcher`는 토큰 헤더를 붙이고 만료 시 재발급·재시도하는 래퍼라 중복 제거가 걸릴지 보장하기 어렵다 |
| **React `cache()`로 감싼 조회 함수** | 같은 요청 안에서 같은 인자면 결과를 재사용한다. Next 문서도 `fetch`를 직접 못 쓰는 경우 이 방법을 안내한다 |

### 서버에서 가져온 데이터를 캐시에 어떻게 넣을 것인가

| 대안 | 판단 |
|---|---|
| `queryClient.prefetchQuery` (`/dagym`에서 쓰는 방식) | 에러를 삼킨다. 그 안에서 호출된 `notFound()`도 밖으로 전달되지 않는다 |
| **직접 조회 후 `queryClient.setQueryData`** | 404와 에러가 그대로 전달된다 |

### 없는 다짐 화면의 버튼

| 대안 | 판단 |
|---|---|
| 기존처럼 "이전 페이지로 돌아가기"(`router.back()`) | 검색 결과나 공유 링크로 바로 들어온 사람은 돌아갈 이전 페이지가 없다. 클라이언트 컴포넌트여야 한다 |
| **"다짐 목록으로 가기"(`<Link href="/dagym">`)** | 어디서 들어왔든 동작한다. 서버 컴포넌트로 충분하다 |

### sitemap의 다짐 목록 조회

| 대안 | 판단 |
|---|---|
| `serverFetcher` 사용 | 내부에서 `cookies()`를 읽어 sitemap이 요청마다 실행된다. 크롤러가 올 때마다 백엔드 전체 목록을 조회하게 된다 |
| **`fetch` 직접 호출 + `revalidate = 3600`** | 공개 API라 토큰이 필요 없다. 한 시간 단위로 다시 생성된다 |

## 결정

1. 상세 페이지의 서버 컴포넌트(`src/app/dagym-detail/[id]/page.tsx`)에서 다짐을 조회해 **head(메타데이터)와 body(본문)를 모두 서버에서 채운다.** 클라이언트 컴포넌트 `DagymDetailPage`는 수정하지 않는다.
2. 조회는 `cache()`로 감싼 `getDagym` 하나로 통일하고, 404는 그 안에서 `notFound()`로 바꾼다.
3. 공개 목록 페이지는 페이지별 title·description을, 개인 화면은 `noindex`를 준다.
4. `robots.ts`로 크롤링 제외 경로를, `sitemap.ts`로 다짐 상세 주소 목록을 제공한다.

## 내용

### 0단계. 루트 메타데이터 정비 — `src/app/layout.tsx`

```ts
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "운동다짐",
    template: "%s | 운동다짐",
  },
  description: "...",
};
```

- **`metadataBase`**: OG 이미지·canonical처럼 절대 URL이 필요한 필드에 상대 경로를 쓸 수 있게 하는 기준 주소다. 하위 페이지에서 `/dagym-detail/12`라고 쓰면 `https://undongda-gym.vercel.app/dagym-detail/12`로 나간다. 값은 문자열이 아니라 `URL` 객체다.
- **`title.template`**: 하위 페이지가 제목만 넘기면 `%s` 자리에 들어간다. `default`는 하위 페이지가 title을 안 정했을 때의 값이다.
- **`lang="ko"`**: `en`에서 수정.
- `SITE_URL`은 `src/shared/config/site.ts`에 있고 `NEXT_PUBLIC_SITE_URL` 환경변수를 읽는다. layout, robots, sitemap이 같이 쓴다.

### 1단계. 서버 조회 함수 — `src/features/dagym-detail/api/getDagym.ts`

```ts
export const getDagym = cache(async (id: string): Promise<Dagym> => {
  try {
    return await serverFetcher.get<Dagym>(`/meetings/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
});
```

- `cache`는 React가 제공한다. **캐시 범위는 요청 1건**이라 유저 간에 공유되지 않는다(`isFavorited` 같은 유저별 값이 섞이지 않는다).
- `cache()`는 파일 최상위에서 한 번만 호출한다. 함수 안에서 호출하면 매번 새 캐시가 생긴다.
- 인자는 문자열 하나로 받는다. 객체로 받으면 호출마다 새 객체라 같은 인자로 인식되지 않는다.
- `serverFetcher`는 백엔드 경로(`/meetings/...`)를 받는다. 클라이언트 훅의 `/api/meetings/...`와 다르다.
- `return await`여야 `try/catch`가 에러를 잡는다.
- 이 파일에는 `"use client"`가 없어야 하고, 클라이언트 컴포넌트에서 import하면 안 된다.
- 이 함수는 SEO 설정이 아니라 "다짐 한 건을 서버에서 가져오는 함수"다. 그래서 이름에 용도(SEO, prefetch)를 넣지 않고 주석으로 설명했다.

### 2단계. 동적 메타데이터 — `generateMetadata`

```ts
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const dagym = await getDagym(id);

  const title = dagym.name;
  const description = dagym.description
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, DESCRIPTION_MAX_LENGTH);
  const url = `/dagym-detail/${id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: "운동다짐",
      locale: "ko_KR",
      url,
      title,
      description,
      images: [dagym.image || "/opengraph-image.png"],
    },
  };
}
```

| 필드 | 나가는 태그 | 쓰이는 곳 |
|---|---|---|
| `title` | `<title>다짐 이름 \| 운동다짐</title>` | 검색 결과 제목, 브라우저 탭 |
| `description` | `<meta name="description">` | 검색 결과 설명글 |
| `alternates.canonical` | `<link rel="canonical">` | 대표 URL 지정 |
| `openGraph.*` | `<meta property="og:...">` | 링크 미리보기 |

- 함수 이름은 정확히 `generateMetadata`여야 하고 `export`가 있어야 한다. Server Component에서만 쓸 수 있다.
- **`openGraph`는 부모 것과 합쳐지지 않고 통째로 교체된다.** 그래서 title과 description을 `openGraph` 안에 한 번 더 적는다.
- `openGraph.title`에는 `title.template`이 적용되지 않는다. 사이트 이름은 `siteName`이 담당한다.
- 다짐 설명은 `textarea` 입력이라 일반 텍스트다. 줄바꿈과 연속 공백만 정리하고 150자로 자른다.
- 이미지가 없는 다짐은 기본 OG 이미지(`src/app/opengraph-image.png`)로 대체한다.

**canonical**은 사이트 기본 주소가 아니라 "이 페이지의 대표 주소"다. 같은 다짐이 `/dagym-detail/12`, `/dagym-detail/12?tab=기본 정보`(수정 모달의 nuqs 탭 상태), `/dagym-detail/12?utm_source=kakao`처럼 여러 주소로 열릴 수 있는데, canonical을 만들 때 `id`만 쓰므로 셋 다 `/dagym-detail/12`로 같은 값이 나간다. 검색 엔진은 이를 한 페이지로 묶어 처리한다.

### 3단계. 본문 서버 렌더링 — 같은 파일의 `Page`

```tsx
export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();
  queryClient.setQueryData(dagymQueries.detail(id), await getDagym(id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DagymDetailPage id={id} />
    </HydrationBoundary>
  );
}
```

```
이전: 서버가 빈 화면 전송 → 브라우저가 /api/meetings/12 요청 → 응답 후 그림
이후: 서버가 다짐 조회 → react-query 캐시에 담음 → 본문이 채워진 HTML 전송
      → 브라우저는 캐시가 차 있어서 요청 없이 바로 그림
```

- `await getDagym(id)`는 `generateMetadata`가 이미 호출했으므로 `cache()` 덕에 백엔드 요청이 추가로 나가지 않는다.
- `QueryClient`는 함수 안에서 만든다. 요청마다 새로 만들어야 유저 간에 섞이지 않는다.
- **서버가 넣는 쿼리 키와 클라이언트가 찾는 키가 정확히 같아야 한다.** 다르면 에러 없이 다시 요청한다. 양쪽 다 `dagymQueries.detail(id)`를 쓰고 `id`는 URL에서 온 문자열 그대로다. `Number(id)`로 바꾸면 `"12"`와 `12`가 다른 키가 된다.
- `dagymQueries`가 있는 `queries.ts`에는 `"use client"`가 없다. [[features-002-lighthouse-performance]] 6-2에서 겪은 "서버 컴포넌트가 use client 파일의 상수를 import하면 값이 깨지는 문제"는 생기지 않는다.
- 날짜 표시는 `formatInTimeZone`으로 한국 시간에 고정돼 있어 서버와 브라우저의 시간대 차이로 인한 hydration 불일치가 없다.

### 4단계. 에러 화면 — `src/app/dagym-detail/[id]/`

- **`not-found.tsx`**: `getDagym`의 `notFound()`가 호출되면 나온다. "삭제되었거나 존재하지 않는 다짐입니다" 문구와 목록 링크. 서버 컴포넌트다.
- **`error.tsx`**: 백엔드 오류 등 404가 아닌 에러에서 나온다. `"use client"`가 필수다. 다시 시도 버튼은 Next 16 문서 기준인 `unstable_retry`를 쓴다(예전 `reset`과 달리 서버에서 데이터를 다시 가져온다).
- 클라이언트 `DagymDetailPage`의 기존 에러 분기는 그대로 뒀다. 페이지가 뜬 뒤 재조회가 실패하는 경우에 쓰인다.

### 정적 페이지 메타데이터

`src/app/**/page.tsx`가 전부 Server Component라 `metadata`를 바로 export할 수 있다. 메타데이터가 없는 페이지는 루트 값을 물려받고, 일부만 정하면 정한 것만 바뀐다.

| 페이지 | 적용 |
|---|---|
| `/post` | title "다짐 토크", description |
| `/login` | title "로그인", description |
| `/favorite` | title "찜한 다짐", `robots: { index: false }` |

개인 화면을 검색에서 제외하는 것도 SEO다. 내용 없는 페이지가 색인되는 것은 사이트 평가에 도움이 되지 않는다.

### robots — `src/app/robots.ts`

`/robots.txt`로 서빙된다.

```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /admin
Disallow: /mypage
Disallow: /post/write
Disallow: /post/*/edit
Disallow: /dev

Sitemap: https://undongda-gym.vercel.app/sitemap.xml
```

`/favorite`은 여기서 막지 않는다. robots에서 막으면 크롤러가 페이지를 읽지 못해 `noindex` 메타태그도 보지 못한다. "크롤링 금지(robots)"와 "색인 금지(noindex)"는 다른 것이고, 한 페이지에는 둘 중 하나만 건다.

### sitemap — `src/app/sitemap.ts`

`/sitemap.xml`로 서빙된다. 다짐 목록이 무한 스크롤이라 크롤러가 뒤쪽 다짐까지 링크를 타고 가기 어렵다. 그래서 상세 주소를 직접 알려준다.

- 정적 경로 4개(`/`, `/dagym`, `/post`, `/review`) + 다짐 상세 전체.
- 백엔드 목록 API를 커서로 끝까지 순회한다. `size`는 백엔드 허용 최대값인 100이고, 커서가 잘못 내려와도 무한 루프에 빠지지 않도록 50페이지 상한을 뒀다.
- 취소된 다짐(`canceledAt`)은 제외한다.
- `lastModified`는 `updatedAt`을 쓴다.
- `export const revalidate = 3600`으로 한 시간 단위로 다시 생성한다. 이 프로젝트에서 요청 시점 렌더링이 아닌 첫 라우트다.
- 백엔드 조회가 실패하면 정적 경로만 내려준다. sitemap 전체가 500이 되는 것보다 낫다.
- `/post/[id]`는 아직 서버 HTML에 본문이 없어서 넣지 않았다.

### 검증 결과 (로컬 dev 서버, 다짐 id 1567)

크롤러 User-Agent(`facebookexternalhit/1.1`)로 요청해 확인했다.

| 항목 | 결과 |
|---|---|
| title | `감아차기 마스터 \| 운동다짐` |
| description | 다짐 설명 |
| canonical | `https://undongda-gym.vercel.app/dagym-detail/1567` |
| 쿼리스트링을 붙인 주소의 canonical | 위와 동일 |
| og:image | 다짐 생성 때 업로드한 S3 이미지 URL (루트의 `opengraph-image.png`에 덮이지 않음) |
| 서버 HTML 본문 | 다짐 이름, 설명, 이미지 `<img>`, 섹션 포함 |
| 브라우저로 넘기는 캐시 | `dagym > detail > 1567` 키 포함 |
| 없는 다짐 | 응답 코드 404, not-found 문구 |
| `/post`, `/login`, `/favorite` | 페이지별 title, `/favorite`에 `noindex` |
| `/robots.txt` | 위 내용대로 출력 |
| `/sitemap.xml` | URL 53개 (정적 4 + 다짐 49) |

**메타태그 확인 시 주의:** Next 16은 동적 페이지의 메타데이터를 일반 브라우저에는 스트리밍으로 나중에 보내고, HTML만 읽는 크롤러에는 `<head>`에 넣어 보낸다. 브라우저 소스 보기에서는 `<head>`에 안 보일 수 있으므로 크롤러 User-Agent를 붙인 `curl`로 확인한다.

```bash
curl -s -A "facebookexternalhit/1.1" http://localhost:3000/dagym-detail/1567 | grep -oE '<title>[^<]*</title>|<meta (name="description"|property="og:[^"]*")[^>]*>|<link rel="canonical"[^>]*>'
```

## 영향

**좋아진 점**

- 다짐마다 검색 결과 제목·설명과 공유 미리보기가 달라진다.
- 상세 페이지 서버 HTML에 본문이 들어간다. 새로고침 시 빈 화면이 먼저 보이던 것도 없어진다.
- 삭제된 다짐이 실제 404로 응답한다.
- 쿼리스트링이 붙은 주소들이 canonical 하나로 묶인다.
- 크롤러가 무한 스크롤을 거치지 않고 sitemap으로 다짐 상세를 찾는다.

**비용**

- 상세 페이지의 첫 응답(TTFB)이 백엔드 조회 시간만큼 늦어진다. 백엔드 직접 호출은 0.1~0.3초였다.
- 백엔드가 500을 주면 클라이언트 안내 문구 대신 `error.tsx`가 뜬다.

**아직 확인하지 못한 것**

- 브라우저에서의 확인: 새로고침 시 `/api/meetings/{id}` 요청이 나가지 않는지, 콘솔에 hydration 경고가 없는지, 로그인 상태에서 찜·참여 버튼이 맞게 나오는지.
- `error.tsx`: 실제 오류 상황을 만들어 보지 않았다.
- 이미지가 없는 다짐의 기본 OG 이미지 대체: 조회한 다짐이 모두 이미지가 있었다.
- sitemap의 한 시간 캐시: dev 서버는 캐시하지 않으므로 `pnpm build && pnpm start`나 배포 환경에서 확인해야 한다.
- 배포 환경: Vercel에 `NEXT_PUBLIC_SITE_URL`이 없으면 canonical, OG URL, sitemap이 모두 `http://localhost:3000`으로 나간다. 에러 없이 잘못 나가므로 배포 후 값을 확인한다.
- LCP 전후 비교: 측정하지 않았다.

**남은 작업**

- `/post/[id]`에 같은 작업 적용. 페이지가 `useParams`로 id를 읽고 있어 `params`를 받도록 고쳐야 한다. 끝나면 sitemap에 게시글도 추가한다.
- 나머지 정적 페이지 메타데이터: `/dagym`, `/review`, `/signup`, `/mypage`, `/post/write`, `/admin`.
- 상세 페이지에 `<h1>`이 없다. 다짐 이름이 공용 `FeedCard.Title`(`<p>`)로 그려진다(`DagymHero.tsx:118`). 팀원의 공용 컴포넌트·파일이라 이번에는 건드리지 않았고, 팀원과 협의가 필요하다.
- 다짐 상세에 JSON-LD `Event` 스키마(이름, 일시, 장소 좌표, 정원).
- 랜딩(`/`) 정적 생성 검토. 헤더가 쿠키를 읽어 전 페이지가 요청 시점 렌더링인 구조부터 바꿔야 한다.
