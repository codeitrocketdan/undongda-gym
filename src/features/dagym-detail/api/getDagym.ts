import { notFound } from "next/navigation";
import { cache } from "react";
import { serverFetcher } from "@/shared/api/serverFetcher";
import { ApiError } from "@/shared/api/types";
import { Dagym } from "../model/types";

// generateMetadata와 페이지 본문이 같은 다짐을 조회하므로, 한 요청 안에서는
// 백엔드를 한 번만 호출하도록 cache()로 감싼다.

// 이 함수는 SEO 설정 자체가 아니라, "다짐 한 건의 상세 데이터를 서버에서 가져오는 함수"이다.
// 가져온 데이터는 두 군데에 쓰임
// 1. generateMetadata: 이름·설명·이미지를 꺼내 title과 OG 태그를 만듬
// 2. 본문 prefetch: 같은 데이터를 서버 HTML 본문에 넣음
export const getDagym = cache(async (id: string): Promise<Dagym> => {
  try {
    return await serverFetcher.get<Dagym>(`/meetings/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
});
