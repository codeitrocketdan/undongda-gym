import Ui1 from "@/features/home/ui/Ui1";
import Ui2 from "@/features/home/ui/Ui2";
import Image from "next/image";

const HomePage = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-between bg-white px-16 py-32 sm:items-start dark:bg-black">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <Ui1 />
        <Ui2 />
      </main>
    </div>
  );
};

export default HomePage;
