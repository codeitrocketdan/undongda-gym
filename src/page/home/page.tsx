import ScrollToTopButton from "@/shared/ui/button/ScrollTopButton";
import { cookies } from "next/headers";

import CreateDagym from "./components/CreateDagym";
import DagymLog from "./components/DagymLogSection";
import DagymSection from "./components/DagymSection";

const HomePage = async () => {
  const cookieStore = await cookies();
  const isLogin = !!cookieStore.get("accessToken")?.value;

  return (
    <div>
      <main>
        <div className="mb-6 w-full md:mb-10 lg:mb-12">
          <DagymLog isLogin={isLogin} />
        </div>
        <DagymSection />
      </main>

      <div className="floating-button justify-row fixed right-5 bottom-5 z-10 flex flex-col items-end gap-2">
        <ScrollToTopButton />
        <CreateDagym isLogin={isLogin} />
      </div>
    </div>
  );
};

export default HomePage;
