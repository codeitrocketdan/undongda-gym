import type { MetadataRoute } from "next";
import { MeetingListResponse } from "@/features/dagym/types";
import { SITE_URL } from "@/shared/config/site";
import { buildListParams } from "@/shared/lib/buildListParams";

// 요청마다 백엔드 전체 목록을 조회하지 않도록 한 시간 단위로 다시 생성한다.
export const revalidate = 3600;

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
// 백엔드가 허용하는 size 최대값
const PAGE_SIZE = 100;
// 커서가 잘못 내려와도 무한 루프에 빠지지 않도록 하는 상한
const MAX_PAGES = 50;

const STATIC_ROUTES = ["/", "/dagym", "/post", "/review"];

// serverFetcher는 cookies()를 읽어서 이 라우트를 요청마다 실행되게 만든다.
// 공개 목록 API라 토큰이 필요 없으므로 fetch를 직접 호출해 캐시되게 한다.
async function fetchAllMeetings() {
  const meetings: MeetingListResponse["data"] = [];
  let cursor: string | null = null;

  for (let page = 0; page < MAX_PAGES; page++) {
    const params = buildListParams({
      sortBy: "createdAt",
      sortOrder: "desc",
      size: PAGE_SIZE,
      cursor,
    });
    const response = await fetch(`${API_URL}/meetings?${params}`, {
      next: { revalidate },
    });
    if (!response.ok) {
      throw new Error(`sitemap: 다짐 목록 조회 실패 (${response.status})`);
    }

    const { data, nextCursor, hasMore }: MeetingListResponse =
      await response.json();
    meetings.push(...data);

    if (!hasMore || !nextCursor) break;
    cursor = nextCursor;
  }

  return meetings;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "daily",
    priority: path === "/" ? 1 : 0.8,
  }));

  try {
    const meetings = await fetchAllMeetings();
    const dagymEntries: MetadataRoute.Sitemap = meetings
      // 취소된 다짐은 검색 결과로 유입시킬 이유가 없다
      .filter((meeting) => !meeting.canceledAt)
      .map((meeting) => ({
        url: `${SITE_URL}/dagym-detail/${meeting.id}`,
        lastModified: meeting.updatedAt ?? meeting.createdAt ?? undefined,
        changeFrequency: "weekly",
        priority: 0.6,
      }));

    return [...staticEntries, ...dagymEntries];
  } catch (error) {
    // 백엔드 장애로 sitemap 전체가 500이 되는 것보다 정적 경로만이라도 내려주는 편이 낫다
    console.error(error);
    return staticEntries;
  }
}
