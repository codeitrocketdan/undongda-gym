"use client";
import UnderlineTabs from "@/shared/ui/tab/UnderlineTabs";
import { parseAsString, useQueryState } from "nuqs";
import MyCreatedDagymSection from "./components/MyCreatedDagymSection";
import MyDagymSection from "./components/MyDagymSection";
import MyReviewSection from "./components/MyReviewSection";
import ProfileSection from "./components/ProfileSection";

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
        {activeTab === "나의 다짐" && <MyDagymSection />}
        {activeTab === "나의 리뷰" && <MyReviewSection />}
        {activeTab === "내가 만든 다짐" && <MyCreatedDagymSection />}
      </div>
    </div>
  );
}
