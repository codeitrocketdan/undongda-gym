import Ui1 from "@/features/home/ui/Ui1";
import Ui2 from "@/features/home/ui/Ui2";

const HomePage = () => {
  return (
    <div>
      <h1>메인 페이지</h1>
      <div>
        <p className="text-display-lg-bold">디스플레이 폰트</p>
        <p className="text-3xl-bold">3XL 폰트</p>
        <p className="text-2xl-bold">2XL 폰트</p>
        <p className="text-xl-bold">XL 폰트</p>
        <p className="text-lg-bold">LG 폰트</p>
        <p className="text-base-bold">BASE 폰트</p>
        <p className="text-sm-bold">SM 폰트</p>
        <p className="text-xs-bold">XS 폰트</p>
        <p className="text-error-100">에러</p>
      </div>
      <main>
        <Ui1 />
        <Ui2 />
      </main>
    </div>
  );
};

export default HomePage;
