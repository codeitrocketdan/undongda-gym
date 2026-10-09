import type { MetadataRoute } from "next";
import { SITE_URL } from "@/shared/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 로그인이 필요하거나 검색 결과에 나올 이유가 없는 경로.
      // /favorite은 여기서 막지 않고 페이지의 noindex 메타태그로 처리한다
      // (robots에서 막으면 크롤러가 페이지를 못 읽어 noindex도 못 본다).
      disallow: [
        "/api/",
        "/admin",
        "/mypage",
        "/post/write",
        "/post/*/edit",
        "/dev",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
