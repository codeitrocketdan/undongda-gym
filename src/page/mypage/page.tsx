"use client";
import MyCreatedDagymSection from "@/features/my-page/ui/MyCreatedDagymSection";
import MyDagymSection from "@/features/my-page/ui/MyDagymSection";
import MyPageCardSkeleton from "@/features/my-page/ui/MyPageCardSkeleton";
import MyReviewSection from "@/features/my-page/ui/MyReviewSection";
import ProfileSection from "@/features/my-page/ui/ProfileSection";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import UnderlineTabs from "@/shared/ui/tab/UnderlineTabs";
import { parseAsString, useQueryState } from "nuqs";
import { Suspense } from "react";

const TABS = [
  { id: 0, name: "나의 다짐" },
  { id: 1, name: "나의 리뷰" },
  { id: 2, name: "내가 만든 다짐" },
];

export default function MyPage() {
  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsString.withDefault(TABS[0].name)
  );
  const validTab = TABS.some((t) => t.name === activeTab)
    ? activeTab
    : TABS[0].name;
  return (
    <div className="inner flex flex-col lg:flex-row lg:gap-10">
      <div className="mb-8 flex flex-col gap-2 md:mb-10 md:gap-6 lg:w-1/5 lg:gap-11">
        <span className="text-base-semibold md:text-2xl-semibold pt-2">
          마이페이지
        </span>
        <ProfileSection />
      </div>
      <div className="lg:w-4/5">
        <div className="mb-11">
          <UnderlineTabs
            tabs={TABS}
            defaultValue={activeTab}
            onChange={setActiveTab}
          />
        </div>
        {/* TODO 나의다짐, 나의리뷰도 ErrorBoundary, Suspense 사용 예정
        // AsyncTabSection.tsx
        function AsyncTabSection({ children }) {
          return (
            <ErrorBoundary fallback={<에러UI />}>
              <Suspense fallback={<스켈레톤 />}>
                {children}
              </Suspense>
            </ErrorBoundary>
          );
        }

        // page.tsx
        <AsyncTabSection>
          {validTab === "나의 다짐" && <MyDagymSection />}
          {validTab === "나의 리뷰" && <MyReviewSection />}
          {validTab === "내가 만든 다짐" && <MyCreatedDagymSection />}
        </AsyncTabSection>
        */}
        {validTab === "나의 다짐" && <MyDagymSection />}
        {validTab === "나의 리뷰" && <MyReviewSection />}
        {validTab === "내가 만든 다짐" && (
          <ErrorBoundary
            fallback={
              <p className="py-20 text-center text-sm text-slate-400">
                불러오는 중 문제가 발생했어요
              </p>
            }
          >
            <Suspense
              fallback={
                <div className="flex flex-col gap-4 lg:gap-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <MyPageCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <MyCreatedDagymSection />
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
}
