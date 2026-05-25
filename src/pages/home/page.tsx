"use client";
const HomePage = () => {
  return (
    <div>
      <button
        onClick={async () => {
          try {
            const res = await fetch("/api/me");
            console.log(res);

            if (!res.ok) {
              return null;
            }
            const data = await res.text();
            console.log(data);
            // return res.json();
          } catch (error) {
            console.log(error);
          }
        }}
      >
        버튼
      </button>
    </div>
  );
};

export default HomePage;
