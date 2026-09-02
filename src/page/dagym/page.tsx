import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import Image from "next/image";
import {
  fetchJoinedMeetings,
  JOINED_MEETINGS_QUERY_KEY,
} from "@/entities/meeting/api";
import {
  CreateDagym,
  DagymLogSection,
  DashboardCardSection,
  ReservationCard,
} from "@/features/dashboard";
import bannerMobile from "@/shared/assets/images/banner_360.png";
import bannerTablet from "@/shared/assets/images/banner_768.png";
import bannerPc from "@/shared/assets/images/banner_1024.png";
import ScrollToTopButton from "@/shared/ui/button/ScrollTopButton";
import DagymSection from "../home/components/DagymSection";

const DagymPage = async () => {
  const cookieStore = await cookies();
  const isLogin = !!cookieStore.get("accessToken")?.value;

  // ReservationCard가 클라이언트에서 fetch를 마친 뒤에야 LCP 이미지를 렌더링하던 문제를
  // 막기 위해, 서버에서 미리 데이터를 가져와 초기 HTML에 포함시킨다.
  const queryClient = new QueryClient();
  if (isLogin) {
    await queryClient.prefetchQuery({
      queryKey: JOINED_MEETINGS_QUERY_KEY,
      queryFn: fetchJoinedMeetings,
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mx-auto w-full max-w-7xl">
        <main>
          {/* 모바일 로그인 */}
          <div className="mb-6 w-full md:mb-10 lg:mb-12">
            {isLogin && (
              <div className="block md:hidden lg:mb-12">
                <ReservationCard isLogin={isLogin} />
                <DagymLogSection />
                <DashboardCardSection isLogin={isLogin} />
              </div>
            )}

            {/* 배너 */}
            <div
              className={`relative overflow-hidden rounded-4xl ${isLogin ? "hidden md:block" : ""}`}
            >
              <picture>
                <source media="(min-width: 1024px)" srcSet={bannerPc.src} />
                <source media="(min-width: 768px)" srcSet={bannerTablet.src} />
                <Image
                  src={bannerMobile}
                  alt="지금 다짐에 참여해보세요"
                  className="w-full"
                  preload
                  fetchPriority="high"
                />
              </picture>
              {/* 텍스트 */}
              <div className="absolute inset-0 flex flex-col justify-center gap-1.5 px-6 sm:px-10 md:px-14">
                <h2 className="text-lg-bold xs:text-3xl-bold text-gray-900 md:text-4xl">
                  함께 다짐하고, <br className="md:hidden" />
                  매일 운동해요!
                </h2>

                <p className="text-xs-semibold xs:text-sm-semibold md:text-base-semibold text-blue-600">
                  같이해서 더 즐거운 우리의 운동다짐
                </p>
              </div>
            </div>
          </div>
          <DagymSection />
        </main>

        <div className="floating-button justify-row fixed right-5 bottom-5 z-10 flex flex-col items-end gap-2">
          <ScrollToTopButton />
          <CreateDagym isLogin={isLogin} />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default DagymPage;
