import Link from "next/link";

const HomePage = () => {
  //   const { user } = useAuth();
  return (
    <div>
      {/* {user ? <div>운동</div> : <div>배너</div>} */}
      <Link href="/mypage">마이페이지</Link>
    </div>
  );
};

export default HomePage;
