import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { getDagym } from "@/features/dagym-detail/api/getDagym";
import { dagymQueries } from "@/features/dagym-detail/api/queries";
import DagymDetailPage from "@/page/dagym-detail/page";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const DESCRIPTION_MAX_LENGTH = 150;
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  // 서버에서 미리 조회한 다짐을 react-query 캐시에 넣어 두면, 클라이언트의
  // useDagymDetailQuery가 fetch 없이 첫 렌더부터 본문을 그린다.
  // 서버: 다짐 조회 → react-query 캐시에 담음 → 본문이 채워진 HTML 전송
  // 브라우저: 캐시가 이미 차 있어서 요청 없이 바로 그림
  const queryClient = new QueryClient();
  queryClient.setQueryData(dagymQueries.detail(id), await getDagym(id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DagymDetailPage id={id} />
    </HydrationBoundary>
  );
}
