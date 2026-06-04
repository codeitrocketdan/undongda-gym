"use client";
// import { cookies } from "next/headers";
import { CreateDagymForm } from "@/features/create-dagym";
import CreateButton from "@/shared/ui/button/CreateButton";
import ScrollToTopButton from "@/shared/ui/button/ScrollTopButton";
import { useModal } from "@/shared/ui/modal/useModal";
import DagymSection from "./components/DagymSection";
import MainContent from "./MainContent";

const HomePage = () => {
  // const cookieStore = await cookies();
  // const isLogin = cookieStore.has("accessToken");
  const modal = useModal();
  const isLogin = true;
  return (
    <div>
      <main>
        <div className="mb-6 w-full md:mb-10 lg:mb-12">
          <MainContent isLogin={isLogin} />
        </div>

        <DagymSection />
      </main>

      <div className="floating-button justify-row fixed right-5 bottom-5 z-10 flex flex-col items-end gap-2">
        <ScrollToTopButton />
        <CreateButton onClick={modal.open}>모임 만들기</CreateButton>
      </div>

      {modal.isOpen && <CreateDagymForm onClose={modal.close} />}
    </div>
  );
};

export default HomePage;
