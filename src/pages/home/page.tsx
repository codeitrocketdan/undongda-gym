"use client";
// import { cookies } from "next/headers";
import CreateButton from "@/shared/ui/button/CreateButton";
import ScrollToTopButton from "@/shared/ui/button/ScrollTopButton";
import Header from "@/shared/ui/header/Header";
import MainContent from "./MainContent";

const HomePage = () => {
  // const cookieStore = await cookies();
  // const isLogin = cookieStore.has("accessToken");
  const isLogin = true;
  return (
    <div>
      <Header />
      <main>
        <div className="w-full">
          {/* <MainContent /> */}
          <MainContent isLogin={isLogin} />
        </div>

        <div className="h-[1500px]">fetch해온 데이터</div>
      </main>

      <div className="floating-button justify-row fixed right-5 bottom-5 z-10 flex flex-col items-end gap-2">
        <ScrollToTopButton />
        <CreateButton>모임 만들기</CreateButton>
      </div>
    </div>
  );
};

export default HomePage;
