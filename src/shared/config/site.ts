// 사이트의 대표 주소. canonical, OG URL, sitemap, robots가 모두 이 값을 기준으로 절대 URL을 만든다.
// 배포 환경(Vercel)에도 NEXT_PUBLIC_SITE_URL을 설정해야 localhost로 나가지 않는다.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
